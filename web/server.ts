import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { execSync } from 'child_process';

// Load environment variables
dotenv.config();

// Image mapping for hotels based on ID to maintain rich aesthetics in fallback
const HOTEL_IMAGES: Record<string, string> = {
  "luxury_01": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  "luxury_02": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
  "luxury_03": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  "luxury_04": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
  "luxury_05": "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
  "luxury_06": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80",
  "luxury_07": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "mid_01": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
  "mid_02": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
  "mid_03": "https://images.unsplash.com/photo-1529290130-4ca3753253ae?auto=format&fit=crop&w=800&q=80",
  "mid_04": "https://images.unsplash.com/photo-1563911302283-d2bc1d982df5?auto=format&fit=crop&w=800&q=80",
  "mid_05": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
  "mid_06": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
  "mid_07": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
  "mid_08": "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=800&q=80",
};

// Local pre-defined Demo Cases for fallback
const LOCAL_DEMO_CASES = {
  happy: {
    trip: {
      destination: 'Phú Quốc',
      budget: '2.0M VND / đêm',
      budgetVal: 2000,
      guests: 2,
      travelStyle: 'Yên tĩnh, cặp đôi',
      preference: 'Sát bãi biển, nghỉ dưỡng'
    },
    analysis: 'Tìm thấy các khách sạn phù hợp tại Phú Quốc. Top lựa chọn dưới đây được chọn lọc dựa trên phong cách yên tĩnh sát biển và ngân sách của bạn.',
    messages: [
      {
        id: 'h1',
        sender: 'user',
        text: 'Tôi đi Phú Quốc 2 người, ngân sách 2 triệu mỗi đêm, muốn gần biển và yên tĩnh.',
        timestamp: '10:42'
      },
      {
        id: 'h2',
        sender: 'assistant',
        text: `Chào bạn! Mình đã tìm thấy các khách sạn ở Phú Quốc đáp ứng các yêu cầu của bạn: sát biển, không gian yên tĩnh và trong tầm giá 2 triệu VNĐ.\n\nNổi bật nhất là **SOL by Meliá** với bãi biển riêng tuyệt đẹp (giá 1.8M/đêm, match 95%). Ngoài ra, **Lahana Resort** (1.6M/đêm, match 90%) cũng rất phù hợp nếu bạn yêu thích không gian xanh sườn đồi và hồ bơi vô cực ngắm hoàng hôn ngút ngàn.\n\nBạn muốn tìm hiểu kỹ hơn hay đặt phòng của resort nào trong số này ạ?`,
        timestamp: '10:43'
      }
    ]
  },
  error: {
    trip: {
      destination: '',
      budget: 'Chưa xác định',
      budgetVal: 0,
      guests: 1,
      travelStyle: 'Nhộn nhịp',
      preference: 'Gần trung tâm mua sắm'
    },
    analysis: '⚠️ Thông tin hành trình chưa đầy đủ (Thiếu Điểm đến & Hạn mức ngân sách). Hãy cung cấp thêm thông tin để Trợ lý AI có thể đề xuất khách sạn phù hợp nhất cho chuyến đi của bạn.',
    messages: [
      {
        id: 'e1',
        sender: 'user',
        text: 'Tôi muốn tìm một khách sạn có bể bơi đẹp để đi du lịch.',
        timestamp: '11:05'
      },
      {
        id: 'e2',
        sender: 'assistant',
        text: 'Xin chào! Mình rất sẵn lòng hỗ trợ bạn tìm kiếm khách sạn hoàn hảo có hồ bơi tuyệt đẹp.\n\nTuy nhiên, để mình có thể đề xuất chính xác các lựa chọn tốt nhất, bạn có thể chia sẻ thêm: \n1. **Địa điểm du lịch** bạn dự kiến ghé thăm là đâu? (ví dụ: Phú Quốc, Nha Trang, Đà Nẵng...)\n2. **Ngân sách dự kiến** cho mỗi đêm là khoảng bao nhiêu?\n3. Chuyến đi của bạn có tổng cộng bao nhiêu thành viên?\n\nBạn có thể điền thông tin vào phiếu bên trái hoặc trực tiếp chat tại đây nhé!',
        timestamp: '11:06'
      }
    ]
  },
  low_confidence: {
    trip: {
      destination: 'Phú Quốc',
      budget: '0.8M VND / đêm',
      budgetVal: 800,
      guests: 2,
      travelStyle: 'Sang trọng bậc nhất',
      preference: 'Resort 5 sao siêu sang, bãi biển riêng biệt lập'
    },
    analysis: '⚠️ Mức độ tin cậy thấp (Mâu thuẫn dữ liệu). Có sự không khớp giữa ngân sách tiết kiệm (0.8M VNĐ/đêm) và yêu cầu phong cách thiết kế sang trọng 5 sao quốc tế bậc nhất.',
    messages: [
      {
        id: 'l1',
        sender: 'user',
        text: 'Tôi muốn tìm resort 5 sao sang trọng nhất Phú Quốc sát biển có bãi tắm riêng, ngân sách tầm 800k một đêm thôi nha.',
        timestamp: '11:12'
      },
      {
        id: 'l2',
        sender: 'assistant',
        text: 'Cảm ơn yêu cầu chi tiết từ bạn. Ở đây mình phát hiện một điểm chưa đồng nhất: các **resort 5 sao đẳng cấp sang trọng bậc nhất** sát biển tại Phú Quốc thường có giá dao động từ **3.5M đến hơn 10.0M VND/đêm**, vượt khá xa ngân sách dự chi **800k VND/đêm** của bạn.\n\nĐể hỗ trợ bạn tốt nhất, mình xin xuất ra 2 phương án cân nhắc:\n1. **Giữ nguyên tiêu chuẩn resort 5 sao**: Nâng ngân sách lên khoảng 3M-4M để chọn **SOL by Meliá** hoặc **InterContinental Phú Quốc** (rất sang trọng).\n2. **Giữ nguyên ngân sách 800k**: Điều chỉnh xuống khách sạn 3 sao, homestay xinh xắn cách biển tầm 500m.\n\nBạn ưu tiên theo hướng giải quyết nào hơn để mình tiếp tục hỗ trợ phân tích sâu hơn?',
        timestamp: '11:13'
      }
    ]
  }
};

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

