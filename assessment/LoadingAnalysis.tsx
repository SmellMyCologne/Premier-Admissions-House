import { Shield } from 'lucide-react';

const loadingSteps = [
  'Evaluating academic positioning...',
  'Analyzing extracurricular profile...',
  'Calculating school alignment...',
  'Generating strategic recommendations...',
];

export default function LoadingAnalysis({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-full border border-gold-500/20 flex items-center justify-center animate-pulse">
          <Shield className="w-8 h-8 text-gold-500/50" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full border-t border-gold-500/50 animate-spin" />
      </div>

      <h3 className="font-serif text-2xl text-ivory-100 font-medium mb-2">
        Building your strategy
      </h3>
      <p className="font-sans text-xs text-ivory-300/40 tracking-wide mb-10">
        This typically takes 15-30 seconds
      </p>

      <div className="space-y-3 w-full max-w-xs">
        {loadingSteps.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i <= currentStep ? 'bg-gold-500' : 'bg-ivory-200/10'
              }`}
            />
            <span
              className={`font-sans text-xs transition-colors duration-500 ${
                i <= currentStep ? 'text-ivory-200' : 'text-ivory-300/20'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
