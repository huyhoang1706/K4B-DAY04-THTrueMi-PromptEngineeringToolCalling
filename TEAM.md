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
| Mai Huy Hoàng | 2A202602685 | [huyhoangg1706](https://github.com/huyhoang1706) | Technical Leader; UI và tích hợp backend | `4fe4c5d`, `f15a5b5`, `db5ccd2`; PR #9, #22 |
| Nguyễn Thị Hải Mi | 2A202602667 | [haimi612003](https://github.com/haimi612003) | Teammate; chạy eval, version log và report | `fee7e07`, `98a93c3`, `8d7230a`, `525bdc1`; PR #4, #15, #17, #21 |
| Trần Nguyễn Trí Dũng | 2A202602784 | [bananayass](https://github.com/bananayass) | Teammate; phân tích prompt và cải thiện `system_prompt.md` | `2a170df`, `05d76d8`, `0bd2ada`, `dce92ab`, `fdf1e99`; PR #5, #10, #14, #20 |
| Nguyễn Đức Đông | 2A202602367 | [nguyenducdong22](https://github.com/nguyenducdong22) | Teammate; viết group eval và phân tích run | `5265a9e`, `c92f105`, `f2c185b`; PR #3, #6, #19 |


## Nhận xét chung

- Kết quả và bằng chứng:
- Thay đổi hiệu quả nhất:
- Giới hạn còn lại:
- Cách phân công và tích hợp:

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
