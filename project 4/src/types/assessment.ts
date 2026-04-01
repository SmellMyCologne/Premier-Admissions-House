export interface StudentProfile {
  name: string;
  email: string;
  gpa: string;
  satScore: string;
  gradeLevel: string;
  targetSchools: string;
  activities: string;
}

export interface SchoolTier {
  name: string;
  category: 'reach' | 'target' | 'safety';
  note: string;
  rationale: string;
}

export interface EssayAngle {
  title: string;
  description: string;
}

export interface ActionItem {
  timeframe: string;
  items: string[];
}

export interface AnalysisResult {
  strengthScore: number;
  positioning: string;
  weaknesses: string[];
  improvements: string[];
  essayAngle: string;
  schoolTiers: SchoolTier[];
  profileSummary: string;
  executiveRead: string;
  coreStrengths: string[];
  criticalLiabilities: string[];
  rankedImprovements: string[];
  essayAngles: EssayAngle[];
  actionPlan: ActionItem[];
  finalAdvisory: string;
}
