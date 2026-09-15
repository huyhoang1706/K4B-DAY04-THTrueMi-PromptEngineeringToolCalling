import json
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from fastapi.testclient import TestClient
import api


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(api.app)

    def run_chat(self, provider):
        with patch.object(api, "make_provider", return_value=provider):
            response = self.client.post("/api/chat", json={
                "threadId": "test-thread", "runId": "test-run",
                "messages": [{"role": "user", "parts": [{"type": "text", "content": "Help"}]}],
            })
        self.assertEqual(response.status_code, 200)
        return [json.loads(line[6:]) for line in response.text.splitlines() if line.startswith("data: ")]

    def test_text_and_cors(self):
        provider = SimpleNamespace(complete=lambda *a, **k: SimpleNamespace(text="Hello", tool_calls=[]))
        events = self.run_chat(provider)
        self.assertEqual(events[0]["type"], "RUN_STARTED")
        self.assertEqual(events[-1]["type"], "RUN_FINISHED")
        self.assertEqual(events[2]["delta"], "Hello")
        response = self.client.options("/api/chat", headers={
            "Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type,x-run-id",
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-origin"], "http://localhost:5173")

    def test_clarification(self):
        call = SimpleNamespace(name="clarify", args={"question": "Which device?"})
        provider = SimpleNamespace(complete=lambda *a, **k: SimpleNamespace(text=None, tool_calls=[call]))
        with patch.object(api, "execute_tool_call", return_value={"result": {"awaiting_user": True, "question": "Which device?"}}):
            events = self.run_chat(provider)
        self.assertEqual([e["type"] for e in events][1:5], ["TOOL_CALL_START", "TOOL_CALL_ARGS", "TOOL_CALL_END", "TOOL_CALL_RESULT"])
        self.assertEqual(events[1]["toolCallId"], events[4]["toolCallId"])
        self.assertEqual(events[-1]["type"], "RUN_FINISHED")

    def test_provider_error(self):
        def fail(*args, **kwargs):
            raise RuntimeError("test provider failure")
        with self.assertLogs(api.logger, level="ERROR"):
            events = self.run_chat(SimpleNamespace(complete=fail))
        self.assertEqual(events[-1]["type"], "RUN_ERROR")
        self.assertNotIn("test provider failure", events[-1]["message"])


if __name__ == "__main__":
    unittest.main()
