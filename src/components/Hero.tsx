import { ArrowRight, ChevronDown, Target, BarChart3, Lightbulb } from 'lucide-react';

const bullets = [
  { icon: BarChart3, text: 'Personalized admissions strength score' },
  { icon: Target, text: 'Reach, target, and safety positioning' },
  { icon: Lightbulb, text: 'Strategic recommendations tailored to your profile' },
];

interface Props {
  onNavigateAssessment: () => void;
}

export default function Hero({ onNavigateAssessment }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-800/40 via-navy-950 to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/[0.02] rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto section-padding pt-32 pb-24 text-center">
        <div className="mb-8">
          <span className="inline-block font-sans text-[11px] tracking-widest-plus uppercase text-gold-500 mb-8">
            Private Admissions Strategy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-ivory-50 leading-[1.1] mb-8">
            Private admissions strategy
            <br />
            <span className="text-ivory-300/90">for ambitious families</span>
          </h1>
          <p className="max-w-2xl mx-auto font-sans text-base md:text-lg text-ivory-300/70 font-light leading-relaxed">
            A structured, data-driven admissions platform designed to help high-achieving students
            assess their positioning, identify weaknesses, and build a stronger path to selective
            universities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            type="button"
            onClick={onNavigateAssessment}
            className="btn-primary flex items-center gap-3 group"
          >
            Get Your Admissions Strategy
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <a href="#how-it-works" className="btn-secondary">
            See How It Works
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {bullets.map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold-500/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gold-500/70" strokeWidth={1.5} />
              </div>
              <span className="font-sans text-xs text-ivory-300/60 tracking-wide leading-relaxed">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-ivory-300/30" strokeWidth={1.5} />
      </div>
    </section>
  );
}
