// Vercel serverless function: POST /api/cap-broadcast (simulated CAP v1.2 dispatch)
export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const alertData = (req.body || {}).alertData || {};
  const identifier = `AEGIS-CAP-${Date.now()}`;
  const capPayload = {
    identifier,
    sender: 'aegis-mesh-student-node@innovation.lab',
    sent: new Date().toISOString(),
    status: 'Exercise',
    msgType: 'Alert',
    scope: 'Public',
    info: {
      category: 'Geo',
      event: alertData.event || 'Flash Flood Warning',
      urgency: alertData.urgency || 'Immediate',
      severity: alertData.severity || 'Severe',
      certainty: alertData.certainty || 'Observed',
      headline: alertData.headline || 'Machine Learning Alert: Critical Hazard Inbound',
      description: alertData.description || 'Automated sensor mesh detected extreme threshold crossing.',
      instruction: alertData.instruction || 'Move immediately to designated elevation rally points.',
      area: {
        areaDesc: alertData.areaDesc || 'Metro Basin & Lowland University Campus',
        circle: '37.7749,-122.4194,5.0',
      },
    },
  };
  return res.status(200).json({
    success: true,
    identifier,
    simulated: true,
    dispatchedChannels: ['Cell_Broadcast', 'LoRaWAN_Relay_Mesh', 'Siren_Array_ZoneA', 'APRS_Amateur_Radio'],
    payload: capPayload,
  });
}
