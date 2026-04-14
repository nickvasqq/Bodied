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

var SPLITS = {
  3: { name: "Full Body", days: ["Full Body A (Chest/Back/Legs)", "Full Body B (Shoulders/Arms/Legs)", "Full Body C (Back/Chest/Legs)"] },
  4: { name: "Upper Lower", days: ["Upper A (Chest/Back/Shoulders)", "Lower A (Quads/Hamstrings/Glutes/Calves)", "Upper B (Back/Shoulders/Arms)", "Lower B (Hamstrings/Glutes/Quads/Calves)"] },
  5: { name: "Push Pull Legs Upper Lower", days: ["Push (Chest/Shoulders/Triceps)", "Pull (Back/Biceps/Rear Delts)", "Legs (Quads/Hamstrings/Glutes/Calves)", "Upper (Chest/Back/Shoulders/Arms)", "Lower (Quads/Hamstrings/Glutes/Calves/Core)"] },
  6: { name: "Push Pull Legs x2", days: ["Push A (Heavy Chest/Shoulders/Triceps)", "Pull A (Heavy Back/Biceps)", "Legs A (Heavy Squats/Hamstrings/Calves)", "Push B (Volume Chest/Shoulders/Triceps)", "Pull B (Volume Back/Biceps/Rear Delts)", "Legs B (Volume Quads/Glutes/Calves)"] },
};

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

export async function POST(req) {
  try {
    var body = await req.json();
    var results = body.results;
    var prefs = body.preferences;
    var isPaid = body.isPaid;
    if (!results) return NextResponse.json({ error: "No scan results" }, { status: 400 });

    var days = (prefs && prefs.daysPerWeek) || 5;
    var equip = (prefs && prefs.equipment) || "full gym";
    var exp = (prefs && prefs.experience) || "intermediate";
    var goal = results.verdict || "Recomp";
    var gender = results.detectedGender || "male";
    var split = SPLITS[days] || SPLITS[5];

    var dayList = split.days.map(function(d, i) { return "Day " + (i+1) + " - " + d; }).join("\n");

    var prompt = "You are a professional personal trainer building a " + goal.toLowerCase() + " program for a " + gender + " " + exp + " lifter.\nEquipment: " + equip + "\nWeak points: " + (results.weaknesses||[]).join(", ") + "\n\nSPLIT: " + split.name + " (" + days + " days)\nYou MUST follow this EXACT day structure:\n" + dayList + "\n\nRULES:\n- Each day MUST train the muscles listed in parentheses. Do NOT skip any muscle listed.\n- 5 exercises per day. Each exercise must target a muscle from that day's focus.\n- Weak points get heavier compound work and additional isolation.\n- Chest must appear in at least 2 days across the week.\n- Back must appear in at least 2 days across the week.\n- Legs get at least 2 full sessions with squats/deadlifts as primary movers.\n- Choose exercises appropriate for " + equip + ".\n\nJSON only:\n{\"programName\":\"<creative name>\",\"split\":\"" + split.name + "\",\"daysPerWeek\":" + days + ",\"overview\":\"<2 sentences about the program strategy>\",\"days\":[{\"day\":\"<Day 1 - exact name from above>\",\"focus\":\"<muscles>\",\"warmup\":\"<brief warmup>\",\"exercises\":[{\"name\":\"<compound or isolation exercise>\",\"sets\":\"4\",\"reps\":\"8-10\",\"rest\":\"90s\",\"note\":\"<form cue or purpose>\"}]}]}";

    var parsed = await generate(prompt, isPaid ? 6144 : 4096);

    if (!parsed) {
      console.log("Training retry with simpler prompt");
      var simple = "Create a " + days + "-day " + split.name + " program. Days:\n" + dayList + "\n5 exercises per day matching each day's muscles. " + equip + ".\nJSON: {\"programName\":\"<n>\",\"split\":\"" + split.name + "\",\"daysPerWeek\":" + days + ",\"overview\":\"<1 line>\",\"days\":[{\"day\":\"<name>\",\"focus\":\"<muscles>\",\"exercises\":[{\"name\":\"<ex>\",\"sets\":\"3\",\"reps\":\"10\",\"rest\":\"60s\",\"note\":\"\"}]}]}";
      parsed = await generate(simple, 3072);
    }

    if (!parsed) return NextResponse.json({ error: "Could not generate plan. Try fewer days." }, { status: 500 });
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Training error:", error.message);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
