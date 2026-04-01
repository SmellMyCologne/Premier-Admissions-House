import { BarChart3, Target, TrendingUp } from 'lucide-react';

const cards = [
  {
    icon: BarChart3,
    title: 'Admissions Strength Score',
    description:
      'A clear assessment of how your current academic and extracurricular profile compares to the expectations of selective schools.',
  },
  {
    icon: Target,
    title: 'School Positioning',
    description:
      'A practical breakdown of reach, target, and safety alignment based on the information you provide.',
  },
  {
    icon: TrendingUp,
    title: 'Strategic Improvement Plan',
    description:
      'Specific, high-impact next steps to strengthen your candidacy, sharpen your story, and improve your admissions profile.',
  },
];

export default function WhatYouReceive() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto section-padding">
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block font-sans text-[11px] tracking-widest-plus uppercase text-gold-500/70 mb-4">
            What You Receive
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-50 font-medium">
            What Premier Admissions House delivers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative bg-navy-800/30 border border-ivory-200/[0.06] p-8 md:p-10
                         transition-all duration-500
                         hover:border-gold-500/15 hover:bg-navy-800/50"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="w-12 h-12 rounded-full border border-gold-500/15 flex items-center justify-center mb-6 transition-colors duration-500 group-hover:border-gold-500/30">
                <Icon className="w-5 h-5 text-gold-500/60 transition-colors duration-500 group-hover:text-gold-500" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-ivory-100 mb-4 font-medium">
                {title}
              </h3>
              <p className="font-sans text-sm text-ivory-300/50 font-light leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
