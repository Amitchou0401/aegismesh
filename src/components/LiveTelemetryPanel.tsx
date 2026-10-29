import React from 'react';
import { DisasterType, TelemetryFeatures } from '../types/disaster';
import { Sliders, RefreshCw, Zap, Activity } from 'lucide-react';

interface LiveTelemetryPanelProps {
  telemetry: TelemetryFeatures;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryFeatures>>;
  selectedHazard: DisasterType;
  setSelectedHazard: (hazard: DisasterType) => void;
  onApplyPreset: (presetKey: string) => void;
}

export const LiveTelemetryPanel: React.FC<LiveTelemetryPanelProps> = ({
  telemetry,
  setTelemetry,
  selectedHazard,
  setSelectedHazard,
  onApplyPreset,
}) => {
  const handleSliderChange = (field: keyof TelemetryFeatures, value: number) => {
    setTelemetry((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-5">
      {/* Header and Hazard Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Sensor Telemetry & ML Input Sandbox</span>
          </h3>
          <div className="text-xs text-slate-400 mt-0.5">
            Low-cost IoT mesh sensor feeds updated every 1.0s · In-situ Edge ML Preprocessing
          </div>
        </div>

        {/* Hazard Selector segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setSelectedHazard('flood')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedHazard === 'flood'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flash Flood
          </button>
          <button
            onClick={() => setSelectedHazard('earthquake')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedHazard === 'earthquake'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Earthquake
          </button>
          <button
            onClick={() => setSelectedHazard('wildfire')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedHazard === 'wildfire'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Wildfire
          </button>
          <button
            onClick={() => setSelectedHazard('landslide')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedHazard === 'landslide'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Landslide
          </button>
        </div>
      </div>

      {/* Scenario Presets Quick Trigger Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Scenario Quick-Inject:</span>
        <button
          onClick={() => onApplyPreset('nominal')}
          className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 rounded transition-colors"
        >
          Nominal Baseline
        </button>
        <button
          onClick={() => onApplyPreset('flood_surge')}
          className="px-2.5 py-1 text-xs bg-blue-950/60 border border-blue-700/80 hover:border-blue-500 text-blue-300 rounded transition-colors"
        >
          100-Yr Monsoon Surge
        </button>
        <button
          onClick={() => onApplyPreset('quake_6_8')}
          className="px-2.5 py-1 text-xs bg-rose-950/60 border border-rose-700/80 hover:border-rose-500 text-rose-300 rounded transition-colors"
        >
          M6.8 Fault Rupture
        </button>
        <button
          onClick={() => onApplyPreset('wildfire_gale')}
          className="px-2.5 py-1 text-xs bg-amber-950/60 border border-amber-700/80 hover:border-amber-500 text-amber-300 rounded transition-colors"
        >
          Gale Wildfire Spread
        </button>
        <button
          onClick={() => onApplyPreset('landslide_shear')}
          className="px-2.5 py-1 text-xs bg-emerald-950/60 border border-emerald-700/80 hover:border-emerald-500 text-emerald-300 rounded transition-colors"
        >
          Pore Pressure Shear Failure
        </button>
      </div>

      {/* Dynamic Telemetry Sliders for Selected Hazard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* River Stage Gauge */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-300 font-medium">River Stage (Depth)</span>
            <span className="text-sm font-bold font-mono text-cyan-400 tabular-nums">
              {telemetry.riverStageM.toFixed(1)} <span className="text-xs text-slate-500 font-normal">m</span>
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="12.0"
            step="0.1"
            value={telemetry.riverStageM}
            onChange={(e) => handleSliderChange('riverStageM', parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span>Normal: 1.5m</span>
            <span>Warning: 5.5m</span>
            <span>Flood: 8.0m</span>
          </div>
        </div>

        {/* Rainfall Intensity */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-300 font-medium">Catchment Precipitation</span>
            <span className="text-sm font-bold font-mono text-blue-400 tabular-nums">
              {telemetry.rainfallRateMmH.toFixed(0)} <span className="text-xs text-slate-500 font-normal">mm/h</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="140"
            step="1"
            value={telemetry.rainfallRateMmH}
            onChange={(e) => handleSliderChange('rainfallRateMmH', parseFloat(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span>Light: &lt;10</span>
            <span>Heavy: 35</span>
            <span>Torrential: &gt;60</span>
          </div>
        </div>

        {/* Upstream Soil Saturation */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-300 font-medium">Upstream Soil Saturation</span>
            <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
              {telemetry.upstreamSaturationPct.toFixed(0)} <span className="text-xs text-slate-500 font-normal">%</span>
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={telemetry.upstreamSaturationPct}
            onChange={(e) => handleSliderChange('upstreamSaturationPct', parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span>Dry: 20%</span>
            <span>Moist: 60%</span>
            <span>Saturated: &gt;85%</span>
          </div>
        </div>

        {/* Peak Ground Acceleration (PGA) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-300 font-medium">Peak Ground Accel (PGA)</span>
            <span className="text-sm font-bold font-mono text-rose-400 tabular-nums">
              {telemetry.groundAccelPgaG.toFixed(3)} <span className="text-xs text-slate-500 font-normal">g</span>
            </span>
          </div>
          <input
            type="range"
            min="0.001"
            max="0.8"
            step="0.005"
            value={telemetry.groundAccelPgaG}
            onChange={(e) => handleSliderChange('groundAccelPgaG', parseFloat(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span>Ambient: 0.005g</span>
            <span>Felt: 0.05g</span>
            <span>Destructive: &gt;0.25g</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-300 font-medium">Sustained Wind Vector</span>
            <span className="text-sm font-bold font-mono text-amber-400 tabular-nums">
              {telemetry.windSpeedKmh.toFixed(0)} <span className="text-xs text-slate-500 font-normal">km/h</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="110"
            step="1"
            value={telemetry.windSpeedKmh}
            onChange={(e) => handleSliderChange('windSpeedKmh', parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span>Calm: 10</span>
            <span>Breeze: 30</span>
            <span>Gale Storm: &gt;60</span>
          </div>
        </div>

        {/* Soil Pore Water Pressure */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-300 font-medium">Soil Pore Water Pressure</span>
            <span className="text-sm font-bold font-mono text-teal-400 tabular-nums">
              {telemetry.soilPorePressureKpa.toFixed(1)} <span className="text-xs text-slate-500 font-normal">kPa</span>
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="75"
            step="0.5"
            value={telemetry.soilPorePressureKpa}
            onChange={(e) => handleSliderChange('soilPorePressureKpa', parseFloat(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span>Stable: 15</span>
            <span>Elevated: 35</span>
            <span>Shear Slip: &gt;55</span>
          </div>
        </div>
      </div>
    </div>
  );
};
