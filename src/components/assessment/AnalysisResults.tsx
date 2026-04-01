import { useState } from 'react';
import {
  Target,
  AlertTriangle,
  TrendingUp,
  PenTool,
  ArrowLeft,
  GraduationCap,
  ChevronRight,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import type { AnalysisResult, StudentProfile, SchoolTier } from '../../types/assessment';
import ReportHeader from './ReportHeader';
import LockedOverlay from './LockedOverlay';
import CheckoutModal from './CheckoutModal';

interface Props {
  result: AnalysisResult;
  profile: StudentProfile;
  analysisResultId: string;
  initialUnlocked?: boolean;
  onReset: () => void;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px flex-1 bg-gradient-to-r from-ivory-200/10 to-transparent" />
      <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-ivory-300/30 flex-shrink-0">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-ivory-200/10 to-transparent" />
    </div>
  );
}

function ReportCard({
  icon: Icon,
  title,
  sectionNumber,
  children,
  className = '',
}: {
  icon: typeof Target;
  title: string;
  sectionNumber: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-navy-800/20 border border-ivory-200/[0.04] rounded-xl p-6 md:p-8 hover:border-ivory-200/[0.08] transition-all duration-500 ${className}`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-gold-500/15 bg-gold-500/[0.04] flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-gold-500/70" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-serif text-lg text-ivory-100 font-medium leading-tight">
              {title}
            </h3>
          </div>
        </div>
        <span className="font-sans text-[10px] text-ivory-300/15 tracking-widest uppercase mt-1">
          {sectionNumber}
        </span>
      </div>
      {children}
    </div>
  );
}

const TIER_STYLES: Record<SchoolTier['category'], { dot: string; border: string; label: string }> = {
  reach: {
    dot: 'bg-amber-500',
    border: 'border-amber-500/15',
    label: 'Reach',
  },
  target: {
    dot: 'bg-gold-400',
    border: 'border-gold-400/15',
    label: 'Target',
  },
  safety: {
    dot: 'bg-emerald-400',
    border: 'border-emerald-400/15',
    label: 'Safety',
  },
};

function SchoolTierCard({ tier, expanded }: { tier: SchoolTier; expanded: boolean }) {
  const style = TIER_STYLES[tier.category];
  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-lg border ${style.border} bg-navy-800/20 hover:bg-navy-800/30 transition-colors duration-300`}
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1.5 pt-0.5 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${style.dot}`} />
          <span className="font-sans text-[9px] text-ivory-300/30 tracking-widest uppercase">
            {style.label}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-sm text-ivory-100 font-medium mb-1 truncate">{tier.name}</p>
          <p className="font-sans text-xs text-ivory-300/40 font-light leading-relaxed">
            {tier.note}
          </p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-ivory-300/10 flex-shrink-0 mt-0.5" />
      </div>
      {expanded && tier.rationale && (
        <div className="ml-8 pl-4 border-l border-ivory-200/[0.06]">
          <p className="font-sans text-xs text-ivory-300/50 font-light leading-[1.8]">
            {tier.rationale}
          </p>
        </div>
      )}
    </div>
  );
}

function NumberedList({
  items,
  dotColor = 'bg-red-500/10',
  textColor = 'text-red-400',
}: {
  items: string[];
  dotColor?: string;
  textColor?: string;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className={`w-5 h-5 rounded-full ${dotColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            <span className={`text-[10px] ${textColor} font-sans font-medium`}>{i + 1}</span>
          </span>
          <span className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8]">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

function PreviewWeaknesses({ weaknesses }: { weaknesses: string[] }) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[10px] text-red-400 font-sans font-medium">1</span>
          </span>
          <span className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8]">
            {weaknesses[0]}
          </span>
        </div>
        {weaknesses.slice(1).map((w, i) => (
          <div key={i} className="flex items-start gap-3 opacity-40 select-none">
            <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] text-red-400 font-sans font-medium">{i + 2}</span>
            </span>
            <span className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] line-clamp-1 blur-[3px]">
              {w}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-ivory-200/[0.04]">
        <p className="font-sans text-[11px] text-ivory-300/25 italic">
          {weaknesses.length - 1} additional weakness
          {weaknesses.length - 1 !== 1 ? 'es' : ''} identified. Unlock the full
          report to view all findings.
        </p>
      </div>
    </>
  );
}

