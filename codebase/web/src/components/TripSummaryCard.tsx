import React, { useState } from 'react';
import { 
  MapPin, 
  Coins, 
  Users, 
  Compass, 
  Sparkles, 
  Edit3, 
  Check, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { TripInfo } from '../types';

interface TripSummaryCardProps {
  trip: TripInfo;
  onUpdateTrip: (newTrip: TripInfo) => void;
}

export default function TripSummaryCard({ trip, onUpdateTrip }: TripSummaryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDestination, setEditedDestination] = useState(trip.destination);
  const [editedBudgetVal, setEditedBudgetVal] = useState(trip.budgetVal);
  const [editedGuests, setEditedGuests] = useState(trip.guests);
  const [editedTravelStyle, setEditedTravelStyle] = useState(trip.travelStyle);
  const [editedPreference, setEditedPreference] = useState(trip.preference);

  // Sync state if prop changes from demo buttons
  React.useEffect(() => {
    setEditedDestination(trip.destination);
    setEditedBudgetVal(trip.budgetVal);
    setEditedGuests(trip.guests);
    setEditedTravelStyle(trip.travelStyle);
    setEditedPreference(trip.preference);
  }, [trip]);

  const handleSave = () => {
    const formattedBudget = editedBudgetVal > 0 
      ? `${(editedBudgetVal / 1000).toFixed(1)}M VND / đêm`
      : 'Chưa xác định';
    
    onUpdateTrip({
      destination: editedDestination,
      budget: formattedBudget,
      budgetVal: editedBudgetVal,
      guests: editedGuests,
      travelStyle: editedTravelStyle,
      preference: editedPreference
    });
    setIsEditing(false);
  };

  const incrementGuests = () => setEditedGuests(prev => prev + 1);
  const decrementGuests = () => setEditedGuests(prev => Math.max(1, prev - 1));

  return (
    <div id="trip-summary-card" className="bg-white rounded-2xl border border-[#e5eeff] p-5 shadow-sm space-y-5 transition-all duration-300 hover:shadow-md h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* Card Title Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#0F4C81]">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="font-sans font-bold text-base text-[#0b1c30]">
              Thông tin hành trình
            </h2>
          </div>
          
          <button
            id="toggle-edit-trip"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isEditing 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                : 'bg-[#f8f9ff] hover:bg-[#e5eeff] text-[#0F4C81] border border-[#e5eeff]'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Hoàn tất</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </>
            )}
          </button>
        </div>

        {/* Display Fields */}
        {!isEditing ? (
          <div id="trip-display-group" className="space-y-4 pt-2">
            {/* DESTINATION */}
            <div className="flex gap-3 items-start group">
              <div className="mt-0.5 w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-[#e0f2fe] group-hover:text-[#0F4C81] transition-colors">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Điểm đến (Destination)</span>
                <span className={`block text-sm font-bold mt-0.5 ${trip.destination ? 'text-gray-900' : 'text-amber-500 italic'}`}>
                  {trip.destination || 'Trống - Điền ngay!'}
                </span>
              </div>
            </div>

            {/* BUDGET */}
            <div className="flex gap-3 items-start group">
              <div className="mt-0.5 w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-[#e0f2fe] group-hover:text-[#0F4C81] transition-colors">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Chi phí / Đêm (Budget)</span>
                <span className={`block text-sm font-bold mt-0.5 ${trip.budgetVal > 0 ? 'text-[#0F4C81]' : 'text-amber-500 italic'}`}>
                  {trip.budget}
                </span>
              </div>
            </div>

            {/* GUESTS */}
            <div className="flex gap-3 items-start group">
              <div className="mt-0.5 w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-[#e0f2fe] group-hover:text-[#0F4C81] transition-colors">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Số thành viên (Guests)</span>
                <span className="block text-sm font-bold text-gray-900 mt-0.5">
                  {trip.guests} người
                </span>
              </div>
            </div>

            {/* TRAVEL STYLE */}
            <div className="flex gap-3 items-start group">
              <div className="mt-0.5 w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-[#e0f2fe] group-hover:text-[#0F4C81] transition-colors">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Phong cách (Style)</span>
                <span className="block text-sm font-bold text-gray-900 mt-0.5">
                  {trip.travelStyle}
                </span>
              </div>
            </div>

            {/* PREFERENCE */}
            <div className="flex gap-3 items-start group">
              <div className="mt-0.5 w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-[#e0f2fe] group-hover:text-[#0F4C81] transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Sở thích đặc biệt (Preference)</span>
                <span className="block text-sm font-bold text-gray-900 mt-0.5">
                  {trip.preference}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Editable Input Form */
          <div id="trip-edit-group" className="space-y-4 pt-1 animate-fade-in">
            {/* Destination inputs */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Điểm đến</label>
              <input
                id="edit-destination"
                type="text"
                value={editedDestination}
                onChange={(e) => setEditedDestination(e.target.value)}
                placeholder="Ví dụ: Phú Quốc"
                className="w-full bg-[#f8f9ff] border border-[#e5eeff] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white"
              />
            </div>

            {/* Budget Range Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Ngân sách / Đêm</span>
                <span className="text-[#0F4C81] font-bold font-mono">
                  {editedBudgetVal > 0 ? `${(editedBudgetVal / 1000).toFixed(1)}M VND` : 'Free'}
                </span>
              </div>
              <input
                id="edit-budget"
                type="range"
                min="0"
                max="10000"
                step="200"
                value={editedBudgetVal}
                onChange={(e) => setEditedBudgetVal(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C81]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                <span>0 VND</span>
                <span>5.0M</span>
                <span>10.0M</span>
              </div>
            </div>

            {/* Guest count */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Số thành viên</label>
              <div className="flex items-center justify-between bg-[#f8f9ff] border border-[#e5eeff] rounded-xl p-1">
                <button
                  type="button"
                  onClick={decrementGuests}
                  className="w-8 h-8 rounded-lg bg-white border border-[#e5eeff] flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50 text-sm"
                >
                  -
                </button>
                <span className="font-bold text-sm text-[#0b1c30]">{editedGuests} người</span>
                <button
                  type="button"
                  onClick={incrementGuests}
                  className="w-8 h-8 rounded-lg bg-white border border-[#e5eeff] flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50 text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Travel style input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phong cách</label>
              <input
                id="edit-style"
                type="text"
                value={editedTravelStyle}
                onChange={(e) => setEditedTravelStyle(e.target.value)}
                placeholder="Ví dụ: Yên tĩnh, cặp đôi"
                className="w-full bg-[#f8f9ff] border border-[#e5eeff] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white"
              />
            </div>

            {/* Preferences input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sở thích đặc biệt</label>
              <input
                id="edit-preference"
                type="text"
                value={editedPreference}
                onChange={(e) => setEditedPreference(e.target.value)}
                placeholder="Ví dụ: Sát bãi biển, nghỉ dưỡng"
                className="w-full bg-[#f8f9ff] border border-[#e5eeff] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Dynamic help state */}
      {!isEditing && (
        <div id="summary-assistant-tip" className="bg-[#f0f5ff]/60 border border-[#e5eeff] rounded-xl p-3 text-[11px] text-slate-600 mt-4 leading-relaxed">
          <p>💡 <span className="font-bold text-[#0F4C81]">Tìm kiếm thông minh:</span> Chỉnh sửa các tham số trên để tool lọc và xếp hạng lại danh sách khu nghỉ dưỡng phù hợp.</p>
        </div>
      )}
    </div>
  );
}
