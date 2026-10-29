import React, { useState } from 'react';
import {
  DisasterPhase,
  DisasterType,
  IncidentActionPlan,
  MitigationTask,
  ShelterInfo,
  DroneDamageReport,
  CheckInRecord,
  MLPredictionResult,
} from '../types/disaster';
import {
  ShieldCheck,
  Zap,
  HeartHandshake,
  CheckCircle,
  Clock,
  Send,
  Building,
  Plus,
  RefreshCw,
  Search,
  FileText,
  AlertCircle,
  Truck,
} from 'lucide-react';

interface DisasterLifecycleViewProps {
  mitigationTasks: MitigationTask[];
  onToggleTask: (taskId: string) => void;
  shelters: ShelterInfo[];
  droneReports: DroneDamageReport[];
  checkIns: CheckInRecord[];
  onAddCheckIn: (record: Omit<CheckInRecord, 'id' | 'timestamp'>) => void;
  onAddDroneReport: (report: Omit<DroneDamageReport, 'id' | 'timestamp'>) => void;
  prediction: MLPredictionResult;
  selectedHazard: DisasterType;
  incidentPlan: IncidentActionPlan | null;
  isLoadingPlan: boolean;
  onGeneratePlan: () => void;
}

export const DisasterLifecycleView: React.FC<DisasterLifecycleViewProps> = ({
  mitigationTasks,
  onToggleTask,
  shelters,
  droneReports,
  checkIns,
  onAddCheckIn,
  onAddDroneReport,
  prediction,
  selectedHazard,
  incidentPlan,
  isLoadingPlan,
  onGeneratePlan,
}) => {
  const [activePhase, setActivePhase] = useState<DisasterPhase>('during');

  // Check-in form state
  const [nameInput, setNameInput] = useState('');
  const [affiliationInput, setAffiliationInput] = useState<'Student' | 'Faculty' | 'Resident' | 'Volunteer'>('Student');
  const [statusInput, setStatusInput] = useState<'Safe' | 'Sheltered' | 'Needs Assistance' | 'Medical Attention'>('Safe');
  const [locationInput, setLocationInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [searchCheckIn, setSearchCheckIn] = useState('');

  // Drone report form state
  const [droneSector, setDroneSector] = useState('Lower River Sector');
  const [droneGrade, setDroneGrade] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [droneStructure, setDroneStructure] = useState('Culvert & Roadbed');
  const [droneHazards, setDroneHazards] = useState('Debris blockage, minor scour');

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onAddCheckIn({
      fullName: nameInput.trim(),
      affiliation: affiliationInput,
      status: statusInput,
      location: locationInput.trim() || 'Central Zone',
      note: noteInput.trim() || undefined,
    });
    setNameInput('');
    setLocationInput('');
    setNoteInput('');
  };

  const handleDroneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDroneReport({
      sector: droneSector,
      damageGrade: droneGrade,
      structureType: droneStructure,
      hazardsIdentified: droneHazards.split(',').map((h) => h.trim()),
      immediateSearchRescueNeeded: droneGrade >= 4,
    });
  };

  const filteredCheckIns = checkIns.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchCheckIn.toLowerCase()) ||
      c.location.toLowerCase().includes(searchCheckIn.toLowerCase())
  );

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* 3-Phase Lifecycle Header Navigation */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            End-to-End Disaster Management Framework
          </h2>
          <div className="text-xs text-slate-400 mt-0.5">
            Holistic lifecycle engineering: Mitigation & Preparedness (Before), Real-Time ML Operations (During), and Rapid Recovery (After).
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActivePhase('before')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
              activePhase === 'before'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Before: Risk Mitigation</span>
          </button>

          <button
            onClick={() => setActivePhase('during')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
              activePhase === 'during'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>During: Real-Time Alerts</span>
          </button>

          <button
            onClick={() => setActivePhase('after')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
              activePhase === 'after'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>After: Relief & Recovery</span>
          </button>
        </div>
      </div>

      {/* PHASE 1: BEFORE DISASTER (Mitigation & Planning) */}
      {activePhase === 'before' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mitigation Checklist */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Pre-Disaster Community Mitigation Tasks
                  </h3>
                  <div className="text-xs text-slate-400">
                    Proactive engineering measures to suppress hazard vulnerability before impact.
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  {mitigationTasks.filter((t) => t.completionPct === 100).length}/{mitigationTasks.length} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {mitigationTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-lg flex items-start justify-between gap-4 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <CheckCircle
                          className={`w-4 h-4 ${
                            task.completionPct === 100 ? 'text-emerald-400' : 'text-slate-600'
                          }`}
                        />
                      </div>
                      <div>
                        <div
                          className={`text-xs font-medium ${
                            task.completionPct === 100 ? 'line-through text-slate-400' : 'text-slate-200'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span>Team: {task.assignedTeam}</span>
                          <span aria-hidden="true">·</span>
                          <span>Deadline: {task.deadline}</span>
                          <span aria-hidden="true">·</span>
                          <span className="uppercase font-mono text-amber-400">{task.priority} Priority</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 tabular-nums shrink-0">
                      {task.completionPct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Innovation: Mesh Node Deployment Calculator */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Student IoT Sensor Budget Model
                </h4>
                <div className="text-xs text-slate-400 mt-1">
                  Comparing AegisMesh LoRa nodes against standard commercial telemetry systems.
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <div className="text-slate-400">Campus & Catchment Area:</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">24.5 km² (Hilly Valley)</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <div className="text-slate-400">Recommended Node Density:</div>
                    <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">8 Mesh Nodes + 2 Gateways</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <div className="text-slate-400">Total Deployment Cost:</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      $460 (AegisMesh) vs $48,000 (USGS Station)
                    </div>
                    <div className="text-[11px] text-emerald-500/80 mt-1">
                      99.04% Cost Reduction · Open-Source Hardware
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                Powered by solar-harvesting supercapacitors. Retains telemetry communication during multi-day grid blackout.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: DURING DISASTER (Real-Time ML Operations & Incident Action Plan) */}
      {activePhase === 'during' && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Incident Action Plan (FEMA ICS-201 Operational Brief)</span>
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Synthesized dynamically from live ML sensor predictions for {selectedHazard.toUpperCase()} in {prediction.affectedZone}.
              </div>
            </div>

            <button
              onClick={onGeneratePlan}
              disabled={isLoadingPlan}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-md transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPlan ? 'animate-spin' : ''}`} />
              <span>{isLoadingPlan ? 'Synthesizing with Gemini AI...' : 'Re-Generate Real-Time IAP'}</span>
            </button>
          </div>

          {incidentPlan ? (
            <div className="space-y-5">
              {/* Executive Summary */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                  <span>{incidentPlan.incidentTitle}</span>
                  <span className="text-amber-400">SEVERITY: {incidentPlan.severity}</span>
                </div>
                <p className="text-sm text-slate-200 mt-2 leading-relaxed">
                  {incidentPlan.executiveSummary}
                </p>
                <div className="text-xs font-mono text-cyan-400 mt-2">
                  Impact Lead Time Horizon: {incidentPlan.leadTime}
                </div>
              </div>

              {/* Tactical Priorities Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Tactical Phase Priorities (ICS Response Matrix)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {incidentPlan.tacticalPriorities.map((tp, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-lg">
                      <div className="text-xs font-mono text-amber-400 uppercase font-semibold">
                        {tp.timeframe}
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">
                        {tp.action}
                      </div>
                      <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {tp.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evacuation Directives & Responder Resource Staging */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 font-mono">
                    Designated Evacuation Corridors
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {incidentPlan.evacuationRoutes.map((route, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">›</span>
                        <span>{route}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg">
                  <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 font-mono">
                    Emergency Responder Allocations
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {incidentPlan.suggestedPersonnel.map((person, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">▪</span>
                        <span>{person}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Multi-Channel Broadcast Scripts */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Emergency Multi-Channel Broadcast Scripts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Cell Broadcast (SMS 160-Char)</span>
                    <p className="text-slate-200 mt-1 font-mono text-[11px] leading-relaxed">
                      "{incidentPlan.broadcastScript.sms}"
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Spanish Broadcast (Alerta Bilingüe)</span>
                    <p className="text-slate-200 mt-1 font-mono text-[11px] leading-relaxed">
                      "{incidentPlan.broadcastScript.spanish}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-950/40 border border-dashed border-slate-800 rounded-lg">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-300">Click "Re-Generate Real-Time IAP" to construct the incident action plan.</p>
            </div>
          )}
        </div>
      )}

      {/* PHASE 3: AFTER DISASTER (Relief, Shelters, Check-In & Drone Triage) */}
      {activePhase === 'after' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Safe Check-In & Roll-Call Registry */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Citizen & Student Roll-Call Registry
                  </h3>
                  <div className="text-xs text-slate-400">
                    Decentralized offline-cached check-in list for search & rescue accountability.
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400">
                  {checkIns.length} Verified Records
                </span>
              </div>

              {/* Submit Safe Status Form */}
              <form onSubmit={handleCheckInSubmit} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-500"
                  />
                  <select
                    value={affiliationInput}
                    onChange={(e) => setAffiliationInput(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-300 focus:outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty / Staff</option>
                    <option value="Resident">Community Resident</option>
                    <option value="Volunteer">Volunteer / Responder</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-300 focus:outline-none"
                  >
                    <option value="Safe">Safe / Uninjured</option>
                    <option value="Sheltered">Sheltered at High Ground</option>
                    <option value="Needs Assistance">Needs Assistance / Trapped</option>
                    <option value="Medical Attention">Requires Medical Attention</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Current Location / Room / Sector"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Optional details (e.g. battery level, trapped with 2 people)"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap"
                  >
                    Post Check-In
                  </button>
                </div>
              </form>

              {/* Search & Records List */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Filter check-in records by name or sector..."
                    value={searchCheckIn}
                    onChange={(e) => setSearchCheckIn(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {filteredCheckIns.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-slate-950/60 border border-slate-800 rounded text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          <span>{item.fullName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({item.affiliation})</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          Location: {item.location} {item.note && `· "${item.note}"`}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                            item.status === 'Safe' || item.status === 'Sheltered'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-rose-950 text-rose-300'
                          }`}
                        >
                          {item.status}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">{item.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drone Aerial Damage Assessment & Shelters */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Post-Disaster Drone Reconnaissance & Damage Logging
                </h3>
                <div className="text-xs text-slate-400">
                  Student autonomous drone survey tagging infrastructure damage grades (1 Minor to 5 Total Failure).
                </div>
              </div>

              {/* Quick Drone Entry Form */}
              <form onSubmit={handleDroneSubmit} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={droneSector}
                    onChange={(e) => setDroneSector(e.target.value)}
                    placeholder="Sector / GPS"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                  <select
                    value={droneGrade}
                    onChange={(e) => setDroneGrade(Number(e.target.value) as any)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-300"
                  >
                    <option value={1}>Grade 1 - Negligible Damage</option>
                    <option value={2}>Grade 2 - Minor Surface Scour</option>
                    <option value={3}>Grade 3 - Moderate Structural Compromise</option>
                    <option value={4}>Grade 4 - Severe Hazard / Pass Impassable</option>
                    <option value={5}>Grade 5 - Complete Collapse / Total Loss</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={droneHazards}
                    onChange={(e) => setDroneHazards(e.target.value)}
                    placeholder="Observed Hazards (comma separated)"
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded"
                  >
                    Log Drone Tag
                  </button>
                </div>
              </form>

              {/* Drone Reports Feed */}
              <div className="space-y-2">
                {droneReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{report.sector}</span>
                        <span className="text-slate-500 font-mono text-[11px]">· {report.structureType}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-1">
                        Hazards: {report.hazardsIdentified.join(', ')}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          report.damageGrade >= 4
                            ? 'bg-rose-950 text-rose-300'
                            : report.damageGrade === 3
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        GRADE {report.damageGrade}
                      </span>
                      {report.immediateSearchRescueNeeded && (
                        <div className="text-[10px] text-rose-400 font-mono font-bold mt-1">
                          SAR DEPLOY REQUIRED
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shelter Rations Tracker */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
                  <span>Emergency High-Ground Shelters Inventory</span>
                  <Truck className="w-4 h-4 text-slate-400" />
                </div>
                <div className="space-y-2 text-xs">
                  {shelters.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800/80">
                      <div>
                        <div className="font-medium text-slate-200">{s.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Water: {s.waterSupplyDays} Days · Medical: {s.medicalPersonnelPresent ? 'Stationed' : 'On Route'}
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums text-slate-300">
                        {s.currentCapacity} / {s.maxCapacity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
