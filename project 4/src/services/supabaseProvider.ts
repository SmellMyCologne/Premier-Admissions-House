import { supabase } from './supabaseClient';
import { analyzeProfile } from './analysisEngine';
import type { AdmissionsProvider, AnalysisSession, SavedReport } from './provider';
import type { StudentProfile } from '../types/assessment';

async function createAssessmentRow(profile: StudentProfile): Promise<string | null> {
  const nameParts = profile.name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const { data, error } = await supabase
    .from('assessments')
    .insert({
      first_name: firstName,
      last_name: lastName,
      email: profile.email,
      gpa: profile.gpa,
      test_scores: profile.satScore,
      grade_level: profile.gradeLevel,
      target_schools: profile.targetSchools,
      extracurriculars: profile.activities,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[SupabaseProvider] Failed to create assessment:', error.message);
    return null;
  }

  return data?.id ?? null;
}

async function createAnalysisResultRow(
  assessmentId: string,
  result: ReturnType<typeof analyzeProfile>,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('analysis_results')
    .insert({
      assessment_id: assessmentId,
      strength_score: result.strengthScore,
      positioning: result.positioning,
      weaknesses: result.weaknesses,
      improvements: result.improvements,
      essay_angle: result.essayAngle,
      school_tiers: result.schoolTiers,
      profile_summary: result.profileSummary,
      is_unlocked: false,
      executive_read: result.executiveRead,
      core_strengths: result.coreStrengths,
      critical_liabilities: result.criticalLiabilities,
      ranked_improvements: result.rankedImprovements,
      essay_angles: result.essayAngles,
      action_plan: result.actionPlan,
      final_advisory: result.finalAdvisory,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[SupabaseProvider] Failed to create analysis result:', error.message);
    return null;
  }

  return data?.id ?? null;
}

export class SupabaseProvider implements AdmissionsProvider {
  async analyzeProfile(profile: StudentProfile): Promise<AnalysisSession> {
    const result = analyzeProfile(profile);

    const assessmentId = await createAssessmentRow(profile);
    let analysisResultId: string | null = null;

    if (assessmentId) {
      analysisResultId = await createAnalysisResultRow(assessmentId, result);
    }

    return {
      analysisResultId: analysisResultId ?? `local-${Date.now()}`,
      result,
    };
  }

  async unlockReport(analysisResultId: string): Promise<void> {
    if (analysisResultId.startsWith('local-')) return;

    const { error } = await supabase
      .from('analysis_results')
      .update({ is_unlocked: true })
      .eq('id', analysisResultId);

    if (error) {
      console.error('[SupabaseProvider] Failed to unlock report:', error.message);
    }
  }

  async checkUnlockStatus(analysisResultId: string): Promise<boolean> {
    if (analysisResultId.startsWith('local-')) return false;

    const { data, error } = await supabase
      .from('analysis_results')
      .select('is_unlocked')
      .eq('id', analysisResultId)
      .maybeSingle();

    if (error) {
      console.error('[SupabaseProvider] Failed to check unlock status:', error.message);
      return false;
    }

    return data?.is_unlocked === true;
  }

  async fetchReport(analysisResultId: string): Promise<SavedReport | null> {
    if (analysisResultId.startsWith('local-')) return null;

    const { data, error } = await supabase
      .from('analysis_results')
      .select(`
        strength_score,
        positioning,
        weaknesses,
        improvements,
        essay_angle,
        school_tiers,
        profile_summary,
        is_unlocked,
        executive_read,
        core_strengths,
        critical_liabilities,
        ranked_improvements,
        essay_angles,
        action_plan,
        final_advisory,
        assessments (
          first_name,
          last_name,
          email,
          gpa,
          test_scores,
          grade_level,
          target_schools,
          extracurriculars
        )
      `)
      .eq('id', analysisResultId)
      .maybeSingle();

    if (error || !data) {
      console.error('[SupabaseProvider] Failed to fetch report:', error?.message);
      return null;
    }

    const raw = data.assessments;
    const a = (Array.isArray(raw) ? raw[0] : raw) as Record<string, string> | null;
    if (!a) return null;

    const profile: StudentProfile = {
      name: [a.first_name, a.last_name].filter(Boolean).join(' '),
      email: a.email || '',
      gpa: a.gpa || '',
      satScore: a.test_scores || '',
      gradeLevel: a.grade_level || '',
      targetSchools: a.target_schools || '',
      activities: a.extracurriculars || '',
    };

    return {
      profile,
      result: {
        strengthScore: data.strength_score,
        positioning: data.positioning,
        weaknesses: data.weaknesses as string[],
        improvements: data.improvements as string[],
        essayAngle: data.essay_angle,
        schoolTiers: data.school_tiers as { name: string; category: 'reach' | 'target' | 'safety'; note: string; rationale: string }[],
        profileSummary: data.profile_summary,
        executiveRead: data.executive_read || '',
        coreStrengths: (data.core_strengths as string[]) || [],
        criticalLiabilities: (data.critical_liabilities as string[]) || [],
        rankedImprovements: (data.ranked_improvements as string[]) || [],
        essayAngles: (data.essay_angles as { title: string; description: string }[]) || [],
        actionPlan: (data.action_plan as { timeframe: string; items: string[] }[]) || [],
        finalAdvisory: data.final_advisory || '',
      },
      isUnlocked: data.is_unlocked,
    };
  }
}