// Read data_hotel.py directly and load hotel database
function getHotelsFromPythonDirectly(): any[] {
  try {
    const rootPath = path.resolve(__dirname, '..');
    // Run python script using sys.path inclusion to get PHU_QUOC_HOTELS_DB as JSON string
    const cmd = `python -c "import json; import sys; sys.path.append('${rootPath.replace(/\\/g, '/')}'); from data_hotel import PHU_QUOC_HOTELS_DB; print(json.dumps(PHU_QUOC_HOTELS_DB))"`;
    const stdout = execSync(cmd, { cwd: rootPath, encoding: 'utf-8' });
    return JSON.parse(stdout);
  } catch (err) {
    console.error("Failed to read hotels from data_hotel.py directly via python:", err);
    return [];
  }
}

// Local JS fallback matching algorithm to ensure everything works if Python FastAPI is offline
function mapAndMatchHotels(hotels: any[], trip: any): any[] {
  const destination = (trip.destination || '').toLowerCase().trim();
  if (!destination) return [];

  const budgetVnd = trip.budgetVal * 1000;
  const travelStyle = (trip.travelStyle || '').toLowerCase();
  const preference = (trip.preference || '').toLowerCase();

  const isDestMatch = destination.includes('phú quốc') || destination.includes('phu quoc');

  const mapped = hotels.map(hotel => {
    let matchPercent = 80;

    // 1. Destination Match
    if (!isDestMatch) {
      matchPercent -= 50;
    }

    // 2. Budget Match
    const priceVnd = hotel.est_price_vnd || 0;
    const priceDiff = priceVnd - budgetVnd;

    if (budgetVnd > 0) {
      if (priceDiff <= 0) {
        matchPercent += 10;
      } else {
        const overFactor = priceDiff / budgetVnd;
        matchPercent -= Math.min(30, Math.floor(overFactor * 15));
      }
    }

    // 3. Style / Preference matches
    const tags = [...(hotel.amenities || []), hotel.price_tier || '', hotel.usp || ''];
    const tagsLower = tags.map(t => t.toLowerCase());

    if (travelStyle.includes('yên tĩnh') || travelStyle.includes('peaceful')) {
      if (tagsLower.some(t => t.includes('yên') || t.includes('biệt lập') || t.includes('eco') || t.includes('spa') || t.includes('yoga'))) {
        matchPercent += 5;
      }
    }

    if (preference.includes('sát bãi biển') || preference.includes('beach') || preference.includes('biển')) {
      if (tagsLower.some(t => t.includes('biển') || t.includes('bãi tắm') || t.includes('bãi trường') || t.includes('bãi khem') || t.includes('bãi dài'))) {
        matchPercent += 5;
      }
    }

    matchPercent = Math.max(10, Math.min(99, matchPercent));

    // Stars from tier
    let stars = 4;
    if (hotel.price_tier === 'Cao cấp') stars = 5;
    else if (hotel.price_tier === 'Tiết kiệm') stars = 3;

    const priceText = `${(priceVnd / 1000000).toFixed(1)}M VND/đêm`.replace('.0', '');

    let whyFits = `Resort phân khúc ${hotel.price_tier?.toLowerCase()} tại ${hotel.area}.`;
    if (priceDiff <= 0) {
      whyFits += ` Giá ${priceText} nằm gọn trong ngân sách tối đa ${trip.budget} của bạn.`;
    } else {
      whyFits += ` Mức giá ${priceText} hơi vượt quá hạn mức ${trip.budget} một chút nhưng đem lại chất lượng vượt trội.`;
    }

    const imgUrl = HOTEL_IMAGES[hotel.id] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

    return {
      id: hotel.id,
      name: hotel.name,
      matchPercent,
      stars,
      location: `${hotel.area}, Phú Quốc, Việt Nam`,
      tags: [...(hotel.amenities || []).slice(0, 2), hotel.price_tier],
      priceText,
      priceVal: priceVnd / 1000,
      whyFits,
      imgUrl,
      details: `${hotel.usp} Các loại phòng tiêu chuẩn: ${(hotel.room_types || []).join(', ')}.`
    };
  });

  const destMatches = mapped.filter(h => isDestMatch);
  const finalMatches = destMatches.length > 0 ? destMatches : mapped;

  return finalMatches.sort((a, b) => b.matchPercent - a.matchPercent);
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

  // API handler for Demo Cases - Try FastAPI first, fallback to LOCAL_DEMO_CASES
  app.get('/api/demo-cases', async (req, res) => {
    try {
      const response = await fetch('http://localhost:8000/api/demo-cases', {
        signal: AbortSignal.timeout(1000)
      });
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
    } catch (err) {
      console.warn('FastAPI server /api/demo-cases connection failed, using local fallback cases');
    }
    return res.json(LOCAL_DEMO_CASES);
  });

  // API handler for Hotels List - Try FastAPI first, fallback to local mapAndMatchHotels using python output
  app.post('/api/hotels', async (req, res) => {
    try {
      const response = await fetch('http://localhost:8000/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(1000)
      });
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
    } catch (err) {
      console.warn('FastAPI server /api/hotels connection failed, falling back to direct Python parsing');
    }

    try {
      const rawHotels = getHotelsFromPythonDirectly();
      const trip = req.body;
      const matched = mapAndMatchHotels(rawHotels, trip);
      return res.json(matched);
    } catch (fallbackErr: any) {
      console.error('Fatal fallback matching error:', fallbackErr);
      return res.status(500).json({ error: 'Internal Matching Error', details: fallbackErr.message });
    }
  });

  // API handler for Chat requests - Try FastAPI first, fallback to local Gemini or Simulated solver
  app.post('/api/chat', async (req, res) => {
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(3000) // longer timeout for generative AI
      });
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
    } catch (err) {
      console.warn('FastAPI server /api/chat connection failed, falling back to local chat solver');
    }

    // Local chat execution fallback
    try {
      const { message, trip, demoCase, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message payload is required' });
      }

      // Check if user has toggled simulating mock replies or real API
      const forceMock = req.body.forceMock === true;

      if (forceMock) {
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

        const contents: any[] = [];
        
        if (history && Array.isArray(history)) {
          history.forEach((msg: any) => {
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          });
        }

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
