import { TripInfo, Hotel, Message } from './types';

export const HOTELS: Hotel[] = [
  {
    id: 'sol-melia',
    name: 'SOL by Meliá Phu Quoc',
    matchPercent: 95,
    stars: 5,
    location: 'Bãi Trường, Dương Tơ, Phú Quốc',
    tags: ['Tầm trung', 'Hồ bơi sát biển', 'Yoga bãi biển'],
    priceText: '1.8M VND / đêm',
    priceVal: 1800,
    whyFits: 'Không gian ngập tràn phong cách sống trẻ trung của Tây Ban Nha, bãi biển cực chill thích hợp cho giới trẻ và khách mang thú cưng. Đáp ứng hoàn hảo mức ngân sách 2.0M và phong cách bình yên.',
    imgUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    details: 'Nằm nép mình bên bãi biển cát trắng tuyệt đẹp của Bãi Trường, SOL by Meliá Phú Quốc là resort 4.5 sao đẳng cấp quốc thế có khu vườn nhiệt đới xanh mát và hồ bơi ngoài trời tràn viền tuyệt đỉnh. Resort cung cấp các hoạt động thể thao mạo hiểm dưới nước, các buổi tập Yoga tràn đầy năng lượng trên bãi biển và dịch vụ spa thư giãn toàn thân.'
  },
  {
    id: 'lahana-resort',
    name: 'Lahana Resort Phu Quoc & Spa',
    matchPercent: 90,
    stars: 4,
    location: 'Đường Trần Hưng Đạo, Dương Đông, Phú Quốc',
    tags: ['Eco-Friendly', 'Hồ bơi vô cực', 'Nhà hàng độc bản'],
    priceText: '1.6M VND / đêm',
    priceVal: 1600,
    whyFits: 'Resort sinh thái nằm trên sườn đồi thoải ngập tràn hoa cỏ, hồ bơi vô cực ngắm hoàng hôn Dương Đông tuyệt đẹp. Phù hợp cho chuyến đi 2 người lãng mạn, yên tĩnh, hòa mình vào thiên nhiên hoang sơ.',
    imgUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    details: 'Lahana Resort mang đến không gian nghỉ dưỡng sườn đồi ngập tràn cây xanh và hoa sứ quyến rũ. Trải nghiệm hồ bơi vô cực nằm trên đỉnh đồi cao hơn 50 mét so với mực nước biển, ngắm trọn vẹn vịnh Thái Lan thơ mộng và thị trấn Dương Đông nhộn nhịp hứa hẹn đem lại ký ức khó quên.'
  },
  {
    id: 'intercon-phuquoc',
    name: 'InterContinental Phu Quoc Long Beach Resort',
    matchPercent: 85,
    stars: 5,
    location: 'Bãi Trường, Dương Tơ, Phú Quốc',
    tags: ['Sang trọng', 'Bãi biển riêng', 'Spa & Wellness'],
    priceText: '4.2M VND / đêm',
    priceVal: 4200,
    whyFits: 'Sự lựa chọn xa hoa, đẳng cấp với dịch vụ phục vụ chu đáo hàng đầu Việt Nam. Hơi vượt quá mức ngân sách đề ra (2.0M VND) nhưng đem lại trải nghiệm bãi biển lãng mạn riêng tư tuyệt mật vô song.',
    imgUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    details: 'Kết hợp hài hòa giữa sự sang trọng thanh nhã và vẻ đẹp biển đảo nguyên sơ vô ngần, InterContinental Phú Quốc có phòng ốc được thiết kế tràn ngập ánh sáng tự nhiên, quầy bar tầng thượng INK 360 cao nhất đảo Ngọc ngắm hoàng hôn đỏ, cùng các hồ bơi vô cực rộng lớn lộng lẫy.'
  },
  {
    id: 'novotel-phuquoc',
    name: 'Novotel Phu Quoc Resort',
    matchPercent: 82,
    stars: 5,
    location: 'Khu phố 5, Đường Bãi Trường, Dương Tơ, Phú Quốc',
    tags: ['Gia đình', 'Hồ bơi ngoài trời', 'Sát biển bãi Trường'],
    priceText: '2.1M VND / đêm',
    priceVal: 2100,
    whyFits: 'Nằm sát bãi biển Bãi Trường nổi tiếng, mức giá cực kỳ tiệm cận với ngân sách 2.0M của bạn, đầy đủ tiện ích vui chơi, sân tennis và bãi tắm riêng yên tĩnh.',
    imgUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    details: 'Một thương hiệu chuẩn quốc tế của Accor nằm tại khu phức hợp Phú Quốc Marina. Novotel sở hữu phong cách thiết kế hiện đại, tinh tế lấy cảm hứng từ làng chài truyền thống ven biển, mang đến dịch vụ tiện nghi tuyệt hảo.'
  }
];

