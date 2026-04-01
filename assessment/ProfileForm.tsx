import { useState } from 'react';
import { ArrowRight, ArrowLeft, Send } from 'lucide-react';
import type { StudentProfile } from '../../types/assessment';

const GRADE_OPTIONS = [
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'Gap Year / Transfer',
];

interface Props {
  onSubmit: (profile: StudentProfile) => void;
  isSubmitting: boolean;
}

export default function ProfileForm({ onSubmit, isSubmitting }: Props) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StudentProfile>({
    name: '',
    email: '',
    gpa: '',
    satScore: '',
    gradeLevel: '',
    targetSchools: '',
    activities: '',
  });

  const update = (field: keyof StudentProfile, value: string) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const canAdvance = () => {
    if (step === 0)
      return (
        profile.name.trim() !== '' &&
        profile.email.trim() !== '' &&
        profile.gpa.trim() !== '' &&
        profile.gradeLevel !== ''
      );
    if (step === 1) return profile.targetSchools.trim() !== '';
    if (step === 2) return profile.activities.trim() !== '';
    return false;
  };

  const handleSubmit = () => {
    if (canAdvance()) onSubmit(profile);
  };

  const steps = [
    {
      label: 'Academic Profile',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-ivory-300/50 mb-3">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Your name"
                className="w-full bg-navy-800/50 border border-ivory-200/10 rounded px-5 py-4 font-sans text-sm text-ivory-100 placeholder:text-ivory-300/20 focus:outline-none focus:border-gold-500/40 transition-colors"
              />
            </div>
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-ivory-300/50 mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-navy-800/50 border border-ivory-200/10 rounded px-5 py-4 font-sans text-sm text-ivory-100 placeholder:text-ivory-300/20 focus:outline-none focus:border-gold-500/40 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-ivory-300/50 mb-3">
              Unweighted GPA
            </label>
            <input
              type="text"
              value={profile.gpa}
              onChange={(e) => update('gpa', e.target.value)}
              placeholder="e.g., 3.85"
              className="w-full bg-navy-800/50 border border-ivory-200/10 rounded px-5 py-4 font-sans text-sm text-ivory-100 placeholder:text-ivory-300/20 focus:outline-none focus:border-gold-500/40 transition-colors"
            />
          </div>
          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-ivory-300/50 mb-3">
              SAT / ACT Score (optional)
            </label>
            <input
              type="text"
              value={profile.satScore}
              onChange={(e) => update('satScore', e.target.value)}
              placeholder="e.g., 1480 SAT or 33 ACT"
              className="w-full bg-navy-800/50 border border-ivory-200/10 rounded px-5 py-4 font-sans text-sm text-ivory-100 placeholder:text-ivory-300/20 focus:outline-none focus:border-gold-500/40 transition-colors"
            />
          </div>
          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-ivory-300/50 mb-3">
              Current Grade Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GRADE_OPTIONS.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => update('gradeLevel', grade)}
                  className={`px-4 py-3 rounded border text-xs font-sans tracking-wide transition-all duration-200 ${
                    profile.gradeLevel === grade
                      ? 'border-gold-500/50 bg-gold-500/10 text-gold-400'
                      : 'border-ivory-200/10 text-ivory-300/50 hover:border-ivory-200/20'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Target Schools',
      content: (
        <div>
          <label className="block font-sans text-xs tracking-widest uppercase text-ivory-300/50 mb-3">
            Target Schools
          </label>
          <p className="font-sans text-xs text-ivory-300/30 mb-4">
            List the schools you are considering, separated by commas.
          </p>
          <textarea
            value={profile.targetSchools}
            onChange={(e) => update('targetSchools', e.target.value)}
            placeholder="e.g., Stanford, MIT, University of Michigan, NYU, Georgia Tech"
            rows={5}
            className="w-full bg-navy-800/50 border border-ivory-200/10 rounded px-5 py-4 font-sans text-sm text-ivory-100 placeholder:text-ivory-300/20 focus:outline-none focus:border-gold-500/40 transition-colors resize-none"
          />
        </div>
      ),
    },
    {
      label: 'Activities & Background',
      content: (
        <div>
          <label className="block font-sans text-xs tracking-widest uppercase text-ivory-300/50 mb-3">
            Extracurricular Activities & Leadership
          </label>
          <p className="font-sans text-xs text-ivory-300/30 mb-4">
            Describe your most significant activities, leadership roles, awards, and any meaningful experiences.
          </p>
          <textarea
            value={profile.activities}
            onChange={(e) => update('activities', e.target.value)}
            placeholder="e.g., Varsity debate team captain (3 years), Research intern at university biology lab, Founded school coding club (50+ members), National Merit Semifinalist, 200+ volunteer hours at local hospital"
            rows={7}
            className="w-full bg-navy-800/50 border border-ivory-200/10 rounded px-5 py-4 font-sans text-sm text-ivory-100 placeholder:text-ivory-300/20 focus:outline-none focus:border-gold-500/40 transition-colors resize-none"
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-medium transition-all duration-300 ${
                i <= step
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'bg-navy-800/50 text-ivory-300/30 border border-ivory-200/10'
              }`}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-px transition-colors duration-300 ${
                  i < step ? 'bg-gold-500/30' : 'bg-ivory-200/10'
                }`}
              />
            )}
          </div>
        ))}
        <span className="ml-4 font-sans text-xs text-ivory-300/40 tracking-wide hidden sm:inline">
          {steps[step].label}
        </span>
      </div>

      <div className="min-h-[320px]">{steps[step].content}</div>

      <div className="flex items-center justify-between mt-10 pt-8 border-t border-ivory-200/5">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-ivory-300/50 hover:text-ivory-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => canAdvance() && setStep(step + 1)}
            disabled={!canAdvance()}
            className="btn-primary flex items-center gap-3 group disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canAdvance() || isSubmitting}
            className="btn-primary flex items-center gap-3 group disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Analyzing...' : 'Get Your Strategy'}
            <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
