import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

function buildEmailHtml(customerName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8f7f4;font-family:'Georgia','Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f7f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr>
          <td style="background-color:#0a1628;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#c9a84c;font-weight:400;letter-spacing:1px;">Premier Admissions House</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 20px;font-size:16px;color:#1a1a1a;line-height:1.6;">
              Dear ${customerName || "Valued Client"},
            </p>
            <p style="margin:0 0 20px;font-size:16px;color:#1a1a1a;line-height:1.6;">
              Thank you for your purchase. Your <strong>Admissions Strategy Report</strong> is now fully unlocked and ready to review.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#faf9f5;border-radius:6px;border:1px solid #e8e5dc;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Product</p>
                  <p style="margin:0;font-size:16px;color:#1a1a1a;font-weight:600;">Admissions Strategy Report</p>
                </td>
                <td style="padding:20px 24px;text-align:right;">
                  <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Status</p>
                  <p style="margin:0;font-size:16px;color:#2d7a4f;font-weight:600;">Unlocked</p>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 20px;font-size:16px;color:#1a1a1a;line-height:1.6;">
              You can return to the site at any time to view your full report, including your personalized positioning analysis, school-tier recommendations, and essay strategy.
            </p>
            <p style="margin:0;font-size:16px;color:#1a1a1a;line-height:1.6;">
              If you have any questions, simply reply to this email.
            </p>
            <p style="margin:32px 0 0;font-size:16px;color:#1a1a1a;line-height:1.6;">
              Warm regards,<br>
              <strong>The Premier Admissions House Team</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#faf9f5;padding:20px 40px;text-align:center;border-top:1px solid #e8e5dc;">
            <p style="margin:0;font-size:12px;color:#999;line-height:1.5;">
              Premier Admissions House &mdash; Strategic college admissions guidance.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.warn("RESEND_API_KEY not set — skipping confirmation email");
      return jsonResponse({ skipped: true, reason: "RESEND_API_KEY not configured" });
    }

    const { to, customerName } = await req.json();

    if (!to) {
      return jsonResponse({ error: "Missing 'to' email address" }, 400);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: Deno.env.get("EMAIL_FROM") || "Premier Admissions House <noreply@premieradmissionshouse.com>",
        to: [to],
        subject: "Your Admissions Strategy Report Is Unlocked",
        html: buildEmailHtml(customerName),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", err);
      return jsonResponse({ error: "Email delivery failed" }, 502);
    }

    const data = await res.json();
    return jsonResponse({ sent: true, id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("send-confirmation-email error:", message);
    return jsonResponse({ error: message }, 500);
  }
});