// Helper to get active matching hotels based on trip parameters
export function getMatchedHotels(trip: TripInfo): Hotel[] {
  const destinationNormalized = trip.destination.toLowerCase().trim();
  
  // If destination is empty, let's return []
  if (!destinationNormalized) return [];

  // Filter and calculate dynamic match% based on match quality
  let matched = HOTELS.map(hotel => {
    let match = 80; // base match

    // Destination check
    const isDestMatch = hotel.location.toLowerCase().includes(destinationNormalized);
    if (!isDestMatch) {
      match -= 50; // heavily penalize mismatch of destination
    }

    // Budget match
    // Ideal: hotel price is less than or equals to trip budgetVal
    const priceDiff = hotel.priceVal - trip.budgetVal;
    if (priceDiff <= 0) {
      match += 10; // fits budget nicely!
    } else {
      // Over budget
      const overFactor = priceDiff / trip.budgetVal;
      match -= Math.min(30, Math.round(overFactor * 15)); // penalize based on how much it is over budget
    }

    // Preference/Travel Style matches
    if (trip.travelStyle.toLowerCase().includes('yên tĩnh') || trip.travelStyle.toLowerCase().includes('peaceful')) {
      if (hotel.tags.includes('Yoga bãi biển') || hotel.tags.includes('Eco-Friendly') || hotel.tags.includes('Bãi biển riêng')) {
        match += 5;
      }
    }
    if (trip.preference.toLowerCase().includes('sát bãi biển') || trip.preference.toLowerCase().includes('beach')) {
      if (hotel.tags.includes('Hồ bơi sát biển') || hotel.tags.includes('Bãi biển riêng') || hotel.tags.some(t => t.toLowerCase().includes('biển'))) {
        match += 5;
      }
    }

    match = Math.max(10, Math.min(99, match)); // clamp within 10% to 99%

    return {
      ...hotel,
      matchPercent: match
    };
  });

  // Sort by match percentage in descending order
  // Filter out heavily mismatched destination (unless no matches remain)
  const destMatches = matched.filter(h => h.location.toLowerCase().includes(destinationNormalized));
  const finalMatches = destMatches.length > 0 ? destMatches : matched;

  return finalMatches.sort((a, b) => b.matchPercent - a.matchPercent);
}

// Predefined Demo Cases
export const DEMO_CASES: Record<string, { trip: TripInfo; messages: Message[]; analysis: string }> = {
  happy: {
    trip: {
      destination: 'Phú Quốc',
      budget: '2.0M VND / đêm',
      budgetVal: 2000,
      guests: 2,
      travelStyle: 'Yên tĩnh, cặp đôi',
      preference: 'Sát bãi biển, nghỉ dưỡng'
    },
    analysis: 'Tìm thấy 12 khách sạn phù hợp tại Phú Quốc. Top 3 lựa chọn dưới đây được chọn lọc dựa trên phong cách yên tĩnh sát biển và ngân sách của bạn.',
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
        text: `Chào bạn! Mình đã tìm thấy 3 khách sạn ở Phú Quốc đáp ứng các yêu cầu của bạn: sát biển, không gian yên tĩnh và trong tầm giá 2 triệu VNĐ.\n\nNổi bật nhất là **SOL by Meliá** với bãi biển riêng tuyệt đẹp (giá 1.8M/đêm, match 95%). Ngoài ra, **Lahana Resort** (1.6M/đêm, match 90%) cũng rất phù hợp nếu bạn yêu thích không gian xanh sườn đồi và hồ bơi vô cực ngắm hoàng hôn ngút ngàn.\n\nBạn muốn tìm hiểu kỹ hơn hay đặt phòng của resort nào trong số này ạ?`,
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
