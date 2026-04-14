"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const plan = params.get("plan");

  return (
    <div style={{
      minHeight: "100vh", background: "#0b0b10", color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Outfit', sans-serif", padding: 24,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, margin: "0 auto 24px",
          background: "rgba(205,255,50,.1)", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 40,
        }}>
          {plan === "transform" ? "🔥" : "💪"}
        </div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 36, fontWeight: 700, marginBottom: 12, letterSpacing: "-.03em",
        }}>
          You're {plan === "transform" ? "Fully" : ""} Bodied.
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,.4)", marginBottom: 32, lineHeight: 1.6 }}>
          {plan === "transform"
            ? "Your custom training plan and meal plan are ready. Let's get to work."
            : "Your custom training plan is ready. Time to put in the work."}
        </p>
        <a href="/" style={{
          display: "inline-block", padding: "16px 40px", borderRadius: 12,
          background: "linear-gradient(135deg, #cdff32, #b8e600)",
          color: "#0b0b10", textDecoration: "none",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 15, fontWeight: 600,
          boxShadow: "0 0 36px rgba(205,255,50,.2)",
        }}>
          Go To My Plan
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0b0b10" }} />}>
      <SuccessContent />
    </Suspense>
  );
}
