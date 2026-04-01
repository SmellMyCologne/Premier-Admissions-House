import { Lock, ArrowRight, Shield, CheckCircle } from 'lucide-react';

const VALUE_BULLETS = [
  'Executive admissions read & critical liabilities',
  'School-specific rationale for every target',
  'Ranked improvement priorities & essay angles',
  '90-day action plan with concrete milestones',
  'Senior advisor closing summary',
];

interface Props {
  onUnlock: () => void;
}

export default function LockedOverlay({ onUnlock }: Props) {
  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center pb-6 sm:items-center sm:pb-0">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950/95 backdrop-blur-md rounded-xl" />

      <div className="relative z-30 w-full max-w-md mx-4 sm:mx-auto">
        <div className="rounded-2xl border border-gold-500/15 bg-navy-900/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-navy-950/60">
          <div className="relative px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-gold-500/[0.06] rounded-full blur-2xl" />

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold-500/25 bg-gold-500/[0.06] mb-5">
              <Lock className="w-5 h-5 text-gold-500/80" strokeWidth={1.5} />
            </div>

            <h3 className="font-serif text-xl sm:text-2xl text-ivory-50 font-medium mb-2.5 leading-tight">
              Unlock Your Full<br />Admissions Strategy
            </h3>

            <p className="font-sans text-xs text-ivory-300/45 font-light leading-relaxed max-w-xs mx-auto mb-6">
              Your complete strategic report is ready -- including personalized improvement
              priorities, essay direction, and private advisory-grade recommendations
              tailored to your profile.
            </p>

            <div className="flex items-baseline justify-center gap-1.5 mb-5">
              <span className="font-serif text-4xl text-ivory-50 font-semibold">$29</span>
              <span className="font-sans text-[11px] text-ivory-300/30 tracking-wide">one-time</span>
            </div>

            <button
              type="button"
              onClick={onUnlock}
              className="w-full max-w-xs mx-auto btn-primary inline-flex items-center justify-center gap-3 group"
            >
              Unlock Strategy
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="px-6 pb-7 sm:px-8 sm:pb-8">
            <div className="border-t border-ivory-200/[0.05] pt-5 space-y-3">
              {VALUE_BULLETS.map((bullet) => (
                <div key={bullet} className="flex items-center gap-3">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-500/50 flex-shrink-0" strokeWidth={1.5} />
                  <span className="font-sans text-xs text-ivory-300/40 font-light">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy-950/40 px-6 py-3.5 sm:px-8 flex items-center justify-center gap-2 border-t border-ivory-200/[0.03]">
            <Shield className="w-3 h-3 text-ivory-300/15" strokeWidth={1.5} />
            <span className="font-sans text-[10px] text-ivory-300/20 tracking-wide">
              Strategic guidance -- not a guarantee of admission
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