function LockedPreviewSections({ result, onUnlock }: { result: AnalysisResult; onUnlock: () => void }) {
  return (
    <div className="relative">
      <div className="space-y-5 pointer-events-none select-none" aria-hidden="true">
        <ReportCard icon={FileText} title="Executive Admissions Read" sectionNumber="Section III">
          <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] line-clamp-3 blur-[4px]">
            {result.executiveRead}
          </p>
        </ReportCard>

        <ReportCard icon={ShieldCheck} title="Core Strengths" sectionNumber="Section IV">
          <div className="space-y-3 blur-[4px]">
            {result.coreStrengths.slice(0, 2).map((s, i) => (
              <p key={i} className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] line-clamp-2">{s}</p>
            ))}
          </div>
        </ReportCard>

        <ReportCard icon={ShieldAlert} title="Critical Liabilities" sectionNumber="Section V">
          <div className="space-y-3 blur-[4px]">
            {result.criticalLiabilities.slice(0, 2).map((l, i) => (
              <p key={i} className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] line-clamp-2">{l}</p>
            ))}
          </div>
        </ReportCard>

        <ReportCard icon={TrendingUp} title="Highest-Leverage Improvements" sectionNumber="Section VI">
          <div className="space-y-3 blur-[4px]">
            {result.rankedImprovements.slice(0, 2).map((imp, i) => (
              <p key={i} className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] line-clamp-2">{imp}</p>
            ))}
          </div>
        </ReportCard>

        <ReportCard icon={PenTool} title="Essay & Narrative Strategy" sectionNumber="Section VII">
          <div className="space-y-3 blur-[4px]">
            <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] line-clamp-2">
              {result.essayAngles[0]?.description || result.essayAngle}
            </p>
          </div>
        </ReportCard>

        <ReportCard icon={Calendar} title="90-Day Action Plan" sectionNumber="Section VIII">
          <div className="space-y-3 blur-[4px]">
            <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] line-clamp-2">
              {result.actionPlan[0]?.items[0] || ''}
            </p>
          </div>
        </ReportCard>
      </div>

      <LockedOverlay onUnlock={onUnlock} />
    </div>
  );
}

