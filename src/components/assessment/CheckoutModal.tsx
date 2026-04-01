import { useState } from 'react';
import { X, Shield, Lock, Loader2, ExternalLink } from 'lucide-react';

interface Props {
  analysisResultId: string;
  customerEmail?: string;
  onClose: () => void;
}

export default function CheckoutModal({ analysisResultId, customerEmail, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const apiUrl = `${supabaseUrl}/functions/v1/stripe-checkout`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResultId,
          customerEmail: customerEmail || undefined,
          origin: window.location.origin,
          returnPath: window.location.pathname,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-ivory-200/[0.06] bg-navy-900/95 backdrop-blur-xl overflow-hidden shadow-2xl shadow-navy-950/80">
          <div className="relative px-6 pt-6 pb-5 sm:px-8 sm:pt-8 flex items-start justify-between border-b border-ivory-200/[0.04]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-gold-500/60" strokeWidth={1.5} />
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold-500/50 font-medium">
                  Secure Checkout
                </span>
              </div>
              <h3 className="font-serif text-xl text-ivory-50 font-medium">
                Complete Your Purchase
              </h3>
            </div>
            {!loading && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-ivory-200/[0.06] bg-navy-800/40 flex items-center justify-center hover:border-ivory-200/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-ivory-300/40" />
              </button>
            )}
          </div>

          <div className="px-6 py-5 sm:px-8 border-b border-ivory-200/[0.04]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-sm text-ivory-200 font-medium mb-0.5">
                  Full Admissions Strategy Report
                </p>
                <p className="font-sans text-[11px] text-ivory-300/35 font-light">
                  One-time purchase -- lifetime access
                </p>
              </div>
              <span className="font-serif text-2xl text-ivory-50 font-semibold">$29</span>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="font-sans text-xs text-red-300">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                  Pay $29
                  <ExternalLink className="w-3 h-3 opacity-40" strokeWidth={2} />
                </>
              )}
            </button>

            <p className="font-sans text-[10px] text-ivory-300/25 text-center leading-relaxed">
              You will be securely redirected to Stripe to complete payment.
              <br />
              Your card details never touch our servers.
            </p>
          </div>

          <div className="bg-navy-950/40 px-6 py-3 sm:px-8 flex items-center justify-center gap-2 border-t border-ivory-200/[0.03]">
            <Shield className="w-3 h-3 text-ivory-300/15" strokeWidth={1.5} />
            <span className="font-sans text-[10px] text-ivory-300/18 tracking-wide">
              Secure checkout -- strategic guidance only, not a guarantee of admission
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
