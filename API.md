# Helpdesk API

Chạy từ thư mục gốc repo, Python 3.11 trở lên:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements-api.txt
API_PROVIDER=openai API_MODEL=gpt-4o-mini .venv/bin/uvicorn api:app --host 127.0.0.1 --port 8000
```

Đặt API key trong `starter_v0/.env` theo `.env.example`, hoặc dùng `DAY04_ENV_FILE` để chỉ định file khác. Không commit file chứa key.
`API_PROVIDER` hỗ trợ `openai`, `openrouter`, `anthropic`, `gemini`; bỏ `API_MODEL` để dùng model mặc định của provider. `API_MAX_TOOL_ROUNDS` mặc định 4, tối đa 16.

- `GET /health`: kiểm tra API đang chạy (không kiểm tra kết nối model).
- `POST /api/chat`: nhận `messages`, `threadId`, `runId`; hỗ trợ cả `content` dạng chuỗi và `parts` dạng text của TanStack.
- Trả SSE theo AG-UI: run started, text start/content/end, tool start/args/end/result, run finished hoặc run error.
- CORS cho `http://localhost:5173` và `http://127.0.0.1:5173`, gồm header `X-Run-Id`.

FE hiện dùng sẵn `http://localhost:8000/api/chat`; có thể đổi bằng `VITE_CHAT_ENDPOINT`.
API tái sử dụng prompt, tool declarations, provider và tool execution của `starter_v0`. Lịch sử text do FE gửi mỗi lượt; API không lưu session. Tool results được đưa lại vào model trong lượt hiện tại theo cách của starter.

Provider của starter chưa stream token: API phát sự kiện khi hoàn tất mỗi bước model/tool. Ngắt kết nối sẽ ngừng các bước tiếp theo; lời gọi đồng bộ đã chạy trong worker thread có thể vẫn hoàn tất. Timeout một run là 120 giây.
Đây là API chạy local cho dữ liệu giả lập của lab, chưa có xác thực để public lên Internet.

Protocol reference: https://docs.ag-ui.com/quickstart/server
