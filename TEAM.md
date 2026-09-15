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
| Văn Thành Huy | 2A202602763 | [thanhhuyvan](https://github.com/thanhhuyvan) | Teammate; phân tích tool và cải thiện `tools.md` | `05287ed`, `e2703de`, `2b550fd`, `280a46d`, `df12455`; PR #7, #11, #13, #16 |

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
   tool.0
   
- Điều đã học: phân biệt sai tool, sai tham số và lỗi thực thi; 
  vì sao giá trị mặc định có thể giúp tool
  chạy đúng nhưng vẫn không đạt yêu cầu kiểm thử; giới hạn của mô tả tool
  đối với việc bảo đảm xác nhận.
- AI/công cụ đã dùng và cách kiểm tra: Dùng Codex hỗ trợ đọc source, phân
  tích trace, sửa mô tả/schema và soạn bản nháp báo cáo; dùng Git để quản lý
  thay đổi. Đã kiểm tra YAML, đối chiếu tên tool/tham số với registry và đọc
  cả arguments lẫn tool results trong run v1.
- Thời điểm đã tự nộp URL repo chung trên VLearn: 9:04:51 PM 15/9/2026.

### Họ và tên - MSSV
