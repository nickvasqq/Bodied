import { NextResponse } from "next/server";

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

async function generate(prompt, tokens) {
  var res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: tokens, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) return null;
  var data = await res.json();
  var text = data.content?.map(function(c){return c.text||"";}).join("") || "";
  return recover(text);
}

function expand(parsed) {
  if (parsed.dayTemplates && !parsed.weeklyPlan) {
    var dn = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    parsed.weeklyPlan = dn.map(function(name, i) {
      var tpl = parsed.dayTemplates[i % parsed.dayTemplates.length];
      return { dayName: name, meals: tpl.meals, templateLabel: tpl.label };
    });
  }
  return parsed;
}

export async function POST(req) {
  try {
    var body = await req.json();
    var results = body.results;
    var prefs = body.preferences;
    var isPaid = body.isPaid;
    if (!results) return NextResponse.json({ error: "No scan results" }, { status: 400 });

    var diet = (prefs && prefs.diet) || "no restrictions";
    var budget = (prefs && prefs.budget) || "moderate";
    var mCount = (prefs && prefs.mealsPerDay) || 4;
    var goal = results.verdict || "Recomp";
    var gender = results.detectedGender || "male";

    var cal = results.recommendedCalories || 2500;
    if (goal === "Bulk" && results.bulkCalories) cal = results.bulkCalories;
    if (goal === "Cut" && results.cutCalories) cal = results.cutCalories;
    if (goal === "Recomp" && results.maintenanceCalories) cal = results.maintenanceCalories;
    var pro = results.recommendedProtein || 150;
    var fatG = Math.round(cal * 0.25 / 9);
    var carbG = Math.round((cal - (pro * 4) - (fatG * 9)) / 4);

    var perMealPro = Math.round(pro / mCount);
    var perMealCal = Math.round(cal / mCount);

    var tplCount = isPaid ? 3 : 2;
    var prompt = "You are a sports nutritionist creating a meal plan for a " + gender + " on a " + goal.toLowerCase() + ".\n\nTARGETS (MUST HIT THESE):\n- Total daily calories: " + cal + "\n- Protein: " + pro + "g (THIS IS THE #1 PRIORITY - every meal must have a protein source)\n- Carbs: ~" + carbG + "g\n- Fat: ~" + fatG + "g\n\nEach of the " + mCount + " meals should have roughly " + perMealPro + "g protein and " + perMealCal + " calories.\n\nDiet: " + diet + " | Budget: " + budget + "\n\nPROTEIN RULE: Every single meal MUST contain a high-protein food (chicken, fish, eggs, Greek yogurt, protein shake, tofu, etc). The protein numbers per food must be realistic (chicken breast = 31g per 4oz, eggs = 6g each, Greek yogurt = 15g per cup).\n\nCreate " + tplCount + " day templates with " + mCount + " meals each.\n\nJSON only:\n{\"planName\":\"<n>\",\"dailyCalories\":" + cal + ",\"macros\":{\"protein\":\"" + pro + "g\",\"carbs\":\"" + carbG + "g\",\"fat\":\"" + fatG + "g\"},\"overview\":\"<1 sentence>\",\"dayTemplates\":[{\"label\":\"Day A\",\"meals\":[{\"meal\":\"Meal 1\",\"foods\":[{\"item\":\"<food>\",\"amount\":\"<qty>\",\"calories\":<n>,\"protein\":<n>,\"carbs\":<n>,\"fat\":<n>}],\"mealCalories\":<total>}]}],\"groceryList\":[\"<item>\"],\"weeklyGroceryCost\":\"$<n>\"}";

    var parsed = await generate(prompt, isPaid ? 4096 : 3072);

    if (!parsed) {
      console.log("Meal plan retry");
      var simple = "Create " + tplCount + " simple meal templates, " + mCount + " meals each. Target " + cal + " cal, " + pro + "g protein. Every meal needs protein. Diet: " + diet + ". JSON: {\"planName\":\"<n>\",\"dailyCalories\":" + cal + ",\"macros\":{\"protein\":\"" + pro + "g\",\"carbs\":\"" + carbG + "g\",\"fat\":\"" + fatG + "g\"},\"overview\":\"<1 sentence>\",\"dayTemplates\":[{\"label\":\"Day A\",\"meals\":[{\"meal\":\"Meal 1\",\"foods\":[{\"item\":\"<f>\",\"amount\":\"<q>\",\"calories\":<n>,\"protein\":<n>,\"carbs\":<n>,\"fat\":<n>}],\"mealCalories\":<n>}]}],\"groceryList\":[\"<item>\"]}";
      parsed = await generate(simple, 2048);
    }

    if (!parsed) return NextResponse.json({ error: "Could not generate meal plan." }, { status: 500 });
    return NextResponse.json(expand(parsed));
  } catch (error) {
    console.error("Meals error:", error.message);
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 });
  }
}
