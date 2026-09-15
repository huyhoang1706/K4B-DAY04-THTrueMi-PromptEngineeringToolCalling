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
| Mai Huy Hoàng | 2A202602685 | | Technical Leader | |
| Nguyễn Thị Hải Mi | 2A202602667 | | Teammate | |
| Trần Nguyễn Trí Dũng | 2A202602784 | | Teammate | |
| Nguyễn Đức Đông | 2A202602367 | | Teammate — TV4: Phân tích & xuất bảng run CSV | `starter_v0/artifacts/run_analysis.csv` |


## Nhận xét chung

- Kết quả và bằng chứng:
- Thay đổi hiệu quả nhất:
- Giới hạn còn lại:
- Cách phân công và tích hợp:

## INDIVIDUAL

### Nguyễn Đức Đông — 2A202602367

- Phần việc và file/commit/PR:
  - Xuất bảng phân tích kết quả run từ các file JSON bằng `scripts/parse_runs.py` sang file `starter_v0/artifacts/run_analysis.csv`.
  - Phân tích và phân loại 4 nhóm lỗi ưu tiên từ 52 ca chạy thực tế (base 30 cases, adversarial 12 cases, extension 10 cases).
- Quyết định, khó khăn và cách xử lý:
  - Khó khăn: Dữ liệu log JSON từng run riêng biệt khó đối chiếu tổng thể các dạng lỗi giữa các bộ test.
  - Quyết định: Sử dụng script `parse_runs.py` trích xuất thành bảng phẳng CSV để lọc theo `case_failure_type` và `observed_mismatch`, nhận diện nhóm lỗi nghiêm trọng nhất là `wrong_boundary` (model tự gán `confirmed=true` tạo ticket trái phép).
- Điều đã học:
  - Hiểu rõ cơ chế an toàn và boundary khi tích hợp Tool Calling với các hành động ghi dữ liệu (write actions), tầm quan trọng của việc buộc model qua bước `clarify` (Human-in-the-loop).
- AI/công cụ đã dùng và cách kiểm tra:
  - Python (`scripts/parse_runs.py`), kiểm tra đủ 52 dòng dữ liệu khớp với 3 file run JSON trong `runs/`.
- Thời điểm đã tự nộp URL repo chung trên VLearn:
