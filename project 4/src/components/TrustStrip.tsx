const statements = [
  'Built for selective admissions planning',
  'Structured for families who want clarity',
  'Designed to feel like private advisory, not generic edtech',
];

export default function TrustStrip() {
  return (
    <section className="relative border-y border-ivory-200/5">
      <div className="max-w-6xl mx-auto section-padding py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-ivory-200/10">
          {statements.map((text) => (
            <div key={text} className="flex items-center justify-center px-6 md:px-8">
              <p className="font-sans text-xs md:text-sm text-ivory-300/50 tracking-wide text-center font-light">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
