# Helpdesk chat UI

React/Vite UI for the Day04 Helpdesk Agent. It uses TanStack AI for chat state,
shadcn/ui for primitive controls, and Vercel AI Elements for conversation and
message views.

## Run

```bash
pnpm install
pnpm dev
```

By default the client sends SSE requests to `http://localhost:8000/api/chat`.
Set `VITE_CHAT_ENDPOINT` when the agent server runs elsewhere:

```bash
VITE_CHAT_ENDPOINT=http://localhost:8000/api/chat pnpm dev
```

The endpoint must accept the TanStack AI chat request and return an AG-UI
`text/event-stream`. TanStack emits `text`, `tool-call`, and `tool-result`
message parts, which the UI renders as a chat message plus an inspectable tool
card containing its input, result, or error state.

## Verify

```bash
pnpm build
pnpm lint
```
