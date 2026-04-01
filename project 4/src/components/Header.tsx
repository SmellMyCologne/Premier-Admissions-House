import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

interface Props {
  onNavigateAssessment: () => void;
}

export default function Header({ onNavigateAssessment }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-md border-b border-ivory-200/5 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto section-padding flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <Shield className="w-5 h-5 text-gold-500 transition-colors duration-300 group-hover:text-gold-400" strokeWidth={1.5} />
          <span className="font-serif text-lg md:text-xl text-ivory-100 tracking-wide">
            Premier Admissions House
          </span>
        </a>
        <button
          type="button"
          onClick={onNavigateAssessment}
          className="btn-primary hidden sm:inline-block !py-3 !px-6 text-xs"
        >
          Begin Assessment
        </button>
      </div>
    </header>
  );
}
