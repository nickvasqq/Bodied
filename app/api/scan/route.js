import { NextResponse } from "next/server";

function detectType(b64) {
  if (b64.startsWith("/9j/")) return "image/jpeg";
  if (b64.startsWith("iVBOR")) return "image/png";
  return "image/jpeg";
}

function calcTDEE(hFt, hIn, wLbs, isMale) {
  var inches = (parseInt(hFt) * 12) + parseInt(hIn || 0);
  var cm = inches * 2.54;
  var kg = parseFloat(wLbs) * 0.453592;
  var bmr = isMale ? (10 * kg) + (6.25 * cm) - (5 * 22) - 5 : (10 * kg) + (6.25 * cm) - (5 * 22) - 161;
  return Math.round(bmr * 1.55);
}

function recover(text) {
  var c = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(c); } catch(e) {}
  var lb = c.lastIndexOf("}");
  if (lb < 1) return null;
  var t = c.substring(0, lb + 1);
  var fix = function(o, cl, ch) { var a=(t.match(o)||[]).length, b=(t.match(cl)||[]).length; while(a>b){t+=ch;b++;} };
  fix(/\[/g, /\]/g, "]"); fix(/\{/g, /\}/g, "}");
  try { return JSON.parse(t); } catch(e2) { return null; }
}

export async function POST(req) {
  try {
    var body = await req.json();
    var fi = body.frontImage, bi = body.backImage, li = body.legsImage;
    var hFt = body.heightFt, hIn = body.heightIn, wt = body.weight;
    var gw = body.goalWeight, isPaid = body.isPaid;
    if (!fi) return NextResponse.json({ error: "Front photo required" }, { status: 400 });

    var imgs = [], views = ["front"];
    imgs.push({ type: "image", source: { type: "base64", media_type: detectType(fi), data: fi } });
    if (bi) { imgs.push({ type: "image", source: { type: "base64", media_type: detectType(bi), data: bi } }); views.push("back"); }
    if (li) { imgs.push({ type: "image", source: { type: "base64", media_type: detectType(li), data: li } }); views.push("legs"); }

    var hasBack = views.includes("back"), hasLegs = views.includes("legs"), hasStats = hFt && wt;
    var tM = hasStats ? calcTDEE(hFt, hIn, wt, true) : null;
    var tF = hasStats ? calcTDEE(hFt, hIn, wt, false) : null;
    var bM = tM ? tM + 400 : null, cM = tM ? Math.round(tM * 0.8) : null;
    var bF = tF ? tF + 350 : null, cF = tF ? Math.round(tF * 0.8) : null;

    var stats = "";
    if (hasStats) {
      stats = "STATS: " + hFt + "'" + (hIn||"0") + "\", " + wt + " lbs.\nIf MALE: TDEE=" + tM + ", bulk=" + bM + " (TDEE+400), cut=" + cM + " (TDEE x 0.8), protein=" + Math.round(wt*1) + "g\nIf FEMALE: TDEE=" + tF + ", bulk=" + bF + " (TDEE+350), cut=" + cF + " (TDEE x 0.8), protein=" + Math.round(wt*0.85) + "g";
      if (gw) { var d = parseInt(gw)-parseInt(wt); stats += "\nGoal: " + gw + "lbs (" + (d>0?"gain ":"lose ") + Math.abs(d) + "lbs)"; }
    }

    var paid = isPaid ? "\nGive deeply detailed analysis. Name muscles anatomically. Comment on insertions, proportions, symmetry. Explain each body part score with what you observe." : "";

    var p = "You are Bodied, an encouraging but honest AI physique coach. Analyze " + (views.length > 1 ? "these photos" : "this photo") + ".\n" + stats + "\nViews: " + views.join(", ") + "\n\nSCORING CALIBRATION (follow this closely):\n- 3.0-4.0: Untrained, no visible muscle development\n- 4.0-5.0: Some training history, early development visible\n- 5.0-6.0: Regular lifter, visible muscle but room to grow\n- 6.0-7.0: Solid physique, clear muscle definition and size. MOST people who train consistently 1-2 years land here.\n- 7.0-8.0: Impressive development, stands out in a gym\n- 8.0-9.0: Advanced, could compete in natural shows\n- 9.0+: Elite, stage-ready competitor\n\nIMPORTANT: If someone clearly lifts weights and has visible muscle, they are AT LEAST a 5.5. Do not rate active lifters below 5. Score each body part independently based on what you actually see." + (!hasBack?"\n- Back: null (not visible)":"") + (!hasLegs?"\n- Legs: null (not visible)":"") + "\n- Use the EXACT calorie numbers from above for the detected gender. Bulk for someone who needs mass, Cut for someone with excess fat, Recomp for in-between." + paid + "\n\nJSON only:\n{\"rating\":<decimal like 6.3>,\"bodyFatEstimate\":\"<range like 14-16%>\",\"verdict\":\"<Bulk/Cut/Recomp>\",\"verdictReason\":\"<2 specific sentences>\",\"summary\":\"<" + (isPaid?"4":"3") + " sentences>\",\"strengths\":[\"<s>\",\"<s>\",\"<s>\"],\"weaknesses\":[\"<w>\",\"<w>\",\"<w>\"],\"bodyParts\":{\"chest\":<n/null>,\"shoulders\":<n/null>,\"arms\":<n/null>,\"back\":<n/null>,\"core\":<n/null>,\"legs\":<n/null>},\"detectedGender\":\"<male/female>\",\"recommendedCalories\":<from above>,\"recommendedProtein\":<from above>,\"tdee\":<n/null>,\"bulkCalories\":<n/null>,\"cutCalories\":<n/null>,\"maintenanceCalories\":<n/null>}";

    imgs.push({ type: "text", text: p });

    var res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: isPaid ? 4096 : 3072, messages: [{ role: "user", content: imgs }] }),
    });

    if (!res.ok) { console.error("API error:", await res.json().catch(function(){return{};})); return NextResponse.json({ error: "AI service error" }, { status: 500 }); }
    var data = await res.json();
    var text = data.content?.map(function(c){return c.text||"";}).join("") || "";
    var parsed = recover(text);
    if (!parsed) return NextResponse.json({ error: "Scan incomplete. Try again." }, { status: 500 });
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Scan error:", error.message);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
