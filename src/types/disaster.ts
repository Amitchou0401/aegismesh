export type DisasterType = 'flood' | 'earthquake' | 'wildfire' | 'landslide';

export type RiskLevel = 'NOMINAL' | 'ADVISORY' | 'WATCH' | 'WARNING' | 'CRITICAL_EVACUATION';

export type DisasterPhase = 'before' | 'during' | 'after';

export interface SensorNode {
  id: string;
  name: string;
  type: 'river_stage' | 'seismic_accelerometer' | 'weather_station' | 'soil_inclinometer';
  zone: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  batteryPct: number;
  signalDbm: number;
  status: 'nominal' | 'alert' | 'warning' | 'offline';
  currentValue: number;
  unit: string;
  historicalValues: number[];
  thresholdWarning: number;
  thresholdCritical: number;
}

export interface TelemetryFeatures {
  rainfallRateMmH: number; // 0 - 150 mm/h
  upstreamSaturationPct: number; // 0 - 100%
  riverStageM: number; // 0.5 - 12.0 m
  groundAccelPgaG: number; // 0.001 - 1.5 g
  pWaveFreqHz: number; // 0.5 - 25 Hz
  ambientTempC: number; // 10 - 48 C
  relativeHumidityPct: number; // 5 - 95%
  windSpeedKmh: number; // 0 - 120 km/h
  soilPorePressureKpa: number; // 5 - 80 kPa
  slopeTiltDeg: number; // 0 - 45 deg
}

export interface FeatureWeight {
  featureName: string;
  importance: number; // 0 - 1
  impact: 'positive' | 'negative';
  description: string;
}

export interface MLPredictionResult {
  hazardType: DisasterType;
  probability: number; // 0.0 - 1.0
  riskLevel: RiskLevel;
  confidenceScore: number; // 0 - 100%
  leadTimeMinutes: number; // minutes or seconds converted
  affectedZone: string;
  estimatedVulnerablePopulation: number;
  featureWeights: FeatureWeight[];
  modelDetails: {
    algorithm: string;
    inferenceLatencyMs: number;
    trainingDatasetSize: string;
    f1Score: number;
  };
  automatedInterventions: {
    floodGatesClosed: boolean;
    gasMainShutoff: boolean;
    powerGridIsolated: boolean;
    sirenArrayArmed: boolean;
    transitDiverted: boolean;
  };
}

export interface CapAlertPayload {
  identifier: string;
  sender: string;
  sentTime: string;
  status: string;
  msgType: string;
  headline: string;
  description: string;
  instruction: string;
  severity: string;
  urgency: string;
  certainty: string;
  areaDesc: string;
}

export interface ShelterInfo {
  id: string;
  name: string;
  zone: string;
  currentCapacity: number;
  maxCapacity: number;
  amenities: string[];
  medicalPersonnelPresent: boolean;
  waterSupplyDays: number;
  status: 'open' | 'approaching_limit' | 'full';
}

export interface MitigationTask {
  id: string;
  title: string;
  category: 'structural' | 'community' | 'sensor_maintenance' | 'drainage';
  assignedTeam: string;
  completionPct: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
}

export interface DroneDamageReport {
  id: string;
  sector: string;
  timestamp: string;
  damageGrade: 1 | 2 | 3 | 4 | 5; // 1: Minor, 5: Total Collapse
  structureType: string;
  hazardsIdentified: string[];
  immediateSearchRescueNeeded: boolean;
}

export interface CheckInRecord {
  id: string;
  fullName: string;
  affiliation: 'Student' | 'Faculty' | 'Resident' | 'Volunteer';
  status: 'Safe' | 'Sheltered' | 'Needs Assistance' | 'Medical Attention';
  location: string;
  timestamp: string;
  note?: string;
}

export interface IncidentActionPlan {
  source: string;
  incidentTitle: string;
  leadTime: string;
  severity: string;
  executiveSummary: string;
  tacticalPriorities: {
    timeframe: string;
    action: string;
    detail: string;
  }[];
  evacuationRoutes: string[];
  broadcastScript: {
    sms: string;
    sirenPatter: string;
    spanish: string;
  };
  suggestedPersonnel: string[];
}
