import { Check } from 'lucide-react';

const benefits = [
  'No vague advice',
  'No scattered planning',
  'No guessing what matters most',
];

export default function WhyFamilies() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/30 to-navy-950" />
      <div className="relative max-w-3xl mx-auto section-padding text-center">
        <span className="inline-block font-sans text-[11px] tracking-widest-plus uppercase text-gold-500/70 mb-4">
          Why Families Use It
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-50 font-medium mb-8">
          A more disciplined approach to admissions
        </h2>
        <p className="font-sans text-base md:text-lg text-ivory-300/60 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
          Private admissions coaching is often expensive, inconsistent, and difficult to scale.
          Premier Admissions House offers a more structured experience: clear inputs, clear
          analysis, and clear next steps.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          {benefits.map((text) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border border-gold-500/25 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-gold-500/80" strokeWidth={2} />
              </div>
              <span className="font-sans text-sm text-ivory-200/70 font-light tracking-wide">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
