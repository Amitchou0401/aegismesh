import { GoogleGenAI } from '@google/genai';
import { buildLocalPlan } from './_plan';

// Vercel serverless function: POST /api/generate-plan
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const body = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(200).json(buildLocalPlan(body, 'local_heuristic_engine'));

  try {
    const { disasterType, riskLevel, probability, leadTimeMinutes, sensors, affectedZone, estimatedPopulation } = body;
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the lead Emergency Management AI and Incident Commander for AegisMesh, a student-engineered disaster management platform.
Write an Incident Action Plan (ICS-201 style) from these sensor ML predictions:
- Hazard: ${disasterType}
- Risk level: ${riskLevel}
- Probability: ${((Number(probability) || 0) * 100).toFixed(1)}%
- Lead time: ${leadTimeMinutes} minutes
- Zone: ${affectedZone}
- Vulnerable population: ${estimatedPopulation}
- Telemetry: ${JSON.stringify(sensors || {})}

Return pure valid JSON only (no markdown) with: incidentTitle, leadTime, severity, executiveSummary (2 sentences), tacticalPriorities (3 objects: timeframe, action, detail), evacuationRoutes (3 strings), broadcastScript { sms (under 160 chars), sirenPatter, spanish }, suggestedPersonnel (4 strings).`;

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const timeout = new Promise<null>((r) => setTimeout(() => r(null), 8000));
    const call = ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.2 },
    });
    const response: any = await Promise.race([call, timeout]);
    if (response && response.text) {
      const parsed = JSON.parse(String(response.text).trim());
      return res.status(200).json({ source: model, ...parsed });
    }
    return res.status(200).json(buildLocalPlan(body, 'local_heuristic_engine'));
  } catch (err) {
    console.error('Plan generation failed, using local plan:', err);
    return res.status(200).json(buildLocalPlan(body, 'local_fallback_engine'));
  }
}
