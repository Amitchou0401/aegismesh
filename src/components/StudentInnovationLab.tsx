import React, { useState } from 'react';
import { STUDENT_INNOVATION_SPECS } from '../data/mockData';
import { Cpu, Radio, Shield, DollarSign, Activity, Check, ArrowRight } from 'lucide-react';

export const StudentInnovationLab: React.FC = () => {
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);
  const [simulatedPacketHop, setSimulatedPacketHop] = useState<number>(0);
  const [isHopping, setIsHopping] = useState(false);

  const triggerPacketSimulation = () => {
    if (isHopping) return;
    setIsHopping(true);
    setSimulatedPacketHop(0);

    const interval = setInterval(() => {
      setSimulatedPacketHop((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsHopping(false);
          return 3;
        }
        return prev + 1;
      });
    }, 450);
  };

  const currentSpec = STUDENT_INNOVATION_SPECS[activeSpecIndex];

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-lg p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <span>Student Innovation Lab: Resilient Disaster Tech</span>
        </h2>
        <div className="text-xs text-slate-400 mt-1">
          Bridging the gap between expensive institutional monitoring and underserved vulnerable communities through open-source hardware, TinyML edge inference, and off-grid LoRa mesh networking.
        </div>
      </div>

      {/* Grid of 4 Key Student Breakthroughs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {STUDENT_INNOVATION_SPECS.map((spec, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSpecIndex(idx)}
            className={`p-4 rounded-lg text-left transition-all border ${
              activeSpecIndex === idx
                ? 'bg-slate-900 border-amber-500/80 shadow-md'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] font-mono text-amber-400">INNOVATION 0{idx + 1}</div>
            <div className="text-sm font-semibold text-white mt-1">{spec.title}</div>
            <div className="text-xs text-slate-400 mt-2 line-clamp-2">{spec.costComparison}</div>
          </button>
        ))}
      </div>

      {/* Deep-Dive Active Innovation Card */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Architecture & Breakthrough Design
            </span>
            <h3 className="text-lg font-bold text-white mt-1">{currentSpec.title}</h3>
            <div className="text-xs font-mono text-emerald-400 mt-0.5">
              Cost Vector: {currentSpec.costComparison}
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {currentSpec.innovation}
          </p>

          <div className="pt-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Key Engineering Benchmarks
            </h4>
            <div className="space-y-1.5">
              {currentSpec.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive LoRa P2P Packet Mesh Simulator */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span>Mesh Packet Hop Trace</span>
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            <div className="space-y-3">
              {['Node 01: River Gauge', 'Node 02: Mountain Relay', 'Node 03: Community Siren', 'Gateway: Crisis Command'].map(
                (step, stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`p-2.5 rounded border text-xs flex items-center justify-between transition-all ${
                      simulatedPacketHop === stepIdx
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 font-bold scale-[1.02]'
                        : simulatedPacketHop > stepIdx
                        ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span>{step}</span>
                    <span className="font-mono text-[10px]">
                      {simulatedPacketHop === stepIdx ? 'TRANSMITTING' : simulatedPacketHop > stepIdx ? 'ACK' : 'QUEUED'}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <button
            onClick={triggerPacketSimulation}
            disabled={isHopping}
            className="mt-4 w-full py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded transition-colors"
          >
            {isHopping ? 'Propagating Radio Signal...' : 'Simulate Off-Grid LoRa Packet Hop'}
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-3 bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-white">
          System Comparison: Institutional Commercial Hardware vs. AegisMesh Student Innovation
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Specification / Metric</th>
                <th className="p-3">Traditional Institutional Station</th>
                <th className="p-3 text-amber-400">AegisMesh Student System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="p-3 font-medium text-white">Hardware Unit Cost</td>
                <td className="p-3 font-mono tabular-nums">$8,000 – $15,000 per station</td>
                <td className="p-3 font-mono tabular-nums text-emerald-400 font-bold">$38 – $55 per node (3D Printed)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Grid Blackout Resiliency</td>
                <td className="p-3">Requires cellular towers & lead-acid batteries (fails at 48h)</td>
                <td className="p-3 text-emerald-400 font-medium">LoRaWAN Sub-GHz P2P Mesh + Solar Supercapacitors (Indefinite)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Early Warning Latency</td>
                <td className="p-3">5–15 minutes (Cloud telemetry polling cycle)</td>
                <td className="p-3 text-emerald-400 font-bold font-mono">12 milliseconds (On-Device TinyML inference)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Community Alert Integration</td>
                <td className="p-3">Proprietary sirens, restricted agency dispatch</td>
                <td className="p-3 text-emerald-400 font-medium">Standard CAP v1.2, Cell Broadcast, LoRa Siren, APRS Ham Radio</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
