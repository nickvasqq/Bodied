import "./globals.css";

export const metadata = {
  title: "Bodied - AI Physique Analysis",
  description:
    "Upload a photo. AI rates your physique out of 10, tells you to bulk or cut, and breaks down exactly what needs work.",
  keywords: "physique, AI, body analysis, bulk, cut, fitness, workout, meal plan",
  openGraph: {
    title: "Bodied - AI Physique Analysis",
    description:
      "Upload a photo. Get rated. Find out if you should bulk or cut.",
    url: "https://bodied.fit",
    siteName: "Bodied",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bodied - AI Physique Analysis",
    description:
      "Upload a photo. Get rated. Find out if you should bulk or cut.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
