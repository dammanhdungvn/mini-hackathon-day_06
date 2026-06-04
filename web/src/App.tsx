import React, { useState, useEffect } from 'react';
import { Shield, Sparkles } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TripSummaryCard from './components/TripSummaryCard';
import HotelMatches from './components/HotelMatches';
import AIChat from './components/AIChat';
import Modal from './components/Modal';

import { TripInfo, Hotel, Message, ViewMode, DemoCase } from './types';
import {
  DEMO_CASES,
  createTripAnalysis,
  getMatchedHotelsForTrip,
} from '../../backend/localAdvisor';

const EMPTY_TRIP: TripInfo = {
  destination: '',
  budget: 'Chưa xác định',
  budgetVal: 0,
  guests: 1,
  travelStyle: '',
  preference: '',
};

const INITIAL_DEMO = DEMO_CASES.happy;

export default function App() {
  // Core Application Layout States
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [activeDemo, setActiveDemo] = useState<DemoCase>('happy');
  
  // Trip & matching hotel list state
  const [trip, setTrip] = useState<TripInfo>(INITIAL_DEMO?.trip || EMPTY_TRIP);
  const [matchedHotels, setMatchedHotels] = useState<Hotel[]>([]);
  const [analysisText, setAnalysisText] = useState<string>(
    INITIAL_DEMO?.analysis || createTripAnalysis(EMPTY_TRIP),
  );
  
  // Chat context state
  const [messages, setMessages] = useState<Message[]>(INITIAL_DEMO?.messages || []);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastToolCall, setLastToolCall] = useState<{args: any, mode: string} | null>(null);

  // Modals state
  const [modalType, setModalType] = useState<'book' | 'details' | 'settings' | 'help' | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Recalculate matched hotels on trip change
  useEffect(() => {
    setMatchedHotels(getMatchedHotelsForTrip(trip));
  }, [trip]);

  // Scenario trigger handler
  const triggerDemo = (demo: DemoCase) => {
    setActiveDemo(demo);
    const selected = demo === 'custom' ? null : DEMO_CASES[demo];
    if (selected) {
      setTrip(selected.trip);
      setMessages(selected.messages);
      setAnalysisText(selected.analysis);
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
    setLastToolCall(null);
  };

  // Updates parameters and switches to a custom mode
  const handleUpdateTrip = (newTrip: TripInfo) => {
    setTrip(newTrip);
    setActiveDemo('custom');
    setAnalysisText(createTripAnalysis(newTrip));
  };

  // Sends messages to Alibaba through the local Vite middleware.
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
          trip,
          demoCase: activeDemo,
          history: updatedHist.slice(-6, -1),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Alibaba chat request failed');
      }
      
      setLastToolCall({ args: data.toolArgs, mode: data.toolCallMode });
      
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'Dạ, AI chưa trả về nội dung. Bạn thử hỏi lại ngắn gọn hơn nhé.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Alibaba advisor error:', err);
      
      const apiErrorMsg: Message = {
        id: `a-err-${Date.now()}`,
        sender: 'assistant',
        text: `Chưa gọi được Alibaba để test prompt. Kiểm tra \`backend/.env\`, model/base URL và kết nối mạng. Lỗi: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, apiErrorMsg]);
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
        clearChat={clearChat}
        onOpenSettings={() => setModalType('settings')}
        onOpenHelp={() => setModalType('help')}
        lastToolCall={lastToolCall}
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
              <span>[ADMIN PORTAL] Đang test Alibaba tool-calling với system prompt từ file system_promts.txt.</span>
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
                AI Hotel Advisor dùng tool lọc dữ liệu khách sạn rồi trả lời theo system prompt bạn đang test.
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

            {/* Column 3: Alibaba advisor chat (30%) */}
            <section id="column-ai-chat" className="lg:col-span-4 h-full overflow-hidden flex flex-col">
              <AIChat 
                messages={messages}
                onSendMessage={handleSendMessage}
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
