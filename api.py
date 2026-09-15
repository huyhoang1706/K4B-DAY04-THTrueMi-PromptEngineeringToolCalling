"""AG-UI HTTP adapter for the unchanged starter_v0 helpdesk runtime."""
from __future__ import annotations

import asyncio
import json
import logging
import os
from pathlib import Path
import sys
from typing import Any, Literal
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from ag_ui.core import (
    RunStartedEvent, RunFinishedEvent, RunErrorEvent,
    TextMessageStartEvent, TextMessageContentEvent, TextMessageEndEvent,
    ToolCallStartEvent, ToolCallArgsEvent, ToolCallEndEvent, ToolCallResultEvent,
)
from ag_ui.encoder import EventEncoder

# The starter uses script-relative imports (providers, tools, env_loader).
STARTER = Path(__file__).resolve().parent / "starter_v0"
sys.path.insert(0, str(STARTER))
from chat import (  # noqa: E402
    assistant_tool_message, execute_tool_call, tool_results_message,
    load_tool_declarations, to_openai_tools, make_provider,
)

logger = logging.getLogger(__name__)
app = FastAPI(title="Day04 Helpdesk AG-UI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept", "X-Run-Id"],
    expose_headers=["X-Run-Id"],
)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system", "developer", "tool"]
    content: str | None = None
    parts: list[dict[str, Any]] = Field(default_factory=list)


class ChatInput(BaseModel):
    # Accept TanStack UIMessage parts as well as AG-UI text messages.
    threadId: str = Field(default_factory=lambda: str(uuid4()))
    runId: str | None = None
    messages: list[ChatMessage] = Field(min_length=1, max_length=200)


def model_messages(payload: ChatInput) -> list[dict[str, str]]:
    messages = [{"role": "system", "content": (STARTER / "artifacts/system_prompt.md").read_text()}]
    for message in payload.messages:
        if message.role not in ("user", "assistant"):
            continue  # The server owns system instructions and tool execution.
        content = message.content
        if content is None:
            content = "\n".join(
                part.get("content", "") for part in message.parts
                if part.get("type") == "text" and isinstance(part.get("content"), str)
            )
        if content:
            messages.append({"role": message.role, "content": content})
    return messages


def text_events(text: str):
    message_id = str(uuid4())
    yield TextMessageStartEvent(message_id=message_id, role="assistant")
    if text:
        yield TextMessageContentEvent(message_id=message_id, delta=text)
    yield TextMessageEndEvent(message_id=message_id)


async def run_events(payload: ChatInput, request: Request, run_id: str):
    yield RunStartedEvent(thread_id=payload.threadId, run_id=run_id)
    try:
        provider = make_provider(os.getenv("API_PROVIDER", "openai"))
        model = os.getenv("API_MODEL") or None
        tools = to_openai_tools(load_tool_declarations(STARTER / "artifacts/tools.yaml"))
        messages = model_messages(payload)
        max_rounds = max(1, min(int(os.getenv("API_MAX_TOOL_ROUNDS", "4")), 16))
        async with asyncio.timeout(120):
            for _ in range(max_rounds):
                if await request.is_disconnected():
                    return
                response = await asyncio.to_thread(provider.complete, messages, tools, model=model, temperature=0.0)
                if not response.tool_calls:
                    for event in text_events(response.text or ""):
                        yield event
                    break
                if len(response.tool_calls) > 16:
                    raise ValueError("Too many tool calls in one round")
                messages.append(assistant_tool_message(response.text, response.tool_calls))
                results = []
                for call in response.tool_calls:
                    if await request.is_disconnected():
                        return
                    call_id = str(uuid4())
                    yield ToolCallStartEvent(tool_call_id=call_id, tool_call_name=call.name)
                    yield ToolCallArgsEvent(tool_call_id=call_id, delta=json.dumps(call.args, ensure_ascii=False))
                    yield ToolCallEndEvent(tool_call_id=call_id)
                    result = await asyncio.to_thread(execute_tool_call, call)
                    yield ToolCallResultEvent(message_id=str(uuid4()), tool_call_id=call_id, content=json.dumps(result["result"], ensure_ascii=False, default=str), role="tool")
                    results.append(result)
                    if isinstance(result["result"], dict) and result["result"].get("awaiting_user"):
                        for event in text_events(result["result"].get("question") or "Bạn bổ sung thêm thông tin nhé."):
                            yield event
                        yield RunFinishedEvent(thread_id=payload.threadId, run_id=run_id)
                        return
                messages.append(tool_results_message(results))
            else:
                yield RunErrorEvent(message="Đã đạt giới hạn số lượt gọi tool.", code="TOOL_ROUND_LIMIT")
                return
        yield RunFinishedEvent(thread_id=payload.threadId, run_id=run_id)
    except asyncio.CancelledError:
        raise
    except Exception:
        logger.exception("Helpdesk run failed: %s", run_id)
        yield RunErrorEvent(message="Không thể hoàn tất yêu cầu. Kiểm tra cấu hình provider và log API.", code="AGENT_ERROR")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/chat")
async def chat(payload: ChatInput, request: Request):
    run_id = payload.runId or request.headers.get("X-Run-Id") or str(uuid4())
    encoder = EventEncoder()

    async def stream():
        async for event in run_events(payload, request, run_id):
            yield encoder.encode(event)

    return StreamingResponse(stream(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache", "X-Accel-Buffering": "no", "X-Run-Id": run_id,
    })
