import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Google Gen AI client for incident action planning
  const apiKey = process.env.GEMINI_API_KEY || '';
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // AI-Powered Incident Action Plan endpoint
  app.post('/api/generate-plan', async (req, res) => {
    try {
      const {
        disasterType,
        riskLevel,
        probability,
        leadTimeMinutes,
        sensors,
        affectedZone,
        estimatedPopulation,
      } = req.body;

      if (!ai) {
        // Return rich, realistic student-engineered fallback IAP plan
        return res.json({
          source: 'local_heuristic_engine',
          incidentTitle: `Operational Incident Action Plan (ICS-201): ${disasterType?.toUpperCase() || 'HAZARD'} RESPONSE`,
          leadTime: `${leadTimeMinutes || 30} minutes remaining until peak critical impact`,
          severity: riskLevel || 'HIGH',
          executiveSummary: `Real-time ML telemetry has detected an elevated anomaly in ${affectedZone || 'Zone 1'}. Predictive models forecast a ${Math.round((probability || 0.85) * 100)}% probability of severe impact affecting an estimated ${estimatedPopulation?.toLocaleString() || '14,200'} residents. Automated mitigation gates have been signaled.`,
          tacticalPriorities: [
            {
              timeframe: 'Immediate (T-0 to 15 min)',
              action: 'Automated Multi-Channel Alert Dispatch',
              detail: 'Deploy CAP broadcast to sirens, SMS, LoRaWAN campus nodes, and mobile notification networks. Trigger seismic/flood gate shutoff protocols.',
            },
            {
              timeframe: 'Initial Response (T+15 to 60 min)',
              action: 'Controlled Zonal Evacuation',
              detail: `Evacuate priority corridor ${affectedZone || 'Sector Alpha'} along high-elevation routes toward designated safe havens and shelters.`,
            },
            {
              timeframe: 'Sustained Ops (T+1 to 4 hours)',
              action: 'Resource Staging & Roll-Call Verification',
              detail: 'Position auxiliary water pumps, rescue skiffs, and drone telemetry teams. Coordinate community roll-call check-ins.',
            },
          ],
          evacuationRoutes: [
            'North Ridge Arterial (Primary elevated corridor - open)',
            'Valley Bypass (Warning: approaching flood/landslide risk, avoid)',
            'Highland Community Sports Complex (Designated primary shelter)',
          ],
          broadcastScript: {
            sms: `EMERGENCY ALERT: Real-time ML models detect critical ${disasterType} risk in ${affectedZone}. Evacuate to high ground immediately. Follow marked safe routes.`,
            sirenPatter: '3-tone warble (1000Hz/800Hz 3s pulse) followed by automated synthesized PA announcement.',
            spanish: `ALERTA DE EMERGENCIA: Peligro crítico de ${disasterType} detectado en ${affectedZone}. Evacue a zonas seguras de inmediato.`,
          },
          suggestedPersonnel: [
            'Incident Commander: 1',
            'Search & Rescue Operators: 14',
            'Medical Triage Team: 8',
            'LoRa Mesh Comms Volunteers: 6',
          ],
        });
      }

      const prompt = `You are the lead Emergency Management AI and Incident Commander for AegisMesh, a student-engineered disaster management platform.
Synthesize a professional Incident Action Plan (IAP / ICS-201 format) based on the following real-time sensor ML predictions:
- Disaster Hazard Type: ${disasterType}
- ML Risk Level: ${riskLevel}
- Anomaly Probability: ${(probability * 100).toFixed(1)}%
- Estimated Lead Time: ${leadTimeMinutes} minutes
- Affected Target Zone: ${affectedZone}
- Vulnerable Population: ${estimatedPopulation}
- Key Sensor Telemetry: ${JSON.stringify(sensors || {})}

Provide a structured JSON response with:
1. incidentTitle: concise formal ICS-201 title
2. leadTime: lead time string
3. severity: severity string
4. executiveSummary: 2-sentence situational briefing
5. tacticalPriorities: array of 3 objects with { timeframe, action, detail }
6. evacuationRoutes: array of 3 realistic recommended route directives
7. broadcastScript: object with { sms (under 160 chars), sirenPatter, spanish }
8. suggestedPersonnel: array of 4 required responder team assignments

Return pure valid JSON only without markdown formatting.`;

      // Wrap with 6-second timeout race so client never hangs if API is slow or throttled
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000));
      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const response = await Promise.race([aiPromise, timeoutPromise]);

      if (response && 'text' in response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({ source: 'gemini_3.8_flash', ...parsed });
      }

      // If timed out or empty, return robust student fallback plan
      return res.json({
        source: 'local_heuristic_engine',
        incidentTitle: `Operational Incident Action Plan (ICS-201): ${disasterType?.toUpperCase() || 'HAZARD'} RESPONSE`,
        leadTime: `${leadTimeMinutes || 30} minutes remaining until peak critical impact`,
        severity: riskLevel || 'HIGH',
        executiveSummary: `Real-time ML telemetry has detected an elevated anomaly in ${affectedZone || 'Zone 1'}. Predictive models forecast an early warning with automated mitigation gates signaled.`,
        tacticalPriorities: [
          {
            timeframe: 'Immediate (T-0 to 15 min)',
            action: 'Automated Multi-Channel Alert Dispatch',
            detail: 'Deploy CAP broadcast to sirens, SMS, LoRaWAN campus nodes, and mobile notification networks.',
          },
          {
            timeframe: 'Initial Response (T+15 to 60 min)',
            action: 'Controlled Zonal Evacuation',
            detail: `Evacuate priority corridor ${affectedZone || 'Sector Alpha'} along high-elevation routes toward designated safe havens and shelters.`,
          },
          {
            timeframe: 'Sustained Ops (T+1 to 4 hours)',
            action: 'Resource Staging & Roll-Call Verification',
            detail: 'Position auxiliary water pumps, rescue skiffs, and drone telemetry teams. Coordinate community roll-call check-ins.',
          },
        ],
        evacuationRoutes: [
          'North Ridge Arterial (Primary elevated corridor - open)',
          'Valley Bypass (Warning: approaching flood/landslide risk, avoid)',
          'Highland Community Sports Complex (Designated primary shelter)',
        ],
        broadcastScript: {
          sms: `EMERGENCY ALERT: Real-time ML models detect critical ${disasterType} risk in ${affectedZone}. Evacuate to high ground immediately. Follow marked safe routes.`,
          sirenPatter: '3-tone warble (1000Hz/800Hz 3s pulse) followed by automated synthesized PA announcement.',
          spanish: `ALERTA DE EMERGENCIA: Peligro crítico de ${disasterType} detectado en ${affectedZone}. Evacue a zonas seguras de inmediato.`,
        },
        suggestedPersonnel: [
          'Incident Commander: 1',
          'Search & Rescue Operators: 14',
          'Medical Triage Team: 8',
          'LoRa Mesh Comms Volunteers: 6',
        ],
      });
    } catch (err: any) {
      console.error('Error in plan generation, returning local plan:', err);
      return res.json({
        source: 'local_fallback_engine',
        incidentTitle: `Operational Incident Action Plan: ${req.body?.disasterType?.toUpperCase() || 'HAZARD'} RESPONSE`,
        leadTime: `${req.body?.leadTimeMinutes || 30} min lead time`,
        severity: req.body?.riskLevel || 'HIGH',
        executiveSummary: `Real-time telemetry triggered emergency protocol. Automated valves and sirens dispatched.`,
        tacticalPriorities: [
          { timeframe: 'Immediate (0-15m)', action: 'CAP Siren Broadcast', detail: 'Deploy alerts across all radio and siren arrays.' },
          { timeframe: 'Phase 2 (15-60m)', action: 'Evacuation Corridors', detail: 'Mobilize high-ground evacuation toward Highland Ridge.' },
          { timeframe: 'Phase 3 (1-4h)', action: 'Triage & Roll-Call', detail: 'Open shelters and log drone damage.' }
        ],
        evacuationRoutes: ['Highland Ridge Arterial', 'North Arena Access Road'],
        broadcastScript: {
          sms: 'EMERGENCY ALERT: Immediate evacuation ordered. Move to high ground.',
          sirenPatter: '3-tone standard disaster warble.',
          spanish: 'ALERTA DE EMERGENCIA: Evacue a zonas altas de inmediato.'
        },
        suggestedPersonnel: ['Incident Commander: 1', 'SAR Team: 10', 'Medical Triage: 6']
      });
    }
  });

  // Common Alerting Protocol (CAP) Broadcast simulator endpoint
  app.post('/api/cap-broadcast', (req, res) => {
    const { alertData } = req.body;
    const identifier = `AEGIS-CAP-${Date.now()}`;
    const sentTime = new Date().toISOString();

    const capPayload = {
      identifier,
      sender: 'aegis-mesh-student-node@innovation.lab',
      sent: sentTime,
      status: 'Actual',
      msgType: 'Alert',
      scope: 'Public',
      info: {
        category: 'Geo',
        event: alertData?.event || 'Flash Flood Warning',
        urgency: alertData?.urgency || 'Immediate',
        severity: alertData?.severity || 'Severe',
        certainty: alertData?.certainty || 'Observed',
        headline: alertData?.headline || 'Machine Learning Alert: Critical Hazard Inbound',
        description: alertData?.description || 'Automated sensor mesh detected extreme threshold crossing.',
        instruction: alertData?.instruction || 'Move immediately to designated elevation rally points.',
        area: {
          areaDesc: alertData?.areaDesc || 'Metro Basin & Lowland University Campus',
          circle: '37.7749,-122.4194,5.0',
        },
      },
    };

    return res.json({
      success: true,
      identifier,
      dispatchedChannels: ['Cell_Broadcast', 'LoRaWAN_Relay_Mesh', 'Siren_Array_ZoneA', 'APRS_Amateur_Radio'],
      payload: capPayload,
    });
  });

  // Setup Vite development server or static serving
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AegisMesh full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
