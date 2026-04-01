import { ArrowUpRight } from 'lucide-react';

const audiences = [
  'Families pursuing selective admissions with intention',
  'Students aiming for top-tier or highly competitive schools',
  'Parents who want clarity before committing to expensive consulting',
];

export default function DesignedFor() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/20 to-navy-950" />
      <div className="relative max-w-3xl mx-auto section-padding">
        <div className="text-center mb-14">
          <span className="inline-block font-sans text-[11px] tracking-widest-plus uppercase text-gold-500/70 mb-4">
            Who This Is For
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-50 font-medium">
            Designed for
          </h2>
        </div>

        <div className="space-y-0 border-t border-ivory-200/[0.06]">
          {audiences.map((text) => (
            <div
              key={text}
              className="flex items-center gap-4 py-6 border-b border-ivory-200/[0.06] group transition-colors duration-300 hover:bg-ivory-200/[0.01] px-4 -mx-4"
            >
              <ArrowUpRight
                className="w-4 h-4 text-gold-500/40 flex-shrink-0 transition-all duration-300 group-hover:text-gold-500/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
              <p className="font-sans text-sm md:text-base text-ivory-200/60 font-light tracking-wide transition-colors duration-300 group-hover:text-ivory-200/90">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
