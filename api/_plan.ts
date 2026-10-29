// Shared local (no-AI) Incident Action Plan builder. Files starting with "_" are not exposed as routes.
export function buildLocalPlan(body: any, source: string) {
  const { disasterType, riskLevel, probability, leadTimeMinutes, affectedZone } = body || {};
  const hazard = String(disasterType || 'hazard');
  const zone = affectedZone || 'Sector Alpha';
  const pct = Math.round((Number(probability) || 0.5) * 100);
  return {
    source,
    incidentTitle: `Operational Incident Action Plan (ICS-201): ${hazard.toUpperCase()} RESPONSE`,
    leadTime: `${leadTimeMinutes || 30} minutes remaining until peak critical impact`,
    severity: riskLevel || 'HIGH',
    executiveSummary: `Real-time telemetry shows an elevated ${hazard} anomaly in ${zone} (model probability ${pct}%). Automated mitigation and alert dispatch are signaled; responders should begin staged evacuation.`,
    tacticalPriorities: [
      { timeframe: 'Immediate (T-0 to 15 min)', action: 'Automated Multi-Channel Alert Dispatch', detail: 'Deploy CAP broadcast to sirens, SMS, LoRaWAN campus nodes, and mobile notification networks.' },
      { timeframe: 'Initial Response (T+15 to 60 min)', action: 'Controlled Zonal Evacuation', detail: `Evacuate priority corridor ${zone} along high-elevation routes toward designated shelters.` },
      { timeframe: 'Sustained Ops (T+1 to 4 hours)', action: 'Resource Staging & Roll-Call Verification', detail: 'Position pumps, rescue boats and drone teams. Coordinate community roll-call check-ins.' },
    ],
    evacuationRoutes: [
      'North Ridge Arterial (primary elevated corridor)',
      'Valley Bypass (avoid: approaching flood/landslide risk)',
      'Highland Community Sports Complex (primary shelter)',
    ],
    broadcastScript: {
      sms: `EMERGENCY ALERT: ${hazard} risk detected in ${zone}. Evacuate to high ground immediately.`,
      sirenPatter: '3-tone warble (1000Hz/800Hz, 3 s pulse) followed by a PA announcement.',
      spanish: `ALERTA DE EMERGENCIA: Riesgo de ${hazard} en ${zone}. Evacue a zonas altas de inmediato.`,
    },
    suggestedPersonnel: [
      'Incident Commander: 1',
      'Search & Rescue Operators: 14',
      'Medical Triage Team: 8',
      'LoRa Mesh Comms Volunteers: 6',
    ],
  };
}
