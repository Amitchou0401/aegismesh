import React, { useState, useEffect, useMemo } from 'react';
import {
  DisasterType,
  SensorNode,
  ShelterInfo,
  MitigationTask,
  CheckInRecord,
  DroneDamageReport,
  IncidentActionPlan,
  TelemetryFeatures,
} from './types/disaster';
import {
  INITIAL_TELEMETRY,
  SENSOR_NODES,
  SHELTERS,
  MITIGATION_TASKS,
  INITIAL_CHECKINS,
  INITIAL_DRONE_REPORTS,
} from './data/mockData';
import { runMLInference } from './utils/mlEngine';
import { playEmergencyAlertSiren, stopEmergencySiren, playChimePing } from './utils/sirenAudio';
import { TopNav } from './components/TopNav';
import { MLPredictionCard } from './components/MLPredictionCard';
import { CrisisMap } from './components/CrisisMap';
import { LiveTelemetryPanel } from './components/LiveTelemetryPanel';
import { DisasterLifecycleView } from './components/DisasterLifecycleView';
import { StudentInnovationLab } from './components/StudentInnovationLab';
import { AlertDispatchModal } from './components/AlertDispatchModal';
import { Activity, ShieldAlert, Cpu, Radio, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'map' | 'lifecycle' | 'innovations'>('overview');
  const [selectedHazard, setSelectedHazard] = useState<DisasterType>('flood');
  const [telemetry, setTelemetry] = useState<TelemetryFeatures>(INITIAL_TELEMETRY);
  const [sensors, setSensors] = useState<SensorNode[]>(SENSOR_NODES);
  const [shelters, setShelters] = useState<ShelterInfo[]>(SHELTERS);
  const [mitigationTasks, setMitigationTasks] = useState<MitigationTask[]>(MITIGATION_TASKS);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(INITIAL_CHECKINS);
  const [droneReports, setDroneReports] = useState<DroneDamageReport[]>(INITIAL_DRONE_REPORTS);
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(null);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [incidentPlan, setIncidentPlan] = useState<IncidentActionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);

  // Compute Machine Learning Inference in real-time
  const prediction = useMemo(() => {
    return runMLInference(selectedHazard, telemetry);
  }, [selectedHazard, telemetry]);

  // Sync sensor current values with telemetry changes
  useEffect(() => {
    setSensors((prev) =>
      prev.map((s) => {
        if (s.type === 'river_stage') {
          return { ...s, currentValue: telemetry.riverStageM };
        }
        if (s.type === 'weather_station') {
          return { ...s, currentValue: telemetry.rainfallRateMmH };
        }
        if (s.type === 'seismic_accelerometer') {
          return { ...s, currentValue: telemetry.groundAccelPgaG };
        }
        if (s.type === 'soil_inclinometer') {
          return { ...s, currentValue: telemetry.soilPorePressureKpa };
        }
        return s;
      })
    );
  }, [telemetry]);

  // Subtle real-time sensor fluctuation simulation
  useEffect(() => {
    if (!isLiveStreamActive) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Minor realistic Brownian jitter
        const jitter = (Math.random() - 0.48) * 0.04;
        return {
          ...prev,
          riverStageM: Math.max(0.5, Math.min(12, prev.riverStageM + jitter)),
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStreamActive]);

  // Toggle emergency siren sound
  const handleToggleSiren = () => {
    if (isSirenActive) {
      stopEmergencySiren();
      setIsSirenActive(false);
    } else {
      const started = playEmergencyAlertSiren('wail');
      if (started) {
        setIsSirenActive(true);
      }
    }
  };

  // Scenario presets injector
  const handleApplyPreset = (presetKey: string) => {
    playChimePing();
    switch (presetKey) {
      case 'nominal':
        setSelectedHazard('flood');
        setTelemetry({
          rainfallRateMmH: 4.5,
          upstreamSaturationPct: 28,
          riverStageM: 1.8,
          groundAccelPgaG: 0.003,
          pWaveFreqHz: 0.8,
          ambientTempC: 22.1,
          relativeHumidityPct: 65,
          windSpeedKmh: 12,
          soilPorePressureKpa: 14.0,
          slopeTiltDeg: 12.0,
        });
        break;
      case 'flood_surge':
        setSelectedHazard('flood');
        setTelemetry((prev) => ({
          ...prev,
          rainfallRateMmH: 88,
          upstreamSaturationPct: 94,
          riverStageM: 8.4,
        }));
        break;
      case 'quake_6_8':
        setSelectedHazard('earthquake');
        setTelemetry((prev) => ({
          ...prev,
          groundAccelPgaG: 0.38,
          pWaveFreqHz: 3.8,
        }));
        break;
      case 'wildfire_gale':
        setSelectedHazard('wildfire');
        setTelemetry((prev) => ({
          ...prev,
          ambientTempC: 39.5,
          relativeHumidityPct: 11,
          windSpeedKmh: 74,
        }));
        break;
      case 'landslide_shear':
        setSelectedHazard('landslide');
        setTelemetry((prev) => ({
          ...prev,
          soilPorePressureKpa: 62.4,
          slopeTiltDeg: 34.0,
          rainfallRateMmH: 65,
        }));
        break;
      default:
        break;
    }
  };

  // Generate Incident Action Plan via Gemini API or Local Engine
  const handleGeneratePlan = async () => {
    setIsLoadingPlan(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disasterType: prediction.hazardType,
          riskLevel: prediction.riskLevel,
          probability: prediction.probability,
          leadTimeMinutes: prediction.leadTimeMinutes,
          affectedZone: prediction.affectedZone,
          estimatedPopulation: prediction.estimatedVulnerablePopulation,
          sensors: {
            riverStageM: telemetry.riverStageM,
            rainfallRateMmH: telemetry.rainfallRateMmH,
            groundAccelPgaG: telemetry.groundAccelPgaG,
            windSpeedKmh: telemetry.windSpeedKmh,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      setIncidentPlan(data);
    } catch (err) {
      console.warn('Backend plan generation error, generating local plan:', err);
      // Fallback
      setIncidentPlan({
        source: 'local_client_engine',
        incidentTitle: `Operational Incident Action Plan (ICS-201): ${prediction.hazardType.toUpperCase()} EMERGENCY`,
        leadTime: `${prediction.leadTimeMinutes} minutes lead horizon`,
        severity: prediction.riskLevel,
        executiveSummary: `Real-time ML models indicate a ${(prediction.probability * 100).toFixed(0)}% likelihood of critical impact in ${prediction.affectedZone}. Immediate priority is securing life-safety and mobilizing elevation corridors.`,
        tacticalPriorities: [
          {
            timeframe: 'Immediate (0 to 15 min)',
            action: 'CAP Multi-Hop Siren Broadcast',
            detail: 'Activate community warning sirens and push geofenced mobile broadcast alerts.',
          },
          {
            timeframe: 'Initial Wave (15 to 60 min)',
            action: 'Evacuate Lowland Corridor',
            detail: 'Direct residents along Highland Ridge to designated safe shelters.',
          },
          {
            timeframe: 'Sustained (1 to 4 hours)',
            action: 'Deploy Search & Rescue Drones',
            detail: 'Deploy aerial reconnaissance to survey road blockages and damaged culverts.',
          },
        ],
        evacuationRoutes: [
          'Highland Ridge Arterial (Open & clear)',
          'North Arena Access Road (Primary designated refuge corridor)',
          'Avoid Lowland Confluence Bridge (Imminent water overtopping)',
        ],
        broadcastScript: {
          sms: `EMERGENCY ALERT: Real-time ML models detect critical ${prediction.hazardType} risk. Evacuate to high ground immediately. Follow marked safe routes.`,
          sirenPatter: 'Cycle: 3-second 900Hz wail with automated PA broadcast.',
          spanish: `ALERTA DE EMERGENCIA: Peligro crítico de ${prediction.hazardType}. Evacue a zonas altas de inmediato.`,
        },
        suggestedPersonnel: [
          'Incident Commander: 1',
          'Field SAR Teams: 12',
          'Medical First Responders: 6',
          'LoRa Mesh Operators: 4',
        ],
      });
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Toggle pre-disaster mitigation task
  const handleToggleTask = (taskId: string) => {
    setMitigationTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, completionPct: t.completionPct === 100 ? 50 : 100 }
          : t
      )
    );
  };

  // Add roll-call check-in record
  const handleAddCheckIn = (record: Omit<CheckInRecord, 'id' | 'timestamp'>) => {
    playChimePing();
    const newRecord: CheckInRecord = {
      ...record,
      id: `CHK-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCheckIns((prev) => [newRecord, ...prev]);
  };

  // Add drone damage survey record
  const handleAddDroneReport = (report: Omit<DroneDamageReport, 'id' | 'timestamp'>) => {
    playChimePing();
    const newReport: DroneDamageReport = {
      ...report,
      id: `DRN-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setDroneReports((prev) => [newReport, ...prev]);
  };

  // Generate initial plan on load
  useEffect(() => {
    if (!incidentPlan) {
      handleGeneratePlan();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedHazard={selectedHazard}
        setSelectedHazard={setSelectedHazard}
        isSirenActive={isSirenActive}
        onToggleSiren={handleToggleSiren}
        onOpenDispatch={() => setIsDispatchModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Hero Section Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <span>Student Engineering Innovation</span>
              <span aria-hidden="true">·</span>
              <span>Off-Grid LoRaWAN Mesh</span>
              <span aria-hidden="true">·</span>
              <span>Real-Time Edge ML Prediction</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AegisMesh: Disaster Early Warning & Lifecycle Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Empowering vulnerable campuses and municipalities with $38 solar-mesh sensor nodes,
              instantaneous on-device ML hazard forecasting, and seamless coordination before, during, and after crisis events.
            </p>
          </div>

          {/* Quick status counters */}
          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            <div className="bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-lg text-center">
              <div className="text-[10px] text-slate-500 uppercase">Active Nodes</div>
              <div className="text-sm font-bold text-cyan-400 tabular-nums">8 / 8 Online</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-lg text-center">
              <div className="text-[10px] text-slate-500 uppercase">Edge ML Latency</div>
              <div className="text-sm font-bold text-emerald-400 tabular-nums">11.4 ms</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-lg text-center">
              <div className="text-[10px] text-slate-500 uppercase">CAP Channels</div>
              <div className="text-sm font-bold text-amber-400 tabular-nums">4 Armed</div>
            </div>
          </div>
        </div>

        {/* Tab 1: Mission Control (Overview) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top 2-Column Split: GIS Crisis Map + ML Prediction Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <CrisisMap
                  sensors={sensors}
                  shelters={shelters}
                  prediction={prediction}
                  selectedSensor={selectedSensor}
                  onSelectSensor={setSelectedSensor}
                />
              </div>

              <div className="lg:col-span-5 flex flex-col">
                <MLPredictionCard
                  prediction={prediction}
                  onOpenActionPlan={() => {
                    setActiveTab('lifecycle');
                    handleGeneratePlan();
                  }}
                  onOpenBroadcast={() => setIsDispatchModalOpen(true)}
                />
              </div>
            </div>

            {/* Interactive Telemetry Parameter Injector */}
            <LiveTelemetryPanel
              telemetry={telemetry}
              setTelemetry={setTelemetry}
              selectedHazard={selectedHazard}
              setSelectedHazard={setSelectedHazard}
              onApplyPreset={handleApplyPreset}
            />

            {/* Disaster Lifecycle Preview Strip */}
            <DisasterLifecycleView
              mitigationTasks={mitigationTasks}
              onToggleTask={handleToggleTask}
              shelters={shelters}
              droneReports={droneReports}
              checkIns={checkIns}
              onAddCheckIn={handleAddCheckIn}
              onAddDroneReport={handleAddDroneReport}
              prediction={prediction}
              selectedHazard={selectedHazard}
              incidentPlan={incidentPlan}
              isLoadingPlan={isLoadingPlan}
              onGeneratePlan={handleGeneratePlan}
            />
          </div>
        )}

        {/* Tab 2: Live Telemetry */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            <LiveTelemetryPanel
              telemetry={telemetry}
              setTelemetry={setTelemetry}
              selectedHazard={selectedHazard}
              setSelectedHazard={setSelectedHazard}
              onApplyPreset={handleApplyPreset}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <MLPredictionCard
                  prediction={prediction}
                  onOpenActionPlan={() => {
                    setActiveTab('lifecycle');
                    handleGeneratePlan();
                  }}
                  onOpenBroadcast={() => setIsDispatchModalOpen(true)}
                />
              </div>
              <div className="lg:col-span-6">
                <CrisisMap
                  sensors={sensors}
                  shelters={shelters}
                  prediction={prediction}
                  selectedSensor={selectedSensor}
                  onSelectSensor={setSelectedSensor}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Crisis GIS Map Full Screen View */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <CrisisMap
              sensors={sensors}
              shelters={shelters}
              prediction={prediction}
              selectedSensor={selectedSensor}
              onSelectSensor={setSelectedSensor}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MLPredictionCard
                prediction={prediction}
                onOpenActionPlan={() => {
                  setActiveTab('lifecycle');
                  handleGeneratePlan();
                }}
                onOpenBroadcast={() => setIsDispatchModalOpen(true)}
              />
              <LiveTelemetryPanel
                telemetry={telemetry}
                setTelemetry={setTelemetry}
                selectedHazard={selectedHazard}
                setSelectedHazard={setSelectedHazard}
                onApplyPreset={handleApplyPreset}
              />
            </div>
          </div>
        )}

        {/* Tab 4: Disaster Lifecycle (Before, During, After) */}
        {activeTab === 'lifecycle' && (
          <div className="space-y-6">
            <DisasterLifecycleView
              mitigationTasks={mitigationTasks}
              onToggleTask={handleToggleTask}
              shelters={shelters}
              droneReports={droneReports}
              checkIns={checkIns}
              onAddCheckIn={handleAddCheckIn}
              onAddDroneReport={handleAddDroneReport}
              prediction={prediction}
              selectedHazard={selectedHazard}
              incidentPlan={incidentPlan}
              isLoadingPlan={isLoadingPlan}
              onGeneratePlan={handleGeneratePlan}
            />
          </div>
        )}

        {/* Tab 5: Student Innovation Showcase */}
        {activeTab === 'innovations' && (
          <div className="space-y-6">
            <StudentInnovationLab />
          </div>
        )}
      </main>

      {/* CAP Alert Broadcast Modal */}
      <AlertDispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        prediction={prediction}
        isSirenActive={isSirenActive}
        onToggleSiren={handleToggleSiren}
      />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-[#080c14] py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">AegisMesh Platform</span>
            <span aria-hidden="true">·</span>
            <span>Student Innovation in Disaster Risk Mitigation & Real-Time ML Alerts</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>CAP v1.2 Compliant</span>
            <span aria-hidden="true">·</span>
            <span>Sub-GHz LoRaWAN Mesh</span>
            <span aria-hidden="true">·</span>
            <span>TinyML Edge Inferencing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
