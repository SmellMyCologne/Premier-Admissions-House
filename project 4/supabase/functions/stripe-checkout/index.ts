import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.7.0";

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
    if (!stripeKey) {
      return jsonResponse({ error: "Stripe not configured" }, 500);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

    const { analysisResultId, customerEmail, origin, returnPath } = await req.json();

    if (!analysisResultId || !origin) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    const base = returnPath ? `${origin}${returnPath}` : origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price: "price_1TCWo851cOv0JoWSAhj8SNe0",
          quantity: 1,
        },
      ],
      metadata: {
        analysisResultId,
      },
      success_url: `${base}?payment=success&session_id={CHECKOUT_SESSION_ID}&ar=${analysisResultId}`,
      cancel_url: `${base}?payment=cancelled&ar=${analysisResultId}`,
    });

    return jsonResponse({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
});
