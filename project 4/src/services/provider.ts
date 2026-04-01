import type { StudentProfile, AnalysisResult } from '../types/assessment';

export interface AnalysisSession {
  analysisResultId: string;
  result: AnalysisResult;
}

export interface SavedReport {
  profile: StudentProfile;
  result: AnalysisResult;
  isUnlocked: boolean;
}

export interface AdmissionsProvider {
  analyzeProfile(profile: StudentProfile): Promise<AnalysisSession>;
  unlockReport(analysisResultId: string): Promise<void>;
  checkUnlockStatus(analysisResultId: string): Promise<boolean>;
  fetchReport(analysisResultId: string): Promise<SavedReport | null>;
}

let currentProvider: AdmissionsProvider | null = null;

export function setProvider(provider: AdmissionsProvider) {
  currentProvider = provider;
}

export function getProvider(): AdmissionsProvider {
  if (!currentProvider) {
    throw new Error('No admissions provider configured');
  }
  return currentProvider;
}