function UnlockedSections({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-5 mt-5">
      {result.executiveRead && (
        <ReportCard icon={FileText} title="Executive Admissions Read" sectionNumber="Section III">
          <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] whitespace-pre-line">
            {result.executiveRead}
          </p>
        </ReportCard>
      )}

      {result.coreStrengths.length > 0 && (
        <ReportCard icon={ShieldCheck} title="Core Strengths" sectionNumber="Section IV">
          <NumberedList
            items={result.coreStrengths}
            dotColor="bg-emerald-500/10"
            textColor="text-emerald-400"
          />
        </ReportCard>
      )}

      {result.criticalLiabilities.length > 0 && (
        <ReportCard icon={ShieldAlert} title="Critical Liabilities" sectionNumber="Section V">
          <NumberedList
            items={result.criticalLiabilities}
            dotColor="bg-red-500/10"
            textColor="text-red-400"
          />
        </ReportCard>
      )}

      {result.rankedImprovements.length > 0 && (
        <ReportCard icon={TrendingUp} title="Highest-Leverage Improvements" sectionNumber="Section VI">
          <div className="space-y-6">
            {result.rankedImprovements.map((imp, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                  <span className="w-7 h-7 rounded-lg border border-gold-500/15 bg-gold-500/[0.04] flex items-center justify-center">
                    <span className="text-[11px] text-gold-500/70 font-sans font-semibold">
                      {i + 1}
                    </span>
                  </span>
                </div>
                <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8]">
                  {imp}
                </p>
              </div>
            ))}
          </div>
        </ReportCard>
      )}

      {result.essayAngles.length > 0 && (
        <ReportCard icon={PenTool} title="Essay & Narrative Strategy" sectionNumber="Section VII">
          <div className="space-y-6">
            {result.essayAngles.map((angle, i) => (
              <div key={i} className={i > 0 ? 'pt-5 border-t border-ivory-200/[0.04]' : ''}>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold-500/50 font-medium">
                    Angle {i + 1}
                  </span>
                  <div className="h-px flex-1 bg-ivory-200/[0.04]" />
                </div>
                <h4 className="font-serif text-base text-ivory-100 font-medium mb-2.5">
                  "{angle.title}"
                </h4>
                <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8]">
                  {angle.description}
                </p>
              </div>
            ))}
          </div>
        </ReportCard>
      )}

      {result.actionPlan.length > 0 && (
        <ReportCard icon={Calendar} title="90-Day Action Plan" sectionNumber="Section VIII">
          <div className="space-y-8">
            {result.actionPlan.map((phase, pi) => (
              <div key={pi} className={pi > 0 ? 'pt-6 border-t border-ivory-200/[0.04]' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full border border-gold-500/15 bg-gold-500/[0.04] font-sans text-[10px] tracking-[0.2em] uppercase text-gold-500/60 font-medium">
                    {phase.timeframe}
                  </span>
                </div>
                <div className="space-y-3 ml-1">
                  {phase.items.map((item, ii) => (
                    <div key={ii} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-500/30 flex-shrink-0 mt-2" />
                      <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ReportCard>
      )}

      {result.finalAdvisory && (
        <ReportCard icon={MessageSquare} title="Final Advisory Summary" sectionNumber="Section IX">
          <div className="relative">
            <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-500/20 via-gold-500/10 to-transparent rounded-full" />
            <div className="pl-4">
              <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] whitespace-pre-line">
                {result.finalAdvisory}
              </p>
            </div>
          </div>
        </ReportCard>
      )}
    </div>
  );
}

export default function AnalysisResults({ result, profile, analysisResultId, initialUnlocked = false, onReset }: Props) {
  const unlocked = initialUnlocked;
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div>
      <ReportHeader
        score={result.strengthScore}
        profileSummary={result.profileSummary}
        profile={profile}
      />

      <SectionLabel label={unlocked ? 'Strategy Report' : 'Complimentary Preview'} />

      <ReportCard icon={Target} title="Positioning Summary" sectionNumber="Section I">
        <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] whitespace-pre-line">
          {result.positioning}
        </p>
      </ReportCard>

      {result.schoolTiers.length > 0 && (
        <div className="mt-5">
          <ReportCard icon={GraduationCap} title="School List Positioning" sectionNumber="Section II">
            <div className="grid grid-cols-1 gap-3">
              {result.schoolTiers.map((tier) => (
                <SchoolTierCard key={tier.name} tier={tier} expanded={unlocked} />
              ))}
            </div>
          </ReportCard>
        </div>
      )}

      <div className="mt-5">
        <ReportCard icon={AlertTriangle} title="Key Weaknesses" sectionNumber={unlocked ? 'Preview' : 'Section III'}>
          {unlocked ? (
            <NumberedList items={result.weaknesses} />
          ) : (
            <PreviewWeaknesses weaknesses={result.weaknesses} />
          )}
        </ReportCard>
      </div>

      {!unlocked && <SectionLabel label="Full Strategy Report" />}

      {unlocked ? (
        <UnlockedSections result={result} />
      ) : (
        <LockedPreviewSections result={result} onUnlock={() => setShowCheckout(true)} />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 mt-10 border-t border-ivory-200/[0.04]">
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Start New Assessment
        </button>
      </div>

      <div className="text-center mt-8 mb-4">
        <p className="font-sans text-[10px] text-ivory-300/15 tracking-wide leading-relaxed max-w-md mx-auto">
          This report is generated by Premier Admissions House for strategic planning purposes only.
          It does not constitute a guarantee of admission to any institution. All analysis reflects
          generalized positioning guidance and should be supplemented with individualized counseling.
        </p>
      </div>

      {showCheckout && (
        <CheckoutModal
          analysisResultId={analysisResultId}
          customerEmail={profile.email}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
