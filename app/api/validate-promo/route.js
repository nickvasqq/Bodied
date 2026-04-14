import { NextResponse } from "next/server";

var PROMO_CODES = {
  "BODIEDFAM": { discount: 100, description: "Friends and family - full free access" },
  "LAUNCH50": { discount: 50, description: "Launch discount - 50% off" },
  "BETA": { discount: 100, description: "Beta tester - full free access" },
};

export async function POST(req) {
  try {
    var body = await req.json();
    var code = (body.code || "").toUpperCase().trim();

    if (!code) {
      return NextResponse.json({ valid: false, message: "Enter a promo code" });
    }

    var promo = PROMO_CODES[code];
    if (promo) {
      return NextResponse.json({
        valid: true,
        discount: promo.discount,
        description: promo.description,
        fullAccess: promo.discount === 100,
      });
    }

    return NextResponse.json({ valid: false, message: "Invalid promo code" });
  } catch (error) {
    return NextResponse.json({ valid: false, message: "Error checking code" });
  }
}
