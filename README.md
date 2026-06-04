# AI Hotel Advisor - Demo Local

Kiến trúc hiện tại:

- `web`: chỉ giữ giao diện React và server proxy nhẹ.
- `backend`: xử lý dữ liệu khách sạn, gọi tool `fetch_matching_hotels`, tạo prompt và gọi Alibaba Model Studio.
- Chat bắt buộc dùng API Alibaba `qwen3-max`. Không có mock reply khi thiếu key.

## Cấu trúc

```text
mini-hackathon-day_06/
|-- data_hotel.py
|-- system_promts.txt
|-- backend/
|   |-- main.py
|   |-- tools.py
|   |-- .env
|   |-- .env.example
|   `-- requirements.txt
`-- web/
    |-- server.ts
    |-- .env
    |-- .env.example
    |-- package.json
    `-- src/
```

## 1. Cấu Hình API Key

Paste key vào `backend\.env`:

```env
DASHSCOPE_API_KEY=YOUR_REAL_KEY_HERE
DASHSCOPE_BASE_URL=https://ws-7z0pgh6qqcnccram.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen3-max
```

`web\.env` chỉ cần trỏ về backend:

```env
BACKEND_URL=http://127.0.0.1:8000
APP_URL=http://localhost:3000
```

## 2. Chạy Backend

```powershell
cd D:\day6\mini-hackathon-day_06
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Nếu chưa có `.venv`:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

## 3. Chạy Web

Mở terminal khác:

```powershell
cd D:\day6\mini-hackathon-day_06\web
npm install
npm run dev
```

Mở:

```text
http://localhost:3000
```

## Luồng Xử Lý

1. React UI gọi `web/server.ts`.
2. `web/server.ts` proxy request sang backend qua `BACKEND_URL`.
3. Backend dùng `fetch_matching_hotels` trong `backend/tools.py` để lấy dữ liệu khách sạn.
4. Backend đưa kết quả tool vào prompt.
5. Backend gọi Alibaba Model Studio endpoint `/chat/completions` với model `qwen3-max`.
6. Kết quả trả về UI.

## Lưu Ý

- Không có API key thì chat trả lỗi cấu hình, không trả lời giả.
- Không paste key vào code.
- Chỉ chỉnh giao diện trong `web/src`.
- Chỉnh logic tool trong `backend/tools.py`.
- Chỉnh prompt/provider trong `backend/main.py`.
