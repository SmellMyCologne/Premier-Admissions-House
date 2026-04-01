import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-ivory-200/5">
      <div className="max-w-6xl mx-auto section-padding py-14 md:py-16">
        <div className="flex flex-col items-center text-center gap-6">
          <a href="#" className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-gold-500/60" strokeWidth={1.5} />
            <span className="font-serif text-lg text-ivory-100 tracking-wide">
              Premier Admissions House
            </span>
          </a>
          <p className="font-sans text-xs text-ivory-300/40 font-light tracking-wide">
            Private admissions strategy for ambitious families
          </p>
          <div className="w-12 h-px bg-ivory-200/10 my-2" />
          <p className="font-sans text-[11px] text-ivory-300/25 font-light leading-relaxed max-w-md">
            This platform provides strategic guidance and planning support. It does not guarantee
            admission outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
}
