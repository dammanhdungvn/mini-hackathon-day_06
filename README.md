# AI Hotel Advisor - Demo Local

Demo này tập trung vào giao diện và luồng xử lý nội bộ cho AI Hotel Advisor. Hiện tại chưa cần tách thành tài liệu API riêng; chỉ cần chạy app trong thư mục `web` là có thể mở giao diện, nhập thông tin chuyến đi, xem danh sách khách sạn và chat ở chế độ mock/local.

Backend Python trong thư mục `backend` chỉ là phần tham khảo để mở rộng sau. Luồng demo hiện tại chạy trực tiếp trong `web/server.ts`.

## Cấu trúc chính

```text
mini-hackathon-day_06/
|-- README.md
|-- data_hotel.py          # Dữ liệu khách sạn Phú Quốc
|-- system_promts.txt      # Prompt hệ thống cho AI
|-- backend/               # Backend Python tham khảo
|   |-- main.py
|   |-- tools.py
|   |-- requirements.txt
|   `-- .env.example
`-- web/                   # App chính để chạy demo
    |-- server.ts          # Server local kết nối UI với luồng xử lý
    |-- package.json
    |-- .env.example
    `-- src/               # React UI
```

## Yêu cầu

- Node.js 18 trở lên.
- Python 3.12 chỉ cần dùng khi muốn chạy backend Python tùy chọn.
- Gemini API key chỉ cần dùng khi muốn bật Live AI.

## Chạy demo giao diện

Từ thư mục dự án:

```powershell
cd D:\day6\mini-hackathon-day_06\web
npm install
npm run dev
```

Mở trình duyệt:

```text
http://localhost:3000
```

Với cách chạy này, app đã đủ để demo giao diện. Nếu chưa cấu hình Gemini hoặc chưa chạy backend Python, hệ thống tự dùng mock/local fallback.

## Cấu hình Live AI trong web

Nếu muốn thử Gemini ngay trong luồng web:

```powershell
cd D:\day6\mini-hackathon-day_06\web
Copy-Item .env.example .env
```

Sửa `web\.env`:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

Sau đó chạy lại:

```powershell
npm run dev
```

Nếu không có key, cứ để mặc định. Demo vẫn chạy bằng mock mode.

## Backend Python tham khảo

Chỉ chạy phần này nếu muốn kiểm thử riêng luồng Python + Gemini tool calling. App web hiện tại không phụ thuộc vào bước này.

Từ thư mục gốc:

```powershell
cd D:\day6\mini-hackathon-day_06
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
Copy-Item backend\.env.example backend\.env
```

Sửa `backend\.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Chạy backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Lưu ý: đây là luồng kiểm thử riêng. Demo giao diện vẫn chạy bằng `web/server.ts` và không cần bật backend Python.

## Chỉnh giao diện

Các file cần sửa nhiều nhất khi chỉnh UI:

- `web\src\App.tsx`: layout chính và state của app.
- `web\src\components\Sidebar.tsx`: thanh điều khiển demo.
- `web\src\components\TripSummaryCard.tsx`: form thông tin chuyến đi.
- `web\src\components\HotelMatches.tsx`: danh sách khách sạn phù hợp.
- `web\src\components\AIChat.tsx`: khung chat.
- `web\src\index.css`: style global.

Sau khi sửa, Vite sẽ tự reload trình duyệt khi đang chạy `npm run dev`.

## Chỉnh dữ liệu và prompt

- Sửa `data_hotel.py` nếu muốn đổi danh sách khách sạn.
- Sửa `system_promts.txt` nếu muốn đổi giọng văn, luật trả lời hoặc guardrail của AI.
- Sửa `backend\tools.py` nếu muốn đổi cách lọc khách sạn trong luồng Python tùy chọn.
- Sửa `web\server.ts` nếu muốn đổi mock response hoặc fallback logic đang phục vụ demo.

## Script hữu ích

Trong `web`:

```powershell
npm run dev      # chạy demo local
npm run build    # build production
npm run start    # chạy bản build
npm run lint     # kiểm tra TypeScript
```

Trong thư mục gốc, kiểm tra Python backend nếu cần:

```powershell
.\.venv\Scripts\python.exe -m compileall backend data_hotel.py
```

## Lỗi thường gặp

Nếu `http://localhost:3000` không mở được:

```powershell
cd D:\day6\mini-hackathon-day_06\web
npm install
npm run dev
```

Nếu port `3000` đang bị chiếm:

```powershell
netstat -ano | Select-String ":3000"
```

Nếu Live AI không trả lời:

- Kiểm tra `GEMINI_API_KEY` trong `web\.env` hoặc `backend\.env`.
- Nếu chỉ cần demo UI, tắt Live AI hoặc để hệ thống dùng mock mode.

## Ghi chú

- Không commit `.env` hoặc API key.
- Với mục tiêu chỉnh giao diện, chỉ cần tập trung vào thư mục `web`.
- Phần `backend` có thể giữ lại để mở rộng sau, nhưng không bắt buộc cho demo UI hiện tại.
