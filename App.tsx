import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import WhatYouReceive from './components/WhatYouReceive';
import WhyFamilies from './components/WhyFamilies';
import HowItWorks from './components/HowItWorks';
import DesignedFor from './components/DesignedFor';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import AssessmentPage from './pages/AssessmentPage';

type Page = 'landing' | 'assessment';

function parsePaymentParams() {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const ar = params.get('ar');

  if (payment === 'success' || payment === 'cancelled') {
    window.history.replaceState({}, '', '/');
    return { status: payment as 'success' | 'cancelled', analysisResultId: ar };
  }
  return null;
}

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | null>(null);
  const [paymentArId, setPaymentArId] = useState<string | null>(null);

  useEffect(() => {
    const pp = parsePaymentParams();
    if (pp) {
      setPaymentStatus(pp.status);
      setPaymentArId(pp.analysisResultId);
      setPage('assessment');
    }
  }, []);

  const goToAssessment = useCallback(() => {
    setPaymentStatus(null);
    setPaymentArId(null);
    setPage('assessment');
    window.scrollTo(0, 0);
  }, []);

  const goToLanding = useCallback(() => {
    setPaymentStatus(null);
    setPaymentArId(null);
    setPage('landing');
    window.scrollTo(0, 0);
  }, []);

  if (page === 'assessment') {
    return (
      <AssessmentPage
        onBack={goToLanding}
        paymentStatus={paymentStatus}
        paymentAnalysisResultId={paymentArId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Header onNavigateAssessment={goToAssessment} />
      <main>
        <Hero onNavigateAssessment={goToAssessment} />
        <TrustStrip />
        <WhatYouReceive />
        <WhyFamilies />
        <HowItWorks />
        <DesignedFor />
        <CtaSection onNavigateAssessment={goToAssessment} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
