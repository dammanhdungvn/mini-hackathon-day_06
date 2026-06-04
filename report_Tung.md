# Nhật ký Dự án AI Hotel Advisor - Tung Report

Nhật ký này lưu lại lịch sử thay đổi chỉnh sửa và những nội dung đã được thực hiện trong quá trình xây dựng giao diện Streamlit cho sản phẩm hackathon **AI Hotel Advisor**.

## Thông tin dự án
- **Tên dự án**: AI Hotel Advisor
- **Nhà phát triển**: Nguyễn Hoàng Thanh Tùng
- **Vai trò AI**: Senior Python Streamlit Developer & UI Designer
- **Công nghệ sử dụng**: Streamlit, Python, HTML/CSS custom

---

## Lịch sử thay đổi và tiến độ

### Ngày 04/06/2026

#### 10:00 - Khởi tạo dự án và Lập kế hoạch
* **Hoạt động**:
  * Tiếp nhận yêu cầu dự án về giao diện chatbot AI Hotel Advisor với cấu trúc 3 cột đặc trưng (Decision Engine, Workspace, Conversation).
  * Viết tài liệu `implementation_plan.md` bằng tiếng Việt và nhận được sự phê duyệt của người dùng.
  * Khởi tạo tệp theo dõi tiến độ `task.md`.
  * Tạo tệp nhật ký `report_Tung.md` này để lưu trữ lịch sử chỉnh sửa.

#### 10:15 - Phát triển và Hoàn thiện ứng dụng (`app.py`)
* **Hoạt động**:
  * Tạo tệp `app.py` chứa toàn bộ logic ứng dụng trong một tệp duy nhất.
  * **Thiết lập giao diện SaaS 3 cột**: Cột 1 (Decision Engine), Cột 2 (Workspace), Cột 3 (Conversation).
  * **Cài đặt logic demo**: Các nút bấm tại Sidebar chuyển đổi nhanh các ca demo. Bộ lọc từ khóa thông minh phân loại kịch bản.
  * **Chạy thử nghiệm**: Khởi động thành công server Streamlit tại cổng `8501`.

#### 10:40 - Tách CSS, Thêm Animations và Sửa lỗi UI
* **Hoạt động**:
  * **Tách CSS**: Trích xuất toàn bộ khối CSS từ `app.py` sang một tệp riêng biệt tên là `style.css`.
  * **Thêm hiệu ứng Animations**: Keyframes `fadeInUp` và `fadeIn` cho bong bóng chat và các thẻ. Hiệu ứng hover nhấc nhẹ và bóng mờ cho các `.hotel-card`.
  * **Sửa lỗi hiển thị hướng dẫn OpenAI**: Đưa văn bản hướng dẫn vào trong docstring của hàm `def doc_openai_integration():` không được gọi.

#### 11:15 - Tích hợp 2 Chế độ hiển thị (View Mode)
* **Hoạt động**:
  * **Lựa chọn View Mode**: Thêm radio button tại Sidebar để lựa chọn giữa `User Mode` (Guest View) và `Admin Mode` (Engineer View).
  * **Xây dựng cấu trúc Guest Mode**: Chỉ hiển thị thông tin hành trình và ẩn workflow kỹ thuật. Sử dụng từ ngữ thân thiện.
  * **Xây dựng cấu trúc Engineer Mode**: Hiển thị Decision Engine đầy đủ tiến trình và thẻ AI Debug Parameters.
  * **Hiển thị Badge Mode ở Header**: In badge tương ứng: `Guest View` (xanh dương) hoặc `Engineer View` (tím) ngay trên đầu.

#### 11:30 - Chuyển đổi cấu trúc thư mục, Liên kết dữ liệu Phú Quốc
* **Hoạt động**:
  * **Di chuyển mã nguồn**: Chuyển tệp mã nguồn và CSS vào thư mục [web/app.py](file:///d:/AI20K/Day%206%20-%20Hackathon!/mini-hackathon-day_06/web/app.py) và [web/style.css](file:///d:/AI20K/Day%206%20-%20Hackathon!/mini-hackathon-day_06/web/style.css).
  * **Nạp dữ liệu thực tế Phú Quốc**: 
    * Loại bỏ hoàn toàn mock data tĩnh trong app.py.
    * Thực hiện import động danh sách `PHU_QUOC_HOTELS_DB` từ tệp [data_hotel.py](file:///d:/AI20K/Day%206%20-%20Hackathon!/mini-hackathon-day_06/data_hotel.py).
    * Áp dụng quy tắc nghiêm ngặt của `.agent.md`: **Không chỉnh sửa bất cứ nội dung gì bên trong tệp `data_hotel.py`**.
  * **Cập nhật kịch bản Phú Quốc**: Hiệu chỉnh toàn bộ logic so khớp từ khóa, hồ sơ du lịch, các gợi ý nhanh và 3 kịch bản demo (Happy, Error, Low Confidence) tương thích hoàn hảo với dữ liệu các khách sạn ở Phú Quốc.
  * **Sửa lỗi đường dẫn cấu trúc**: Sử dụng `os.path` để xác định chính xác thư mục chứa tệp nhằm giải quyết triệt để lỗi nạp `style.css` khi máy chủ được khởi chạy từ thư mục gốc thông qua lệnh `streamlit run web/app.py`.
