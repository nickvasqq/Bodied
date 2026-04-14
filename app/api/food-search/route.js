import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "No food query" }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: `You are a nutrition database. The user searched for: "${query}"

Return 3-5 matching food items with nutrition info per serving.

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "results": [
    {
      "name": "<food name>",
      "serving": "<serving size e.g. 1 cup, 100g, 1 large>",
      "calories": <number>,
      "protein": <grams as number>,
      "carbs": <grams as number>,
      "fat": <grams as number>,
      "fiber": <grams as number>
    }
  ]
}

Be accurate with real nutritional data. Use common serving sizes.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content?.map((c) => c.text || "").join("") || "";
    var cleaned = text.replace(/```json|```/g, "").trim();
    var parsed;
    try { parsed = JSON.parse(cleaned); } catch(e) { parsed = { results: [] }; }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Food search error:", error);
    return NextResponse.json(
      { error: "Failed to search foods" },
      { status: 500 }
    );
  }
}
