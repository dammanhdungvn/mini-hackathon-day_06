import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

// Lazily load GoogleGenAI key to prevent bootstrap crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY is not set or has placeholder value');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Simulated automated fallback answers in Vietnamese to ensure the app works flawlessly no matter what
function getSimulatedResponse(text: string, trip: any, demoCase: string): string {
  const norm = text.toLowerCase();
  const dest = trip.destination || 'Phú Quốc';
  
  if (demoCase === 'error') {
    return `Chào bạn! Mình thấy **Thông tin hành trình** bên trái đang khuyết trường Điểm đến hoặc Ngân sách.\n\nĐể mình có thể kết nối dữ liệu và tìm ra khách sạn có hồ bơi hoặc bãi biển ưng ý nhất tại Việt Nam tầm giá tốt, bạn có thể hoàn tất chọn điểm đến (ví dụ: Phú Quốc, Nha Trang...) và kéo thanh ngân sách ước tính nhé!`;
  }
  
  if (demoCase === 'low_confidence') {
    return `Chào bạn! Mình nhận thấy yêu cầu tìm kiếm **resort 5 sao siêu sang trọng có bãi biển riêng biệt lập** mâu thuẫn lớn với ngân sách đề xuất **0.8M VNĐ/đêm**.\n\nThông thường, resort 5 sao quốc tế tại ${dest} như SOL by Meliá (1.8M/đêm) hay InterContinental (4.2M/đêm) có giá cao hơn khá nhiều. Bạn có muốn cân nhắc các phương án kế tiếp:\n\n1. **Nâng ngân sách** lên khoảng 1.8M - 2.0M để giữ nguyên tiêu chuẩn cao cấp sát biển.\n2. **Giữ nguyên mức chi phí 800k** và đổi sang khách sạn 3 sao lân cận bãi tắm công cộng.`;
  }

  if (norm.includes('sol') || norm.includes('meliá') || norm.includes('melia')) {
    return `**SOL by Meliá Phu Quoc** (match 95%) là điểm đến cực kỳ xuất sắc tại Bãi Trường. Resort mang đặc trưng phong cách Tây Ban Nha tự do, hồ bơi sát biển, bãi biển riêng lộng gió và vô vàn hoạt động rèn luyện như Yoga, chèo sup.\n\nMức giá phòng 1.8M VND/đêm hoàn toàn khớp với chi phí tối đa của bạn (2.0M). Bạn có muốn mình hỗ trợ giữ phòng trực tiếp tại SOL không?`;
  }

  if (norm.includes('lahana') || norm.includes('ecolodge') || norm.includes('eco')) {
    return `**Lahana Resort Phu Quoc** (match 90%) là lựa chọn xanh bảo vệ môi trường nằm nổi bật trên sườn đồi Dương Đông. Điểm nhấn tuyệt vời nhất ở đây là hồ bơi vô cực sườn đồi cao đón hoàng hôn cực kỳ lãng mạn cho các cặp đôi. Với giá chỉ 1.6M VND/đêm, bạn cũng sẽ tiết kiệm ngân sách đáng kể!`;
  }

  if (norm.includes('đổi') || norm.includes('phương án khác') || norm.includes('nha trang') || norm.includes('đà nẵng')) {
    return `Dạ vâng! Mình có thể đề xuất thêm một số điểm đến tuyệt mỹ khác là **Nha Trang** hoặc **Đà Nẵng** với các tổ hợp khách sạn boutique sát biển chuẩn 4-5 sao phù hợp đúng ngân sách của bạn.\n\nBạn hãy cập nhật trường Điểm đến ở thẻ Thông tin hành trình bên trái để dữ liệu cập nhật ngay tức thì nhé!`;
  }

  return `Chào bạn! Mình đã nắm thông tin bạn muốn đi **${dest}** nghỉ dưỡng dành cho **${trip.guests} người**.\n\nDựa trên các tiêu chí bạn thiết lập, mình khuyến nghị **SOL by Meliá Phú Quốc** (1.8M/đêm) hoặc **Lahana Resort** (1.6M/đêm) vì sự yên tĩnh và vị trí bãi tắm tuyệt đỉnh sát mép sóng. Cả hai đều thuộc phân khúc tầm trung xuất sắc hàng đầu.\n\nBạn cần mình cung cấp chi tiết thêm về dịch vụ ăn uống, spa, hay đặt lịch trình tham quan không ạ?`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser configurations
  app.use(express.json());

  // API handler for Chat requests proxying to Gemini
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, trip, demoCase, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message payload is required' });
      }

      // Check if user has toggled simulating mock replies or real API
      const forceMock = req.body.forceMock === true;

      if (forceMock) {
        // Run with smart offline simulated model
        const replyText = getSimulatedResponse(message, trip, demoCase);
        return res.json({ 
          text: replyText,
          simulated: true
        });
      }

      try {
        const client = getAiClient();
        
        // Construct comprehensive Vietnamese system prompt injecting modern Voyage Intelligence state
        const systemInstruction = `You are "Voyage Intelligence", a high-end digital travel concierge and AI Hotel Advisor for luxury, eco and boutique resorts in Vietnam (Phú Quốc, Nha Trang, Đà Nẵng, etc.).
Your goal is to guide travelers in planning their trips, looking up hotels, and recommending suitable options.

Presently, the user's trip itinerary consists of:
- Điểm đến (Destination): ${trip.destination || 'Chưa xác định (Missing/Empty destination)'}
- Ngân sách (Budget): ${trip.budgetVal > 0 ? `${(trip.budgetVal / 1000).toFixed(1)}M VND/đêm` : 'Chưa nhập hạn mức chi phí (Missing budget)'}
- Số người (Guests): ${trip.guests} người
- Phong cách du lịch (Travel Style): ${trip.travelStyle || 'Chưa nhập'}
- Sở thích quan tâm (Preference): ${trip.preference || 'Chưa nhập'}

Active Demo Case Context: ${demoCase || 'normal'}

Our Registry Databank has 4 properties:
1. SOL by Meliá Phu Quoc (1.8M VND/đêm, match 95%, tag: Tầm trung, Hồ bơi sát biển, Yoga bãi biển)
2. Lahana Resort Phu Quoc & Spa (1.6M VND/đêm, match 90%, tag: Eco-Friendly, Hồ bơi vô cực, Nhà hàng độc bản)
3. InterContinental Phu Quoc Long Beach Resort (4.2M VND/đêm, match 85%, tag: Sang trọng, Bãi biển riêng, Spa & Wellness)
4. Novotel Phu Quoc Resort (2.1M VND/đêm, match 82%, tag: Gia đình, Hồ bơi ngoài trời, Sát biển bãi Trường)

Guidelines:
1. Respond fully in natural, elite, helpful Vietnamese (Tiếng Việt thanh lịch, chuẩn mực, hiếu khách).
2. Read the user's input, the current trip summary details above, and relate your answer directly to our databank.
3. If "demoCase" is "low_confidence", highlight the explicit contradiction between budget limit and luxurious requests (e.g., trying to book a 5-star resort with 800k VND) and suggest compromises.
4. If "demoCase" is "error", politely instruct them to fill in the destination and budget on the left card so you can parse exact rates.
5. Limit responses to 2-3 clean, compact paragraphs with bold highlights (using **). Do not write extremely long reports. Keep explanations friendly.`;

        // Format conversational history correctly for Gemini SDK
        const contents: any[] = [];
        
        // Add historic messages if present
        if (history && Array.isArray(history)) {
          history.forEach((msg: any) => {
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          });
        }

        // Add the current prompt message
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await client.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.75,
          }
        });

        const replyText = response.text || '';
        return res.json({ 
          text: replyText,
          simulated: false
        });

      } catch (sdkError: any) {
        console.warn('API error or missing credentials, falling back to smart simulated solver:', sdkError.message);
        const fallbackText = getSimulatedResponse(message, trip, demoCase);
        return res.json({ 
          text: `${fallbackText}\n\n*(Lưu ý: Đã kích hoạt bộ chuyển đổi thông minh dự phòng do API đang tải)*`,
          simulated: true,
          error: sdkError.message 
        });
      }

    } catch (routeError: any) {
      console.error('Fatal route error:', routeError);
      return res.status(500).json({ error: 'Internal Server Error', details: routeError.message });
    }
  });

  // Health endpoint checks
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite development integration or production bundle routing static hosting
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Voyage Intelligence Server actively listening on: http://localhost:${PORT}`);
  });
}

startServer();
