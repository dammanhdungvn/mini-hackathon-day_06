# Hướng dẫn Khởi chạy Ứng dụng Web - AI Hotel Advisor

Tài liệu này hướng dẫn cách cài đặt và khởi chạy dự án **AI Hotel Advisor** ở môi trường local của bạn, bao gồm cả Frontend (React/Express) và Backend (FastAPI).

---

## 1. Cấu trúc Dự án
* **`/web`**: Mã nguồn Frontend viết bằng React (Vite + TypeScript) và Express Server làm API Gateway.
* **`/backend`**: Mã nguồn FastAPI Python xử lý nghiệp vụ AI, tính điểm tương thích của khách sạn.
* **`data_hotel.py`**: Cơ sở dữ liệu danh sách khách sạn Phú Quốc (dùng chung cho cả hai đầu).

---

## 2. Yêu cầu Hệ thống
Bạn cần cài đặt sẵn trên máy:
* **Node.js** (Phiên bản v18 trở lên)
* **Python** (Phiên bản 3.10 trở lên)

---

## 3. Các bước khởi chạy chi tiết

### BƯỚC 1: Khởi chạy Frontend (React + Express Server)
Máy chủ Frontend tích hợp sẵn cơ chế **Local Fallback** thông minh. Chỉ cần khởi chạy bước này là ứng dụng đã có thể hoạt động được 100% nhờ khả năng tự động đọc dữ liệu qua tiến trình Python ngầm.

1. Mở terminal và di chuyển vào thư mục `/web`:
   ```bash
   cd web
   ```
2. Cài đặt các thư viện Node.js:
   ```bash
   npm install
   ```
3. Cấu hình biến môi trường (Tùy chọn cho Live AI):
   * Copy file cấu hình mẫu `.env.example` thành `.env`:
     ```bash
     cp .env.example .env
     ```
   * Mở file `.env` mới tạo và điền khóa API Gemini của bạn vào mục `GEMINI_API_KEY="..."` để kích hoạt tính năng chat trực tiếp với AI.
4. Chạy chế độ phát triển (Development):
   ```bash
   npm run dev
   ```
   * Ứng dụng sẽ khả dụng ngay tại địa chỉ: **[http://localhost:3000](http://localhost:3000)**.

---

### BƯỚC 2: Khởi chạy Python Backend (FastAPI - Tùy chọn)
Khi bạn chạy cả FastAPI Server, hệ thống Express Gateway sẽ tự động định tuyến toàn bộ yêu cầu tính độ phù hợp khách sạn và hội thoại thông minh sang máy chủ Python chạy ở cổng `8000`.

1. Mở một cửa sổ terminal mới từ thư mục gốc dự án.
2. Tạo môi trường ảo Python (khuyên dùng) và cài đặt thư viện cần thiết:
   ```bash
   python -m venv venv
   # Kích hoạt trên Windows:
   .\venv\Scripts\activate
   # Cài đặt các dependencies:
   pip install fastapi uvicorn google-genai python-dotenv
   ```
3. Cấu hình biến môi trường cho Backend:
   * Tạo tệp `.env` bên trong thư mục `backend/` hoặc thư mục gốc:
     ```env
     GEMINI_API_KEY="KEY_API_GEMINI_CỦA_BẠN"
     ```
4. Khởi chạy FastAPI Server:
   ```bash
   cd backend
   python main.py
   ```
   * Máy chủ FastAPI sẽ khởi chạy tại: **[http://localhost:8000](http://localhost:8000)**.

---

## 4. Hướng dẫn Trải nghiệm trên Giao diện (Demo)

Khi truy cập vào **`http://localhost:3000`**, bạn có thể trải nghiệm các tính năng đặc thù:

1. **View Mode (Chế độ hiển thị)**:
   * **User Mode (Guest View)**: Trải nghiệm đặt phòng và chat mượt mà của khách du lịch.
   * **Admin Mode (Engineer View)**: Hiển thị thanh giám sát Token AI và cấu trúc câu lệnh hệ thống (System Prompt) cho kỹ sư.
2. **Demo Controls (Kịch bản Hackathon)**:
   * **Happy Case**: Nhấn để thử nghiệm trường hợp đủ thông tin Phú Quốc, ngân sách khớp.
   * **Error Case**: Thử nghiệm khi người dùng quên nhập Điểm đến / Ngân sách.
   * **Low Confidence**: Thử nghiệm tình huống mâu thuẫn lớn (Yêu cầu resort 5 sao VIP nhưng ngân sách chỉ 800k VNĐ).
3. **Trạng thái kết nối (Live AI vs Mock Mode)**:
   * Gạt nút **Bật Live AI** trên Sidebar để chuyển đổi qua lại giữa **Kênh API Gemini thật** (sử dụng API Key) và **Chế độ Giả lập Offline** (phản hồi tự động mượt mà không lo lỗi tải/mạng).
