const steps = [
  {
    number: '01',
    title: 'Complete your profile',
    description:
      'Enter your GPA, test scores, grade level, target schools, and extracurricular background.',
  },
  {
    number: '02',
    title: 'Receive your analysis',
    description:
      'Our system evaluates your positioning and identifies the most important strengths and weaknesses in your profile.',
  },
  {
    number: '03',
    title: 'Unlock your strategy',
    description:
      'View your admissions score, school positioning, and tailored recommendations for improvement.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto section-padding">
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block font-sans text-[11px] tracking-widest-plus uppercase text-gold-500/70 mb-4">
            Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-50 font-medium">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-ivory-200/10 to-transparent" />

          {steps.map(({ number, title, description }) => (
            <div key={number} className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold-500/20 bg-navy-950 mb-8 relative z-10">
                <span className="font-sans text-sm text-gold-500 font-medium tracking-wide">
                  {number}
                </span>
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-ivory-100 mb-4 font-medium">
                {title}
              </h3>
              <p className="font-sans text-sm text-ivory-300/50 font-light leading-relaxed max-w-xs mx-auto">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
