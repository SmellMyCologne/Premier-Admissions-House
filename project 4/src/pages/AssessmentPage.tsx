import { useState, useEffect, useCallback } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import ProfileForm from '../components/assessment/ProfileForm';
import AnalysisResults from '../components/assessment/AnalysisResults';
import LoadingAnalysis from '../components/assessment/LoadingAnalysis';
import { getProvider } from '../services/provider';
import type { StudentProfile, AnalysisResult } from '../types/assessment';

type Phase = 'form' | 'loading' | 'results' | 'restoring' | 'error';

const SESSION_KEY = 'pah_analysis_session';

interface SavedSession {
  profile: StudentProfile;
  result: AnalysisResult;
  analysisResultId: string;
  isUnlocked?: boolean;
}

function saveSession(data: SavedSession) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

function loadSession(): SavedSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSession;
  } catch {
    return null;
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // noop
  }
}

interface Props {
  onBack: () => void;
  paymentStatus?: 'success' | 'cancelled' | null;
  paymentAnalysisResultId?: string | null;
}

export default function AssessmentPage({ onBack, paymentStatus, paymentAnalysisResultId }: Props) {
  const [phase, setPhase] = useState<Phase>('form');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analysisResultId, setAnalysisResultId] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!paymentStatus) return;

    const saved = loadSession();

    if (saved) {
      setProfile(saved.profile);
      setResult(saved.result);
      setAnalysisResultId(saved.analysisResultId);

      if (paymentStatus === 'success') {
        setIsUnlocked(true);
        saveSession({ ...saved, isUnlocked: true });
      }

      setPhase('results');
      return;
    }

    if (!paymentAnalysisResultId || paymentAnalysisResultId.startsWith('local-')) return;

    setPhase('restoring');

    let cancelled = false;
    const arId = paymentAnalysisResultId;
    const provider = getProvider();

    async function restore() {
      const report = await provider.fetchReport(arId);
      if (cancelled || !report) return;

      setProfile(report.profile);
      setResult(report.result);
      setAnalysisResultId(arId);

      const unlocked = paymentStatus === 'success' || report.isUnlocked;
      setIsUnlocked(unlocked);

      saveSession({
        profile: report.profile,
        result: report.result,
        analysisResultId: arId,
        isUnlocked: unlocked,
      });

      setPhase('results');

      if (paymentStatus === 'success' && !report.isUnlocked) {
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          if (cancelled || attempts > 15) {
            clearInterval(poll);
            return;
          }
          const status = await provider.checkUnlockStatus(arId).catch(() => false);
          if (status) {
            setIsUnlocked(true);
            clearInterval(poll);
          }
        }, 2000);
      }
    }

    restore().catch(() => {
      if (!cancelled) setPhase('error');
    });

    return () => { cancelled = true; };
  }, [paymentStatus, paymentAnalysisResultId]);

  useEffect(() => {
    if (paymentStatus) return;
    if (phase !== 'results') return;

    const saved = loadSession();
    if (!saved || saved.isUnlocked) {
      if (saved?.isUnlocked) setIsUnlocked(true);
      return;
    }

    if (!saved.analysisResultId.startsWith('local-')) {
      const provider = getProvider();
      provider.checkUnlockStatus(saved.analysisResultId).then((unlocked) => {
        if (unlocked) {
          setIsUnlocked(true);
          saveSession({ ...saved, isUnlocked: true });
        }
      }).catch(() => {});
    }
  }, [paymentStatus, phase]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, [phase]);

  const handleSubmit = useCallback(async (studentProfile: StudentProfile) => {
    setProfile(studentProfile);
    setPhase('loading');
    setLoadingStep(0);
    setIsSubmitting(true);

    try {
      const provider = getProvider();
      const session = await provider.analyzeProfile(studentProfile);
      setResult(session.result);
      setAnalysisResultId(session.analysisResultId);

      saveSession({
        profile: studentProfile,
        result: session.result,
        analysisResultId: session.analysisResultId,
      });

      setPhase('results');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setPhase('error');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleReset = () => {
    setPhase('form');
    setProfile(null);
    setResult(null);
    setAnalysisResultId(null);
    setLoadingStep(0);
    setErrorMessage('');
    setIsUnlocked(false);
    clearSession();
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-ivory-200/5">
        <div className="max-w-7xl mx-auto section-padding py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-3 group"
          >
            <Shield className="w-5 h-5 text-gold-500 transition-colors duration-300 group-hover:text-gold-400" strokeWidth={1.5} />
            <span className="font-serif text-lg md:text-xl text-ivory-100 tracking-wide">
              Premier Admissions House
            </span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-ivory-300/50 hover:text-ivory-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto section-padding pt-28 pb-20">
        {phase === 'form' && (
          <>
            <div className="text-center mb-12">
              <span className="inline-block font-sans text-[11px] tracking-widest-plus uppercase text-gold-500/70 mb-4">
                Admissions Assessment
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-50 font-medium mb-4">
                Build your profile
              </h1>
              <p className="font-sans text-sm text-ivory-300/50 font-light max-w-md mx-auto">
                Provide your academic details and background. We will evaluate your positioning and
                deliver a strategic assessment.
              </p>
            </div>
            <ProfileForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </>
        )}

        {phase === 'loading' && <LoadingAnalysis currentStep={loadingStep} />}

        {phase === 'restoring' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mb-6" />
            <h3 className="font-serif text-2xl text-ivory-100 font-medium mb-2">
              Restoring your report
            </h3>
            <p className="font-sans text-sm text-ivory-300/50 font-light">
              Please wait while we retrieve your analysis...
            </p>
          </div>
        )}

        {phase === 'results' && result && profile && analysisResultId && (
          <AnalysisResults
            result={result}
            profile={profile}
            analysisResultId={analysisResultId}
            initialUnlocked={isUnlocked}
            onReset={handleReset}
          />
        )}

        {phase === 'error' && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="font-serif text-2xl text-ivory-100 font-medium mb-4">
              Analysis unavailable
            </h3>
            <p className="font-sans text-sm text-ivory-300/50 font-light mb-2 max-w-sm">
              {errorMessage}
            </p>
            <p className="font-sans text-xs text-ivory-300/30 mb-8">
              The analysis service may need to be configured. Please try again shortly.
            </p>
            <button type="button" onClick={handleReset} className="btn-primary">
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
