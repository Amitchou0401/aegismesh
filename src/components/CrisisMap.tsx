import React, { useState } from 'react';
import { SensorNode, ShelterInfo, MLPredictionResult } from '../types/disaster';
import { Layers, ShieldCheck, Radio, Navigation, AlertTriangle } from 'lucide-react';

interface CrisisMapProps {
  sensors: SensorNode[];
  shelters: ShelterInfo[];
  prediction: MLPredictionResult;
  selectedSensor: SensorNode | null;
  onSelectSensor: (sensor: SensorNode | null) => void;
}

export const CrisisMap: React.FC<CrisisMapProps> = ({
  sensors,
  shelters,
  prediction,
  selectedSensor,
  onSelectSensor,
}) => {
  const [showSensors, setShowSensors] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showHazardLayer, setShowHazardLayer] = useState(true);

  // Map coordinates conversion to SVG viewBox 0 0 1000 620
  // Lat: 37.74 to 37.81 (North-South, 0.07 range)
  // Lng: -122.46 to -122.37 (West-East, 0.09 range)
  const toSvgX = (lng: number) => {
    return ((lng - (-122.46)) / 0.09) * 920 + 40;
  };

  const toSvgY = (lat: number) => {
    return (1 - (lat - 37.74) / 0.07) * 540 + 40;
  };

  // Severity-based stroke/fill colors
  const hazardColor =
    prediction.riskLevel === 'CRITICAL_EVACUATION'
      ? '#ef4444'
      : prediction.riskLevel === 'WARNING'
      ? '#f97316'
      : prediction.riskLevel === 'WATCH'
      ? '#f59e0b'
      : '#3b82f6';

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Map Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-200">GIS Telemetry Canvas</span>
          <span className="text-xs text-slate-500 font-mono">LoRaWAN Mesh Active</span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-mono">Projection: WGS84 Universal Grid</span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
          <button
            onClick={() => setShowHazardLayer(!showHazardLayer)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              showHazardLayer ? 'bg-slate-800 text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Hazard Risk Buffer</span>
          </button>
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              showSensors ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Telemetry Nodes ({sensors.length})</span>
          </button>
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              showShelters ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Safe Shelters</span>
          </button>
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              showRoutes ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>Evacuation Routes</span>
          </button>
        </div>
      </div>

      {/* Main SVG Vector Surface */}
      <div className="relative w-full aspect-[16/9] bg-[#090d16] select-none overflow-hidden">
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #0d1527 0%, #060911 100%)' }}
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>

            {/* Radial glow for hazard center */}
            <radialGradient id="hazardGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={hazardColor} stopOpacity={0.45} />
              <stop offset="60%" stopColor={hazardColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={hazardColor} stopOpacity={0} />
            </radialGradient>

            {/* River water gradient */}
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#0369a1" stopOpacity={0.85} />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="620" fill="url(#grid)" />

          {/* Topographic Contour Lines (Elevation Simulation) */}
          <g stroke="#1e293b" strokeWidth="1" fill="none" strokeOpacity="0.6">
            <path d="M 80,180 Q 240,140 450,190 T 880,140" />
            <path d="M 60,260 Q 260,220 520,280 T 920,240" />
            <path d="M 40,360 Q 300,320 600,380 T 940,340" />
            <path d="M 90,460 Q 340,430 680,480 T 910,450" />
            {/* High Ridge Contour Ring */}
            <ellipse cx="760" cy="180" rx="140" ry="80" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="760" y="140" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
              Highland Ridge (Elev. 210m)
            </text>
          </g>

          {/* River Corridor (Hydrologic Flow Path) */}
          <path
            d="M 120,40 Q 260,180 340,290 T 480,450 T 640,600"
            fill="none"
            stroke="url(#riverGrad)"
            strokeWidth={prediction.hazardType === 'flood' ? 36 * (1 + prediction.probability * 0.8) : 24}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          <text x="310" y="270" fill="#38bdf8" fontSize="11" fontWeight="600" opacity="0.8">
            Verdant River Valley (Lowland Choke)
          </text>

          {/* Fault Line Trace (for Seismic Hazard) */}
          <path
            d="M 680,30 L 740,160 L 710,320 L 780,470 L 760,600"
            fill="none"
            stroke="#ef4444"
            strokeWidth={prediction.hazardType === 'earthquake' ? 4 : 1.5}
            strokeDasharray="6 4"
            opacity={prediction.hazardType === 'earthquake' ? 0.9 : 0.3}
          />
          {prediction.hazardType === 'earthquake' && (
            <text x="750" y="320" fill="#f87171" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
              Active Strike-Slip Rupture Trace
            </text>
          )}

          {/* Dynamic Hazard Propagation Buffer (ML Predicted Inundation / Shake / Burn Zone) */}
          {showHazardLayer && (
            <g className="transition-all duration-700">
              {prediction.hazardType === 'flood' && (
                <ellipse
                  cx="420"
                  cy="380"
                  rx={180 * (0.6 + prediction.probability * 0.8)}
                  ry={110 * (0.6 + prediction.probability * 0.8)}
                  fill="url(#hazardGlow)"
                  stroke={hazardColor}
                  strokeWidth="2"
                  strokeDasharray="8 4"
                />
              )}

              {prediction.hazardType === 'earthquake' && (
                <circle
                  cx="720"
                  cy="290"
                  r={160 * (0.7 + prediction.probability * 0.7)}
                  fill="url(#hazardGlow)"
                  stroke={hazardColor}
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
              )}

              {prediction.hazardType === 'wildfire' && (
                <path
                  d={`M 680,140 Q 840,100 890,220 Q 820,330 670,270 Z`}
                  fill="url(#hazardGlow)"
                  stroke={hazardColor}
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                />
              )}

              {prediction.hazardType === 'landslide' && (
                <polygon
                  points="180,390 280,340 310,480 190,490"
                  fill="url(#hazardGlow)"
                  stroke={hazardColor}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              )}
            </g>
          )}

          {/* Evacuation Corridors & Arterials */}
          {showRoutes && (
            <g stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 6" fill="none" opacity="0.85">
              {/* Route 1: North Ridge Elevated Corridor */}
              <path d="M 380,310 L 520,230 L 720,190" />
              {/* Route 2: East Hill Highway */}
              <path d="M 460,420 L 610,410 L 760,370" />
              {/* Route 3: West Escape to North Arena */}
              <path d="M 220,350 L 320,180 L 580,120 L 740,130" />
            </g>
          )}

          {/* Shelters Display */}
          {showShelters &&
            shelters.map((shelter, idx) => {
              // Static anchor positions on high ground
              const shelterCoords = [
                { x: 780, y: 170 },
                { x: 800, y: 360 },
                { x: 620, y: 110 },
              ][idx] || { x: 700, y: 200 };

              return (
                <g key={shelter.id} transform={`translate(${shelterCoords.x}, ${shelterCoords.y})`}>
                  <rect
                    x="-14"
                    y="-14"
                    width="28"
                    height="28"
                    rx="6"
                    fill="#064e3b"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:scale-110 transition-transform"
                  />
                  <ShieldCheck x="-7" y="-7" width="14" height="14" className="text-emerald-300 pointer-events-none" />
                  <text
                    x="20"
                    y="4"
                    fill="#a7f3d0"
                    fontSize="11"
                    fontWeight="600"
                    className="select-none"
                  >
                    {shelter.name.split(' ')[0]} Shelter
                  </text>
                  <text
                    x="20"
                    y="16"
                    fill="#6ee7b7"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                  >
                    {shelter.currentCapacity}/{shelter.maxCapacity} Capacity
                  </text>
                </g>
              );
            })}

          {/* Sensor Nodes */}
          {showSensors &&
            sensors.map((sensor) => {
              const cx = toSvgX(sensor.lng);
              const cy = toSvgY(sensor.lat);
              const isSelected = selectedSensor?.id === sensor.id;
              const isCritical = sensor.currentValue >= sensor.thresholdCritical;
              const isWarning = sensor.currentValue >= sensor.thresholdWarning;

              const nodeColor = isCritical ? '#f43f5e' : isWarning ? '#f59e0b' : '#06b6d4';

              return (
                <g
                  key={sensor.id}
                  transform={`translate(${cx}, ${cy})`}
                  onClick={() => onSelectSensor(isSelected ? null : sensor)}
                  className="cursor-pointer group"
                >
                  {/* Ping wave animation for active sensors */}
                  <circle
                    r="14"
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="1"
                    opacity="0.3"
                    className={isWarning || isCritical ? 'animate-ping' : ''}
                  />

                  {/* Node Outer Ring */}
                  <circle
                    r={isSelected ? 10 : 8}
                    fill="#0b1120"
                    stroke={nodeColor}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all group-hover:scale-125"
                  />

                  {/* Inner Core */}
                  <circle r="3.5" fill={nodeColor} />

                  {/* Hover or selected label */}
                  <g
                    transform="translate(12, -8)"
                    className={`${isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'} transition-opacity`}
                  >
                    <rect
                      x="0"
                      y="-4"
                      width="100"
                      height="24"
                      rx="4"
                      fill="#030712"
                      fillOpacity="0.85"
                      stroke="#334155"
                      strokeWidth="0.75"
                    />
                    <text x="6" y="8" fill="#e2e8f0" fontSize="9" fontWeight="600">
                      {sensor.name.split(' ')[0]}
                    </text>
                    <text x="6" y="17" fill={nodeColor} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
                      {sensor.currentValue.toFixed(1)} {sensor.unit}
                    </text>
                  </g>
                </g>
              );
            })}

          {/* Map Compass Rose */}
          <g transform="translate(60, 560)">
            <circle r="18" fill="#0b1120" stroke="#334155" strokeWidth="1" />
            <polygon points="0,-12 4,0 0,-3 -4,0" fill="#f43f5e" />
            <polygon points="0,12 4,0 0,3 -4,0" fill="#94a3b8" />
            <text x="0" y="-14" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="bold">
              N
            </text>
          </g>
        </svg>

        {/* Selected Sensor Floating Inspector Card */}
        {selectedSensor && (
          <div className="absolute bottom-4 right-4 max-w-sm bg-slate-900/95 border border-slate-700 rounded-lg p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-cyan-400">{selectedSensor.id}</span>
                <h4 className="text-sm font-semibold text-white">{selectedSensor.name}</h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  Zone: {selectedSensor.zone} · Elev: {selectedSensor.elevationMeters}m
                </div>
              </div>
              <button
                onClick={() => onSelectSensor(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800">
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Live Value</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {selectedSensor.currentValue.toFixed(1)} <span className="text-xs font-normal text-slate-400">{selectedSensor.unit}</span>
                </div>
              </div>
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Solar Battery</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                  {selectedSensor.batteryPct}%
                </div>
              </div>
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">LoRa RSSI</div>
                <div className="text-base font-bold text-slate-300 font-mono mt-0.5">
                  {selectedSensor.signalDbm} <span className="text-xs font-normal text-slate-500">dBm</span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Threshold Limits:</span>
              <span className="font-mono text-amber-400">Warn &gt; {selectedSensor.thresholdWarning}{selectedSensor.unit}</span>
              <span className="font-mono text-rose-400">Crit &gt; {selectedSensor.thresholdCritical}{selectedSensor.unit}</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
            <span>Nominal Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span>Threshold Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span>Critical Anomaly</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-900 border border-emerald-400 inline-block"></span>
            <span>Designated Shelter (Safe High Ground)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-emerald-400 inline-block"></span>
            <span>Elevation-Aware Evacuation Route</span>
          </div>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Mesh Topology: 8 Nodes Daisy-Chained · P2P Frequency: 915 MHz LoRa
        </div>
      </div>
    </div>
  );
};
