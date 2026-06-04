import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';

interface ToolExecutionCardProps {
  mode?: string;
  travel_purpose?: string;
  budget_tier?: string;
  area?: string;
  key_requirements?: string[];
  rawArgs?: any;
}

export default function ToolExecutionCard({
  mode = 'mock',
  travel_purpose,
  budget_tier,
  area,
  key_requirements = [],
  rawArgs
}: ToolExecutionCardProps) {
  const [showRaw, setShowRaw] = useState(false);

  const isMissing = (val?: string) => !val || val === 'Chưa rõ';

  const renderValue = (val?: string) => {
    if (isMissing(val)) {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          <AlertCircle className="w-3 h-3" /> Missing / Unclear
        </span>
      );
    }
    return <span className="text-gray-900 font-medium text-right">{val}</span>;
  };

  const renderModeBadge = () => {
    if (mode === 'server-fallback') {
      return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Server Fallback</span>;
    }
    if (mode === 'model-tool-call' || mode === 'live-ai') {
      return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Live AI</span>;
    }
    return <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Mock Mode</span>;
  };

  return (
    <div className="bg-white border border-[#E6EBF5] rounded-[16px] p-4 font-sans text-xs flex flex-col gap-3 shadow-sm mx-4 mb-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-gray-900 text-sm">AI Tool Execution</h3>
        <p className="text-gray-500 text-[11px]">Friendly view of backend/tool outputs. No raw JSON.</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-500 font-medium">Execution Mode:</span>
        {renderModeBadge()}
      </div>

      <div className="border-t border-[#E6EBF5] pt-3">
        <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-wider text-[10px]">Traveler Profile</h4>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start gap-4">
            <span className="text-gray-500 shrink-0 mt-0.5">Travel Purpose:</span>
            {renderValue(travel_purpose)}
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-gray-500 shrink-0 mt-0.5">Budget Tier:</span>
            {renderValue(budget_tier)}
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-gray-500 shrink-0 mt-0.5">Preferred Area:</span>
            {renderValue(area)}
          </div>
        </div>
      </div>

      <div className="border-t border-[#E6EBF5] pt-3">
        <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-wider text-[10px]">Key Requirements</h4>
        {(!key_requirements || key_requirements.length === 0) ? (
           <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
             <AlertCircle className="w-3 h-3" /> Missing / Unclear
           </span>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {key_requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-1.5 text-gray-800 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-[#E6EBF5] pt-2 mt-1">
        <button 
          onClick={() => setShowRaw(!showRaw)}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          {showRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Show raw
        </button>
        {showRaw && (
          <div className="mt-2 bg-gray-50 p-2 rounded-lg text-[10px] font-mono text-gray-500 overflow-x-auto">
             <pre>{JSON.stringify(rawArgs || {}, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
