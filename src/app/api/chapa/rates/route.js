// src/app/api/chapa/rates/route.js
//
// Thin server-side proxy for Chapa's Rates API. Never call Chapa's /v1/rates
// directly from the client — it requires CHAPA_SECRET_KEY, which must never
// reach the browser. This route exists purely to hand the client an ESTIMATE
// for display on /checkout. The authoritative rate is fetched again,
// server-side, inside /api/chapa/initialize at the moment of payment.

export async function GET() {
  try {
    const res = await fetch(
      "https://api.chapa.co/v1/rates?from=USD&to=ETB",
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
        // Rates can change; don't let Next.js cache a stale conversion.
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (json.status !== "success" || !json.data?.rate) {
      return Response.json(
        { error: "Could not fetch current exchange rate." },
        { status: 502 }
      );
    }

    return Response.json({
      rate: json.data.rate,
      charge: json.data.charge ?? 0,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Chapa rates fetch failed:", err);
    return Response.json(
      { error: "Could not fetch current exchange rate." },
      { status: 502 }
    );
  }
}
