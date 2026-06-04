import React from 'react';
import { Star, MapPin, CheckCircle, Flame, DollarSign, Award, ArrowRight } from 'lucide-react';
import { Hotel, TripInfo } from '../types';

interface HotelMatchesProps {
  trip: TripInfo;
  hotels: Hotel[];
  analysisText: string;
  onBookHotel: (hotel: Hotel) => void;
  onOpenDetails: (hotel: Hotel) => void;
}

export default function HotelMatches({
  trip,
  hotels,
  analysisText,
  onBookHotel,
  onOpenDetails
}: HotelMatchesProps) {
  return (
    <div id="hotel-matches-container" className="space-y-6 h-full flex flex-col">
      {/* Search Analysis Header Box */}
      <div 
        id="analysis-status-box" 
        className="p-5 bg-white border border-[#e5eeff] rounded-2xl shadow-sm space-y-3.5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#14B8A6]" />
        
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#14B8A6] animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-[#0b1c30]">
            Phân tích hành trình (Trip Summary Analysis)
          </h3>
        </div>

        <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-sans pr-4">
          {analysisText}
        </p>

        {/* Dynamic Highlight Chips on the bottom */}
        {trip.destination && (
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-[#e0f1fe] text-[#0F4C81] px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81]" />
              Sát bãi biển
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-[#fef3c7] text-amber-800 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Tối ưu chi phí
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-[#f1f5f9] text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Không gian lãng mạn
            </span>
          </div>
        )}
      </div>

      {/* Hotel Cards List */}
      <div id="hotels-grid" className="space-y-5 flex-1 overflow-y-auto pr-1">
        
        {hotels.length === 0 ? (
          <div id="no-hotels-state" className="bg-white border border-[#e5eeff] rounded-2xl p-10 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-sans font-bold text-base text-gray-900">Không có khách sạn phù hợp</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">Vui lòng nhập địa điểm đi và điều chỉnh mức ngân sách lọc tại bảng "Thông tin hành trình" bên trái!</p>
            </div>
          </div>
        ) : (
          hotels.map((hotel) => (
            <div
              key={hotel.id}
              id={`hotel-card-${hotel.id}`}
              className="bg-white border border-[#e5eeff] rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md hover:border-[#cbdbf5] transition-all duration-300 group"
            >
              {/* Hotel image on the left with fixed aspect ratio */}
              <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative shrink-0 cursor-pointer" onClick={() => onOpenDetails(hotel)}>
                <img
                  src={hotel.imgUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-[10px] font-bold text-[#0F4C81] flex items-center gap-1 select-none">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{hotel.stars}.0 Sao</span>
                </div>
              </div>

              {/* Hotel content detailing matches */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Title & Match % row */}
                  <div className="flex justify-between items-start gap-4">
                    <h3 
                      onClick={() => onOpenDetails(hotel)}
                      className="font-sans font-bold text-md md:text-lg text-gray-900 leading-tight hover:text-[#0F4C81] cursor-pointer transition-colors"
                    >
                      {hotel.name}
                    </h3>
                    
                    <span className="shrink-0 bg-[#E0F2FE] text-[#0F4C81] text-xs font-bold font-mono px-3 py-1 rounded-full flex items-center gap-1 border border-sky-100 select-none">
                      <Flame className="w-3.5 h-3.5 text-[#14B8A6] fill-[#14B8A6]" />
                      <span>{hotel.matchPercent}% Match</span>
                    </span>
                  </div>

                  {/* Location address */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#0F4C81] shrink-0" />
                    <span className="truncate pr-4">{hotel.location}</span>
                  </div>

                  {/* Amenities Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#f0f5ff] text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Analysis of matching logic */}
                  <div className="bg-[#f8f9ff] border border-[rgba(20,184,166,0.1)] p-3 rounded-xl mt-3 text-xs text-gray-600 leading-relaxed">
                    <span className="font-bold text-[#14B8A6] italic font-sans mr-1">Tại sao phù hợp:</span>
                    {hotel.whyFits}
                  </div>
                </div>

                {/* Price tag & CTA booking button */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 flex-wrap gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider block">Giá tham khảo</span>
                    <span className="text-base font-bold text-[#0F4C81]">
                      {hotel.priceText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-details-${hotel.id}`}
                      onClick={() => onOpenDetails(hotel)}
                      className="px-3 py-2 bg-white border border-[#e5eeff] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
                    >
                      <span>Chi tiết</span>
                    </button>

                    <button
                      id={`btn-book-${hotel.id}`}
                      onClick={() => onBookHotel(hotel)}
                      className="px-4.5 py-2.5 bg-[#F59E0B] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Đặt phòng</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
