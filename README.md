# Bodied - AI Physique Analysis

Upload a photo. AI rates your physique out of 10, tells you to bulk or cut, and breaks down exactly what needs work.

## Quick Start (Local Development)

1. Install Node.js if you don't have it: https://nodejs.org (download LTS version)

2. Open your terminal and navigate to this project folder:
   ```
   cd bodied
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create your environment file:
   ```
   cp .env.local.example .env.local
   ```

5. Get your Anthropic API key from https://console.anthropic.com/ and paste it into `.env.local`

6. Start the development server:
   ```
   npm run dev
   ```

7. Open http://localhost:3000 in your browser

## Deploy to Vercel (Make it Live on bodied.fit)

### Step 1: Push to GitHub

1. Create a GitHub account if you don't have one: https://github.com
2. Install Git: https://git-scm.com/downloads
3. Create a new repository on GitHub called "bodied"
4. In your terminal, inside the bodied folder:
   ```
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bodied.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com and sign up with your GitHub account
2. Click "Add New Project"
3. Import your "bodied" repository from GitHub
4. Before deploying, add your environment variable:
   - Click "Environment Variables"
   - Name: ANTHROPIC_API_KEY
   - Value: your API key from console.anthropic.com
5. Click "Deploy"
6. Wait for the build to finish (about 1-2 minutes)

### Step 3: Connect bodied.fit Domain

1. In Vercel, go to your project Settings > Domains
2. Add "bodied.fit" as a custom domain
3. Vercel will show you DNS records to add
4. Go to Namecheap > Domain List > bodied.fit > Manage > Advanced DNS
5. Delete any existing records
6. Add the records Vercel tells you to add (usually):
   - Type: A Record, Host: @, Value: 76.76.21.21
   - Type: CNAME, Host: www, Value: cname.vercel-dns.com
7. Wait 5-30 minutes for DNS to propagate
8. Vercel will automatically set up HTTPS/SSL

## Project Structure

```
bodied/
  app/
    api/
      scan/route.js     <- AI physique analysis (server-side, protects API key)
      train/route.js    <- Training plan generator
      meals/route.js    <- Meal plan generator
    globals.css         <- Global styles
    layout.js           <- Root layout with SEO metadata
    page.js             <- Main page
  components/
    Bodied.jsx          <- Full app UI (client component)
  .env.local            <- Your API key (never commit this)
  package.json
```

## Next Steps

- Add Stripe for payments on training/meal plan tiers
- Add email storage (Supabase or similar)
- Add Spanish language support
- Build mobile app with React Native
