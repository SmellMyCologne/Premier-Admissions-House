import { ArrowRight } from 'lucide-react';

interface Props {
  onNavigateAssessment: () => void;
}

export default function CtaSection({ onNavigateAssessment }: Props) {
  return (
    <section id="cta" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-800/30 to-navy-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/[0.015] rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto section-padding text-center">
        <div className="mb-12">
          <span className="inline-block font-sans text-[11px] tracking-widest-plus uppercase text-gold-500/70 mb-4">
            Get Started
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-50 font-medium mb-6">
            Start with clarity
          </h2>
          <p className="font-sans text-base md:text-lg text-ivory-300/60 font-light leading-relaxed">
            Get a structured assessment of your current admissions profile and see where strategic
            improvement matters most.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateAssessment}
          className="btn-primary inline-flex items-center gap-3 group"
        >
          Get Your Admissions Strategy
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
