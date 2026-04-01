import { Shield, Calendar, User } from 'lucide-react';
import type { StudentProfile } from '../../types/assessment';

function ScoreRing({ score }: { score: number }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-gold-400' : 'text-amber-500';
  const glowColor =
    score >= 75 ? 'shadow-emerald-400/10' : score >= 50 ? 'shadow-gold-400/10' : 'shadow-amber-500/10';

  return (
    <div className={`relative w-44 h-44 drop-shadow-lg ${glowColor}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          strokeWidth="3"
          className="stroke-ivory-200/[0.04]"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${color} transition-all duration-[2000ms] ease-out`}
          style={{ stroke: 'currentColor' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-serif text-5xl font-semibold ${color}`}>{score}</span>
        <span className="font-sans text-[9px] text-ivory-300/30 tracking-[0.25em] uppercase mt-1.5">
          out of 100
        </span>
      </div>
    </div>
  );
}

function MetaTag({ icon: Icon, label }: { icon: typeof Shield; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3 h-3 text-ivory-300/25" strokeWidth={1.5} />
      <span className="font-sans text-[11px] text-ivory-300/35 font-light">{label}</span>
    </div>
  );
}

interface Props {
  score: number;
  profileSummary: string;
  profile: StudentProfile;
}

export default function ReportHeader({ score, profileSummary, profile }: Props) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-xl border border-ivory-200/5 bg-gradient-to-br from-navy-800/50 via-navy-800/30 to-navy-900/50 mb-8">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold-500/[0.015] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/[0.01] rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative px-6 py-5 sm:px-8 sm:py-6 border-b border-ivory-200/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <Shield className="w-4 h-4 text-gold-500/60" strokeWidth={1.5} />
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-500/60 font-medium">
              Premier Admissions House
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-medium">
            Private Strategy Report
          </h2>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-5">
          <MetaTag icon={Calendar} label={today} />
          <MetaTag icon={User} label={`${profile.gpa} GPA / ${profile.gradeLevel}`} />
        </div>
      </div>

      <div className="relative px-6 py-8 sm:px-8 sm:py-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-shrink-0">
          <ScoreRing score={score} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block font-sans text-[10px] tracking-[0.25em] uppercase text-gold-500/50 mb-3">
            Admissions Strength Score
          </span>
          <p className="font-sans text-sm text-ivory-300/55 font-light leading-[1.8] max-w-xl">
            {profileSummary}
          </p>
          <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-2">
            {score >= 75 && (
              <span className="inline-block px-3 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/5 text-[10px] font-sans tracking-widest uppercase text-emerald-400/80">
                Strong Candidate
              </span>
            )}
            {score >= 50 && score < 75 && (
              <span className="inline-block px-3 py-1 rounded-full border border-gold-400/20 bg-gold-400/5 text-[10px] font-sans tracking-widest uppercase text-gold-400/80">
                Developing Profile
              </span>
            )}
            {score < 50 && (
              <span className="inline-block px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-[10px] font-sans tracking-widest uppercase text-amber-500/80">
                Needs Strategic Focus
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
