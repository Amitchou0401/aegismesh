import React from 'react';
import { DisasterType } from '../types/disaster';
import { Volume2, VolumeX, ShieldAlert, Sparkles } from 'lucide-react';

interface TopNavProps {
  activeTab: 'overview' | 'telemetry' | 'map' | 'lifecycle' | 'innovations';
  setActiveTab: (tab: 'overview' | 'telemetry' | 'map' | 'lifecycle' | 'innovations') => void;
  selectedHazard: DisasterType;
  setSelectedHazard: (hazard: DisasterType) => void;
  isSirenActive: boolean;
  onToggleSiren: () => void;
  onOpenDispatch: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  selectedHazard,
  setSelectedHazard,
  isSirenActive,
  onToggleSiren,
  onOpenDispatch,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Brand Wordmark (Single element) */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-slate-200 transition-colors whitespace-nowrap"
        >
          AegisMesh <span className="font-light text-slate-400">DisasterML</span>
        </a>
      </div>

      {/* Zone 2: 4-5 Clean Nav Links (single-line, hover underlines) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('overview')}
          className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
            activeTab === 'overview' ? 'text-white border-b-2 border-amber-500 font-semibold' : ''
          }`}
        >
          Mission Control
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
            activeTab === 'telemetry' ? 'text-white border-b-2 border-amber-500 font-semibold' : ''
          }`}
        >
          ML Telemetry
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
            activeTab === 'map' ? 'text-white border-b-2 border-amber-500 font-semibold' : ''
          }`}
        >
          Crisis GIS Map
        </button>
        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
            activeTab === 'lifecycle' ? 'text-white border-b-2 border-amber-500 font-semibold' : ''
          }`}
        >
          Disaster Lifecycle
        </button>
        <button
          onClick={() => setActiveTab('innovations')}
          className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
            activeTab === 'innovations' ? 'text-white border-b-2 border-amber-500 font-semibold' : ''
          }`}
        >
          Student Innovations
        </button>
      </nav>

      {/* Zone 3: Functional Actions & Primary CTA */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSiren}
          title={isSirenActive ? 'Stop Emergency Siren' : 'Test Emergency Siren'}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            isSirenActive
              ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
              : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
          }`}
        >
          {isSirenActive ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-400" />}
          <span>{isSirenActive ? 'Stop Siren' : 'Audio Siren'}</span>
        </button>

        <button
          onClick={onOpenDispatch}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 rounded-md hover:bg-amber-300 transition-colors whitespace-nowrap shadow-sm shadow-amber-500/10"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>CAP Alert Broadcast</span>
        </button>
      </div>
    </header>
  );
};
