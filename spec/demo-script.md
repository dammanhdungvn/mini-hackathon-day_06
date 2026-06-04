# 🎬 Kịch bản Demo — Voyage Intelligence

## Chuẩn bị trước Demo

### 1. Cấu hình API Key
```bash
# Đảm bảo file codebase/backend/.env có API key hợp lệ
DASHSCOPE_API_KEY=<api-key-thực>
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen3-max
```

### 2. Khởi động App
```bash
cd codebase/web
npm install
npm run dev
# Mở http://localhost:3000
```

### 3. Kiểm tra kết nối
- Mở trình duyệt → `http://localhost:3000/api/health`
- Phải trả về JSON: `{ "status": "ok", "provider": "alibaba-model-studio", ... }`

---

## 4 Kịch bản Demo

### 🟢 Kịch bản 1: Happy Case — Đầy đủ thông tin

**Mục tiêu**: Chứng minh AI hiểu context và gọi tool chính xác.

| Tham số | Giá trị |
|---------|---------|
| Điểm đến | Phú Quốc |
| Ngân sách | 2.0M VND / đêm |
| Số khách | 2 |
| Phong cách | Yên tĩnh, cặp đôi |
| Ưu tiên | Sát bãi biển, nghỉ dưỡng |

**Bước thực hiện**:
1. Click nút **"Happy Case"** trên Sidebar
2. Quan sát Trip Summary cập nhật tự động
3. Quan sát Hotel Matches hiển thị khách sạn tầm trung phù hợp
4. Gửi message: *"Tôi và bạn gái muốn nghỉ dưỡng ở Phú Quốc 3 ngày, ngân sách khoảng 2 triệu/đêm, ưu tiên sát biển"*
5. Chờ AI phản hồi

**Kết quả mong đợi**:
- ✅ AI gọi tool `fetch_matching_hotels` (toolCallMode: `model-tool-call`)
- ✅ AI gợi ý 2-3 khách sạn tầm trung sát biển
- ✅ Mỗi gợi ý có lý do cụ thể từ dữ liệu
- ✅ Toggle Admin mode → xem Tool Output hiển thị args và mode

---

### 🔴 Kịch bản 2: Error Case — Thiếu thông tin

**Mục tiêu**: Chứng minh app không crash khi thiếu dữ liệu.

| Tham số | Giá trị |
|---------|---------|
| Điểm đến | *(trống)* |
| Ngân sách | Chưa xác định |
| Phong cách | Nhộn nhịp |
| Ưu tiên | Gần trung tâm mua sắm |

**Bước thực hiện**:
1. Click nút **"Error Case"** trên Sidebar
2. Quan sát: Hotel Matches hiển thị empty state
3. Quan sát: Analysis text báo "Thông tin chưa đủ"

**Kết quả mong đợi**:
- ✅ App không lỗi, hiển thị graceful
- ✅ Empty state thông báo rõ ràng

---

### 🟡 Kịch bản 3: Low Confidence — Mâu thuẫn ngân sách

**Mục tiêu**: Chứng minh AI phát hiện mâu thuẫn và hỏi lại.

| Tham số | Giá trị |
|---------|---------|
| Điểm đến | Phú Quốc |
| Ngân sách | 0.8M VND / đêm |
| Phong cách | Sang trọng bậc nhất |
| Ưu tiên | Resort 5 sao siêu sang, bãi biển riêng biệt lập |

**Bước thực hiện**:
1. Click nút **"Low Confidence"**
2. Gửi message: *"Tôi muốn resort 5 sao siêu sang"*
3. Quan sát response

**Kết quả mong đợi**:
- ✅ AI phát hiện ngân sách 800k/đêm mâu thuẫn với yêu cầu 5 sao
- ✅ AI hỏi lại hoặc đề xuất điều chỉnh ngân sách
- ✅ Không bịa ra khách sạn 5 sao giá 800k

---

### 🔵 Kịch bản 4: Freestyle — Chat tự do

**Mục tiêu**: Chứng minh AI xử lý được hội thoại mở.

| Tham số | Giá trị |
|---------|---------|
| Mọi trường | *(trống)* |

**Bước thực hiện**:
1. Click nút **"Freestyle"**
2. Gửi: *"Tôi muốn đi Phú Quốc"*
3. Chờ AI hỏi thêm (Low Confidence path)
4. Trả lời: *"Đi gia đình 4 người, ngân sách thoải mái"*
5. Chờ AI gợi ý

**Kết quả mong đợi**:
- ✅ AI hỏi thêm chi tiết ở lần đầu (đúng guardrail)
- ✅ Sau khi có đủ info, AI gọi tool và gợi ý
- ✅ Conversation context được giữ qua nhiều lượt

---

## Checklist kiểm tra sau Demo

| # | Kiểm tra | Trạng thái |
|---|----------|------------|
| 1 | App khởi động không lỗi | ☐ |
| 2 | `/api/health` trả JSON hợp lệ | ☐ |
| 3 | Happy Case: AI gọi tool thành công | ☐ |
| 4 | Error Case: App xử lý graceful | ☐ |
| 5 | Low Confidence: AI phát hiện mâu thuẫn | ☐ |
| 6 | Freestyle: Hội thoại nhiều lượt | ☐ |
| 7 | Admin mode hiển thị tool output | ☐ |
| 8 | Trip parameters chỉnh sửa được | ☐ |
| 9 | Hotel cards hiển thị đúng thông tin | ☐ |
| 10 | Modal Chi tiết / Đặt phòng hoạt động | ☐ |

---

## API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/health` | GET | Kiểm tra kết nối Alibaba, model, prompt |
| `/api/chat` | POST | Gửi message cho AI, nhận response |
| `/api/hotels` | POST | Lọc khách sạn theo trip info |
| `/api/demo-cases` | GET | Lấy 4 demo case definitions |

### Tool Call Modes

| Mode | Ý nghĩa |
|------|---------|
| `model-tool-call` | AI tự gọi tool theo prompt — **lý tưởng** |
| `server-fallback` | AI chưa gọi tool, server tự extract criteria và chạy tool — vẫn trả dữ liệu đúng |
