import type { AdmissionsProvider, AnalysisSession, SavedReport } from './provider';
import type { StudentProfile } from '../types/assessment';
import { analyzeProfile } from './analysisEngine';

const SIMULATED_DELAY_MS = 3000;

export class LocalProvider implements AdmissionsProvider {
  async analyzeProfile(profile: StudentProfile): Promise<AnalysisSession> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    const result = analyzeProfile(profile);
    return { analysisResultId: `local-${Date.now()}`, result };
  }

  async unlockReport(): Promise<void> {
  }

  async checkUnlockStatus(): Promise<boolean> {
    return false;
  }

  async fetchReport(): Promise<SavedReport | null> {
    return null;
  }
}
