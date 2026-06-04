import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  TrendingUp, 
  Award, 
  Globe, 
  MessageSquare, 
  ChevronRight,
  Shield,
  Eye,
  Settings,
  Sparkles
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TripSummaryCard from './components/TripSummaryCard';
import HotelMatches from './components/HotelMatches';
import AIChat from './components/AIChat';
import Modal from './components/Modal';

import { TripInfo, Hotel, Message, ViewMode, DemoCase } from './types';
import { DEMO_CASES, getMatchedHotels } from './data';

export default function App() {
  // Core Application Layout States
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [activeDemo, setActiveDemo] = useState<DemoCase>('happy');
  const [isAiConnected, setIsAiConnected] = useState<boolean>(true);
  
  // Trip & matching hotel list state
  const [trip, setTrip] = useState<TripInfo>(DEMO_CASES.happy.trip);
  const [matchedHotels, setMatchedHotels] = useState<Hotel[]>([]);
  const [analysisText, setAnalysisText] = useState<string>(DEMO_CASES.happy.analysis);
  
  // Chat context state
  const [messages, setMessages] = useState<Message[]>(DEMO_CASES.happy.messages);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Modals state
  const [modalType, setModalType] = useState<'book' | 'details' | 'settings' | 'help' | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Recalculate matched hotels on trip change
  useEffect(() => {
    const list = getMatchedHotels(trip);
    setMatchedHotels(list);
  }, [trip]);

  // Scenario trigger handler
  const triggerDemo = (demo: DemoCase) => {
    setActiveDemo(demo);
    if (DEMO_CASES[demo]) {
      setTrip(DEMO_CASES[demo].trip);
      setMessages(DEMO_CASES[demo].messages);
      setAnalysisText(DEMO_CASES[demo].analysis);
    }
  };

  // Clear chat logs
  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Lịch sử trò chuyện đã được xóa sạch. Mình đã sẵn sàng hỗ trợ thiết lập hành trình nghỉ dưỡng mới tại Việt Nam cùng bạn!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Updates parameters and switches to a custom mode
  const handleUpdateTrip = (newTrip: TripInfo) => {
    setTrip(newTrip);
    setActiveDemo('custom');
    
    // Dynamic analyses text
    if (!newTrip.destination) {
      setAnalysisText('⚠️ Điểm đến hành trình đang trống. Hãy thiết lập mục tiêu Điểm đến ở bảng "Thông tin hành trình" bên trái để hệ thống nạp dữ liệu phân tích!');
    } else {
      setAnalysisText(`Phân tích tự động: Tìm thấy các khách sạn tương thích tại ${newTrip.destination}. Danh sách dưới đây được xếp hạng dựa trên tiêu chí ngân sách ${newTrip.budget} và phong cách ${newTrip.travelStyle}.`);
    }
  };

  // Sends messages to Gemini proxy or smart mock
  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHist = [...messages, userMsg];
    setMessages(updatedHist);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          trip: trip,
          demoCase: activeDemo,
          history: updatedHist.slice(-6, -1), // Send recent context history
          forceMock: !isAiConnected // Flag to use server-side mock if toggled
        })
      });

      if (!response.ok) {
        throw new Error('API server fetch returned failure status');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'Dạ, Voyage Intelligence chưa thể kết nối đầy đủ dữ liệu. Xin thử lại sau giây lát!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Error contacting chat endpoint:', err);
      
      // Fallback response inside client
      const fallbackMsg: Message = {
        id: `a-err-${Date.now()}`,
        sender: 'assistant',
        text: `Dạ, trợ lý AI hiện đang bận điều hành. Rất mong bạn thông cảm!\n\nBạn có thể tham khảo resort **SOL by Meliá** thiết kế hồ bơi sát biển vô cùng lãng mạn tại ${trip.destination || 'Phú Quốc'} hoặc bật chế độ MOCK MODE trên Sidebar để trải nghiệm mượt mà không lo tải lỗi nhé.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Open specific modals
  const handleBookHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setModalType('book');
  };

  const handleOpenDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setModalType('details');
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#F8FAFC] text-[#0b1c30] flex flex-col md:flex-row font-sans overflow-hidden h-screen">
      
      {/* Control Demonstration Suite Panel (Left Sidebar) */}
      <Sidebar 
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeDemo={activeDemo}
        triggerDemo={triggerDemo}
        isAiConnected={isAiConnected}
        setIsAiConnected={setIsAiConnected}
        clearChat={clearChat}
        onOpenSettings={() => setModalType('settings')}
        onOpenHelp={() => setModalType('help')}
      />

      {/* Main Experience Space (Right Side) */}
      <main id="main-content-flow" className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navigation & profile header */}
        <Header />

        {/* Dynamic Admin mode alert */}
        {viewMode === 'admin' && (
          <div id="admin-mode-banner" className="bg-[#0b1c30] text-amber-200 px-8 py-2.5 flex items-center justify-between text-xs shrink-0 select-none animate-slide-down">
            <div className="flex items-center gap-2 font-mono">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>[ADMIN PORTAL] Đang giám sát luồng Token AI và các tham số Prompt (Voyage System Operational).</span>
            </div>
            <button 
              onClick={() => setViewMode('user')}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-1 rounded transition-colors uppercase tracking-wider"
            >
              Thoát Admin
            </button>
          </div>
        )}

        {/* Dashboard Grid Container */}
        <div 
          id="dashboard-grid-container" 
          className="flex-1 p-6 overflow-hidden max-w-[1440px] xl:mx-auto w-full flex flex-col"
        >
          {/* Header Title Greeting */}
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 font-sans">
                Kết quả tốt nhất cho chuyến đi
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-sans">
                Trợ lý AI giúp bạn chọn khách sạn phù hợp theo ngân sách, phong cách du lịch và vị trí mong muốn.
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 bg-[#E0F2FE] text-[#0F4C81] text-xs font-bold px-3 py-1.5 rounded-full border border-sky-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GUEST VIEW: Đã cá nhân hóa</span>
            </div>
          </div>

          {/* Three Column Scrollproof Layout */}
          <div 
            id="three-column-grid" 
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden"
          >
            {/* Column 1: Trip Summary parameters (25%) */}
            <section id="column-trip-summary" className="lg:col-span-3 h-full overflow-y-auto pr-1">
              <TripSummaryCard 
                trip={trip}
                onUpdateTrip={handleUpdateTrip}
              />
            </section>

            {/* Column 2: Matches list (45%) */}
            <section id="column-hotel-matches" className="lg:col-span-5 h-full overflow-hidden flex flex-col">
              <HotelMatches 
                trip={trip}
                hotels={matchedHotels}
                analysisText={analysisText}
                onBookHotel={handleBookHotel}
                onOpenDetails={handleOpenDetails}
              />
            </section>

            {/* Column 3: AI Concierge chat (30%) */}
            <section id="column-ai-chat" className="lg:col-span-4 h-full overflow-hidden flex flex-col">
              <AIChat 
                messages={messages}
                onSendMessage={handleSendMessage}
                isAiConnected={isAiConnected}
                isGenerating={isGenerating}
              />
            </section>
          </div>

        </div>

      </main>

      {/* Shared Modals Portal (Settings, Help, Hotel detail, Checkout) */}
      <Modal 
        type={modalType}
        onClose={() => {
          setModalType(null);
          setSelectedHotel(null);
        }}
        activeHotel={selectedHotel}
      />
    </div>
  );
}
