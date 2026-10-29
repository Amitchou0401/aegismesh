import React from 'react';
import { MLPredictionResult } from '../types/disaster';
import {
  BrainCircuit,
  Clock,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Radio,
  Power,
  Users,
} from 'lucide-react';

interface MLPredictionCardProps {
  prediction: MLPredictionResult;
  onOpenActionPlan: () => void;
  onOpenBroadcast: () => void;
}

export const MLPredictionCard: React.FC<MLPredictionCardProps> = ({
  prediction,
  onOpenActionPlan,
  onOpenBroadcast,
}) => {
  const isEmergency =
    prediction.riskLevel === 'CRITICAL_EVACUATION' || prediction.riskLevel === 'WARNING';

  // Severity color schemes (WCAG AA compliant)
  const badgeColors = {
    NOMINAL: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800',
    ADVISORY: 'bg-blue-950/80 text-blue-300 border border-blue-800',
    WATCH: 'bg-amber-950/80 text-amber-300 border border-amber-800',
    WARNING: 'bg-orange-950/80 text-orange-300 border border-orange-800',
    CRITICAL_EVACUATION: 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse',
  }[prediction.riskLevel];

  const leadTimeDisplay =
    prediction.hazardType === 'earthquake'
      ? `${Math.round(prediction.leadTimeMinutes * 60)} Seconds`
      : `${prediction.leadTimeMinutes} Minutes`;

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between gap-5">
      {/* Top Header: Hazard & ML Classification */}
      <div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
              ML Multi-Hazard Prediction Engine
            </h3>
          </div>

          {/* Clean unboxed metadata with dot separator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Latency: {prediction.modelDetails.inferenceLatencyMs}ms</span>
            <span aria-hidden="true">·</span>
            <span>F1: {prediction.modelDetails.f1Score}</span>
            <span aria-hidden="true">·</span>
            <span>Edge TinyML</span>
          </div>
        </div>

        {/* Big Alert Banner */}
        <div className={`mt-3.5 p-4 rounded-lg flex items-center justify-between gap-4 flex-wrap ${badgeColors}`}>
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 shrink-0" />
            <div>
              <div className="text-xs font-mono uppercase tracking-wider opacity-80">
                Current Risk Assessment · {prediction.hazardType.toUpperCase()}
              </div>
              <div className="text-lg font-bold tracking-tight mt-0.5">
                {prediction.riskLevel.replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[11px] font-mono opacity-80 uppercase">Hazard Probability</div>
              <div className="text-2xl font-bold font-mono tabular-nums">
                {(prediction.probability * 100).toFixed(1)}%
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-mono opacity-80 uppercase flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" />
                <span>Impact Lead Time</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-white">
                {leadTimeDisplay}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affected Area & Population Brief */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Primary Threat Corridor</span>
          <div className="text-xs font-semibold text-slate-200 mt-1">
            {prediction.affectedZone}
          </div>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-mono uppercase">Vulnerable Population</span>
            <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
              {prediction.estimatedVulnerablePopulation.toLocaleString()} Residents
            </div>
          </div>
          <Users className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Explainable AI: Feature Importance (SHAP Weights) */}
      <div>
        <div className="text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
          <span>Feature Attribution (Explainable SHAP Contributions)</span>
          <span className="text-[11px] text-slate-500 font-mono">Normalized Weight</span>
        </div>
        <div className="space-y-2">
          {prediction.featureWeights.map((fw, idx) => (
            <div key={idx} className="bg-slate-950/50 p-2 rounded border border-slate-850">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-200 font-medium">{fw.featureName}</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {(fw.importance * 100).toFixed(0)}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fw.impact === 'positive' ? 'bg-amber-400' : 'bg-slate-600'
                  }`}
                  style={{ width: `${Math.min(100, fw.importance * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {fw.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student IoT Innovation: Automated Infrastructure Interventions */}
      <div>
        <div className="text-xs font-medium text-slate-300 mb-2">
          Automated IoT Actuator Interventions (Fail-Safe Subsystems)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className={`p-2 rounded border flex items-center gap-2 ${
            prediction.automatedInterventions.floodGatesClosed
              ? 'bg-blue-950/40 border-blue-700/60 text-blue-300'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Flood Gates: {prediction.automatedInterventions.floodGatesClosed ? 'LOCKED' : 'OPEN'}</span>
          </div>

          <div className={`p-2 rounded border flex items-center gap-2 ${
            prediction.automatedInterventions.gasMainShutoff
              ? 'bg-rose-950/40 border-rose-700/60 text-rose-300'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <Power className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Gas Valves: {prediction.automatedInterventions.gasMainShutoff ? 'SHUT' : 'ARMED'}</span>
          </div>

          <div className={`p-2 rounded border flex items-center gap-2 ${
            prediction.automatedInterventions.sirenArrayArmed
              ? 'bg-amber-950/40 border-amber-700/60 text-amber-300'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Siren Array: {prediction.automatedInterventions.sirenArrayArmed ? 'ACTIVE' : 'STANDBY'}</span>
          </div>

          <div className={`p-2 rounded border flex items-center gap-2 ${
            prediction.automatedInterventions.transitDiverted
              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Transit: {prediction.automatedInterventions.transitDiverted ? 'DIVERTED' : 'NORMAL'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
        <button
          onClick={onOpenActionPlan}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap text-center shadow-sm"
        >
          Generate AI Incident Action Plan (ICS-201)
        </button>
        <button
          onClick={onOpenBroadcast}
          className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap text-center shadow-sm"
        >
          Dispatch Multi-Channel CAP Alert
        </button>
      </div>
    </div>
  );
};
