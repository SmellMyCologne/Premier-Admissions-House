import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey || !webhookSecret) {
      return jsonResponse({ error: "Stripe not configured" }, 500);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return jsonResponse({ error: "Missing stripe-signature" }, 400);
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const analysisResultId = session.metadata?.analysisResultId;

      if (analysisResultId && !analysisResultId.startsWith("local-")) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (supabaseUrl && supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);

          const customerEmail = session.customer_details?.email || session.customer_email;

          const { error } = await supabase
            .from("analysis_results")
            .update({
              is_unlocked: true,
              ...(customerEmail ? { customer_email: customerEmail } : {}),
            })
            .eq("id", analysisResultId);

          if (error) {
            console.error("Failed to unlock analysis result:", error.message);
          }
          if (customerEmail) {
            const { data: arRow } = await supabase
              .from("analysis_results")
              .select("assessments ( first_name )")
              .eq("id", analysisResultId)
              .maybeSingle();

            const assessments = arRow?.assessments;
            const nameRecord = Array.isArray(assessments) ? assessments[0] : assessments;
            const customerName = (nameRecord as Record<string, string> | null)?.first_name || "";

            const emailPromise = fetch(`${supabaseUrl}/functions/v1/send-confirmation-email`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${supabaseServiceKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ to: customerEmail, customerName }),
            }).catch((e) => console.error("Confirmation email failed:", e));

            EdgeRuntime.waitUntil(emailPromise);
          }
        }
      }
    }

    return jsonResponse({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ error: message }, 400);
  }
});
