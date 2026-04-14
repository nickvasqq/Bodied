import { NextResponse } from "next/server";

var PROMO_CODES = {
  "BODIEDFAM": { discount: 100, description: "Friends & family - free access" },
  "LAUNCH50": { discount: 50, description: "Launch discount - 50% off" },
};

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
    }

    var body = await req.json();
    var plan = body.plan;
    var email = body.email;
    var promoCode = body.promoCode;

    if (promoCode) {
      var upper = promoCode.toUpperCase().trim();
      var promo = PROMO_CODES[upper];
      if (promo && promo.discount === 100) {
        return NextResponse.json({ success: true, free: true, message: "Promo code applied! Full access granted." });
      }
    }

    var Stripe = (await import("stripe")).default;
    var stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    var prices = {
      train: process.env.STRIPE_PRICE_TRAIN,
      transform: process.env.STRIPE_PRICE_TRANSFORM,
    };

    var priceId = prices[plan];
    if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    var params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: req.headers.get("origin") + "/success?plan=" + plan,
      cancel_url: req.headers.get("origin"),
    };

    if (promoCode) {
      var upper2 = promoCode.toUpperCase().trim();
      if (PROMO_CODES[upper2] && PROMO_CODES[upper2].discount === 50) {
        params.discounts = [{ coupon: process.env.STRIPE_COUPON_50 }];
      }
    }

    if (email) params.customer_email = email;

    var session = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout not available" }, { status: 500 });
  }
}
