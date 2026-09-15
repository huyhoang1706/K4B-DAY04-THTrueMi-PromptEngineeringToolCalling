# TEAM — Day04, K4-L3B

**Làm nhóm.** Mỗi người tự viết và commit phần INDIVIDUAL của mình.

## Thông tin bài nộp

- Tên nhóm: TH True Mi
- Người đại diện / MSSV: Mai Huy Hoàng / 2A202602685
- Tên repo: `K4B-DAY04-THTrueMi-PromptEngineeringToolCalling`
- URL repo, nhánh nộp, commit chốt:
  - URL repo: https://github.com/huyhoang1706/K4B-DAY04-THTrueMi-PromptEngineeringToolCalling
  - nhánh nộp: main
- Deadline áp dụng và link thông báo đổi hạn nếu có:

## Thành viên

| Họ và tên | MSSV | GitHub | Vai trò và công việc | File/commit/PR |
|---|---|---|---|---|
| Mai Huy Hoàng | 2A202602685 | [huyhoangg1706](https://github.com/huyhoang1706) | Technical Leader; UI, tích hợp backend, chạy group/adversarial eval và transcript | `4fe4c5d`, `f15a5b5`, `db5ccd2`, `1455eb2`; PR #9, #22, #25 |
| Nguyễn Thị Hải Mi | 2A202602667 | [haimi612003](https://github.com/haimi612003) | Teammate; chạy eval, version log và report | `fee7e07`, `98a93c3`, `8d7230a`, `525bdc1`; PR #4, #15, #17, #21 |
| Trần Nguyễn Trí Dũng | 2A202602784 | [bananayass](https://github.com/bananayass) | Teammate; phân tích prompt và cải thiện `system_prompt.md` | `2a170df`, `05d76d8`, `0bd2ada`, `dce92ab`, `fdf1e99`; PR #5, #10, #14, #20 |
| Nguyễn Đức Đông | 2A202602367 | [nguyenducdong22](https://github.com/nguyenducdong22) | Teammate; viết group eval và phân tích run | `5265a9e`, `c92f105`, `f2c185b`; PR #3, #6, #19 |
| Văn Thành Huy | 2A202602763 | [thanhhuyvan](https://github.com/thanhhuyvan) | Teammate; phân tích tool và cải thiện `tools.md` | `05287ed`, `e2703de`, `2b550fd`, `280a46d`, `df12455`; PR #7, #11, #13, #16 |

## Nhận xét chung

- Kết quả và bằng chứng: Case accuracy của bộ base tăng từ 21/30 ở v0 lên
  30/30 ở v3. Với artifact v3, bộ group đạt 5/10 và bộ adversarial đạt 11/12;
  cả hai run có `provider_error_cases = 0` và `measured_cases = total_cases`.
  Bằng chứng gồm `version_log.csv`, các file trong `starter_v0/runs/`, bốn
  transcript v3, UI/API và lịch sử commit/PR của từng thành viên.

- Thay đổi hiệu quả nhất: Việc bổ sung quy tắc không tự đoán ID, bắt buộc hỏi
  lại khi thiếu thông tin, xác nhận đúng payload trước khi tạo ticket và thiết
  lập trust boundary cho user/tool result giúp bộ base tăng từ 70% lên 100%.
  Mô tả tool rõ phạm vi và tham số cũng giảm lỗi chọn sai tool và sai argument.

- Giới hạn còn lại: Bộ group mới đạt 5/10, còn lỗi chọn giá trị argument, hỏi
  lại chưa đúng loại câu trả lời và xử lý trust boundary. Bộ adversarial còn
  thất bại ở A03: model cố gọi `create_ticket` với `summary` rỗng, nhưng runtime
  đã chặn nên không tạo ticket. Kết quả cho thấy base đạt 30/30 chưa chứng minh
  agent tổng quát hóa tốt cho mọi cách diễn đạt.

- Cách phân công và tích hợp: Dũng phân tích và cải thiện system prompt; Huy
  phân tích và cải thiện tool schema; Mi chạy các vòng eval v0–v3, cập nhật
  version log và report; Đông viết group cases và phân tích run; Hoàng phụ
  trách UI, AG-UI backend, chạy group/adversarial và tạo transcript. Các phần
  được tích hợp vào `main` qua PR, sau đó đối chiếu artifact hash, run,
  transcript và commit trước khi chốt.

## INDIVIDUAL

Sao chép mục này cho từng thành viên.

### Trần Nguyễn Trí Dũng - 2A202602784

- Phần việc và file/commit/PR: Phân tích lỗi prompt từ run v0, viết các file
  `analysis/v0-prompt.md`, `analysis/v1-prompt.md`, `analysis/v2-prompt.md`,
  `analysis/v3-prompt.md`; cải thiện `starter_v0/artifacts/system_prompt.md`.
  Commit trực tiếp: `8d8d85d` (cập nhật thông tin Dũng), `2a170df` (phân tích
  v0), `05d76d8` và `0bd2ada` (v1), `dce92ab` (v2), `fdf1e99` (v3).
  PR tích hợp: #20; merge commit: `b91fd8d`.
- Quyết định, khó khăn và cách xử lý: Chọn cải thiện bằng rule prompt rõ ràng
  trước, giữ nguyên bộ eval để so sánh công bằng; các thay đổi về schema/mô tả
  tool tách sang `tools.yaml`. Khó khăn chính là model có thể tự suy đoán ID,
  dùng confirmation cũ hoặc tin text giả dạng tool/assistant. Xử lý bằng quy
  tắc clarify, confirmation gắn với payload hiện tại, và trust boundary cho
  user text/tool result.
- Điều đã học: Prompt tốt cần nêu điều kiện và hành động cụ thể, ví dụ thiếu
  ID thì gọi `clarify(response_type="text")`; không chỉ yêu cầu chung chung là
  “hãy hỏi lại”. Prompt giúp giảm lỗi nhưng không thay thế runtime guardrail
  cho write action và dữ liệu nhạy cảm.
- AI/công cụ đã dùng và cách kiểm tra: Dùng Codex/AI để hỗ trợ phân tích trace
  và soạn rule prompt; dùng Git để đối chiếu commit/hash; dùng `run_eval.py`
  với fixed eval cases để kiểm tra. Đọc cả `actual_tool_calls`, `tool_results`,
  metric và `provider_error_cases`, không chỉ dựa vào automatic score.
- Thời điểm đã tự nộp URL repo chung trên VLearn: 22:37:16 15/9/2026

### Nguyễn Đức Đông — 2A202602367

- Phần việc và file/commit/PR: Viết `starter_v0/data/eval_group.json`; dùng `scripts/parse_runs.py` trích xuất CSV từ run; chỉ ra nhóm lỗi ưu tiên từ kết quả thực tế; commit bảng so sánh v0–v3, phân tích regression và phân tích ít nhất 3 adversarial cases.
  Commit trực tiếp: `5265a9e` (group eval), `c92f105` (parse CSV & phân tích run), `f2c185b` (so sánh v0–v3 & adversarial cases).
  PR liên quan: #3, #6, #19.
- Quyết định, khó khăn và cách xử lý: Chuẩn hóa xuất CSV bằng `scripts/parse_runs.py` để so sánh v0–v3 minh bạch. Khó khăn chính là phân tích các trường hợp adversarial cases phức tạp vi phạm trust boundary. Xử lý bằng cách phân tích theo 4 mục: Expected boundary, Actual calls, Tác động thực tế và Kết luận.
- Điều đã học: Đánh giá được trust boundary và các dạng lỗi tool calling phổ biến; hiểu rõ hiện tượng regression khi tối ưu prompt; biết phân tích dựa trên dữ liệu thực nghiệm thay vì cảm tính.
- AI/công cụ đã dùng và cách kiểm tra: Dùng `scripts/parse_runs.py` xuất CSV; dùng AI Assistant phân tích log/transcript; kiểm tra đối soát thủ công giữa `expected_tool` và `actual_tool` để đảm bảo báo cáo chính xác.
- Thời điểm đã tự nộp URL repo chung trên VLearn: 22:45:00 15/9/2026

### Văn Thành Huy - 2A202602763

- Phần việc và file/commit/PR: Phân tích tool/input trong
  `analysis/v0-tools.md`; cải thiện `starter_v0/artifacts/tools.yaml` và ghi
  lý do trong `analysis/v1-tools-rationale.md`, `analysis/v2-tools.md`,
  `analysis/v3-tool.md`. Commit đóng góp: `da2b70c` (phân tích ban đầu),
  `3581b7a` (tool declaration v1), `41f73e2` (phân tích v2), `877f007`
  (tool declaration và phân tích v3).
- Quyết định và cách xử lý: Làm rõ điều kiện chọn tool, hỏi lại khi thiếu ID
  và yêu cầu xác nhận trước khi tạo ticket. Từ các lỗi trong run v1, bổ sung
  `response_type` vào danh sách bắt buộc của `clarify`, làm rõ cách chọn
  category cho `search_kb`, và hướng dẫn dùng `clarify` trước `create_ticket`.
  Khó khăn cá nhân: Vấn đề về tool không được gọi, cần phân tích kỹ prompt và 
   tool.
- Điều đã học: phân biệt sai tool, sai tham số và lỗi thực thi; 
  vì sao giá trị mặc định có thể giúp tool
  chạy đúng nhưng vẫn không đạt yêu cầu kiểm thử; giới hạn của mô tả tool
  đối với việc bảo đảm xác nhận.
- AI/công cụ đã dùng và cách kiểm tra: Dùng Codex hỗ trợ đọc source, phân
  tích trace, sửa mô tả/schema và soạn bản nháp báo cáo; dùng Git để quản lý
  thay đổi. Đã kiểm tra YAML, đối chiếu tên tool/tham số với registry và đọc
  cả arguments lẫn tool results trong run v1.
- Thời điểm đã tự nộp URL repo chung trên VLearn: 9:04:51 PM 15/9/2026.

### Nguyễn Thị Hải Mi - 2A202602667

- Phần việc và file/commit/PR: Chạy eval chính thức (openai / gpt-4o-mini, bộ
  `data/eval_base.json`) cho v0–v3, lưu run trong `starter_v0/runs/` và ghi
  `starter_v0/artifacts/version_log.csv` sau từng vòng; điền mục A2, A3, B1,
  B2, B4a (v0) trong `starter_v0/artifacts/REPORT.md`.
  - `fee7e07` (PR #4): baseline v0 — base 21/30, adversarial 5/12, extension
    6/10; phân tích 9 case FAIL và 7 case adversarial.
  - `98a93c3` (PR #15): v1 (prompt của Dũng, commit `10c1c34`) — base 26/30.
  - `8d7230a` (PR #17): v2 (tools.yaml của Huy, commit `88b9808`) — base 28/30.
  - `525bdc1` (PR #21): v3 (bản cuối, commit `b91fd8d`) — base 30/30.
  - `65da56f` (PR #12): REPORT A2 (bảng 9 tool) và A3 (câu hỏi mẫu).
  - `8e36645` (PR #1): thông tin thành viên trong TEAM.md.
- Quyết định, khó khăn và cách xử lý:
  - Prompt và tools được hai bạn merge cùng lúc với cùng nhãn "v1"/"v3", nên
    một run trên `main` sẽ gộp hai thay đổi. Mình chạy từng vòng tại đúng
    commit của vòng đó (dùng `git worktree`) để v1 và v2 mỗi vòng chỉ đổi một
    artifact; v3 chạy trên bản cuối và ghi rõ trong version log là gộp
    `system_prompt.md` + `tools.yaml`.
  - Trước mỗi run kiểm tra hash prompt/tools khác vòng trước và code Python
    không đổi; sau mỗi run kiểm tra `provider_error_cases = 0`,
    `measured_cases = total_cases`, đọc `tool_results` và thư mục `tickets/`.
  - Khó khăn:
Lúc đầu chưa có API key nên chưa chạy được v0.
Dũng và Huy merge thay đổi cùng lúc và cùng đặt nhãn "v1", sau đó lại cùng "v3", nên phải quyết định chạy ở commit nào.
Hiểu vì sao cùng một nhãn version lại phải kiểm tra bằng hash.
File phân tích của Dũng dẫn tới run không tồn tại, và có con số "v2" khác với log.
Cùng artifact v3 nhưng A10 lúc bị vượt qua (tạo ticket thật), lúc không.

- Điều đã học:
Điểm tự động PASS nhưng tool vẫn trả kết quả rỗng: ở v2, H03 không tìm được bài KB nào.
Bộ base đạt 30/30 nhưng bộ nhóm tự viết chỉ đạt 5/10.
Có những lần agent không làm hại được, nhưng là nhờ code của tool chặn chứ không phải prompt (A05, A12 ở v0).
Mỗi vòng chỉ đổi 1 thứ thì mới biết thay đổi nào có tác dụng.
Temperature 0 vẫn cho kết quả khác nhau giữa các lần chạy.

- AI/công cụ đã dùng và cách kiểm tra: Dùng Claude Code (Claude Opus 5) để
  chạy lệnh eval, đọc run JSON, soạn bảng phân tích, version log, commit và
  PR. Kiểm tra lại bằng cách đối chiếu hash artifact trong run với commit,
  xem `actual_tool_calls`/`tool_results` từng case FAIL và kiểm tra không
  commit `.env` hay ticket phát sinh.
- Thời điểm đã tự nộp URL repo chung trên VLearn: 23:45:00 PM 15/9/2026.

### Mai Huy Hoàng - 2A202602685

- Phần việc và file/commit/PR: Làm Technical Leader; dựng giao diện chat trong
  `ui/`; tích hợp frontend với backend AG-UI trong `api.py`; cấu hình CORS cho
  frontend ở port 5173; tách dependency API vào `requirements-api.txt`; viết
  `tests/test_api.py`; dùng AI Elements cho prompt input, tool widget và render
  Markdown. Chạy bộ group và adversarial bằng OpenAI `gpt-4o-mini`, đồng thời
  tạo bốn transcript v3 cho yêu cầu bình thường, thiếu thông tin, hủy yêu cầu
  và xác nhận hành động ghi dữ liệu.
  - `4fe4c5d` (PR #9): scaffold giao diện chat.
  - `f15a5b5`, `db5ccd2` (PR #22): tích hợp AG-UI API, hoàn thiện UI và hiển
    thị tool call/input/result.
  - `1455eb2` (PR #25): chạy group 5/10, adversarial 11/12 và lưu bốn
    transcript; cả hai run có `provider_error_cases = 0`.
- Quyết định, khó khăn và cách xử lý: Chọn tái sử dụng provider, tool registry
  và tool executor của `starter_v0` trong API để tránh tạo thêm một luồng xử lý
  khác với CLI; chuyển kết quả sang các event AG-UI để TanStack AI nhận được cả
  text và vòng đời tool call. Phần khó là đồng bộ định dạng `UIMessage` với SSE,
  ghép đúng `toolCallId`, render Markdown và xử lý style Tailwind. Mình xử lý
  bằng test cho text/CORS, clarification và provider error; sau đó dùng
  `PromptInput`, `Tool` và `MessageResponse` của AI Elements thay cho component
  tự viết. Với eval, mình giữ nguyên kết quả chưa hoàn hảo làm bằng chứng thay
  vì sửa hoặc chạy lại để che lỗi: bộ group còn sai argument/trust boundary và
  adversarial còn một case A03.
- Điều đã học: UI hiển thị được câu trả lời chưa đủ để chứng minh agent chạy
  đúng; cần kiểm tra riêng contract SSE, input/result của tool và trạng thái lỗi.
  Kết quả base v3 đạt cao không bảo đảm tổng quát hóa sang case nhóm hoặc dữ
  liệu đối kháng, vì group chỉ đạt 5/10 và adversarial đạt 11/12. Với hành động
  ghi dữ liệu, confirmation trong prompt cần đi cùng validation ở runtime; ở
  case A03, model vẫn gọi `create_ticket` sai nhưng tool đã chặn do thiếu
  `summary`.
- AI/công cụ đã dùng và cách kiểm tra: Dùng Codex để hỗ trợ dựng UI/API, chẩn
  đoán lỗi tích hợp và rà soát code; dùng Git và GitHub CLI để đối chiếu commit,
  PR; dùng OpenAI `gpt-4o-mini`, `run_eval.py` và `chat.py` để tạo run/transcript
  thật. Đã chạy `pnpm run build` thành công; kiểm tra trực tiếp summary của hai
  run, `actual_tool_calls`, `tool_results`, trạng thái từng transcript và xác
  nhận không đưa API key hay ticket phát sinh vào commit.
- Thời điểm đã tự nộp URL repo chung trên VLearn: 23:45:32 15/9/2026
