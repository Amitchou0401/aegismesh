<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4c9e05ed-6bea-44d7-9e1c-b0393dcd480d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy on Vercel
1. Push this folder to a GitHub repo (do NOT commit `.env` files).
2. On vercel.com: Add New > Project > import the repo. Framework: Vite (auto-detected).
3. (Optional) Settings > Environment Variables: add `GEMINI_API_KEY`.
4. Deploy. The `api/` folder becomes serverless functions (`/api/generate-plan`, `/api/cap-broadcast`).
`server.ts` is only for local development (`npm run dev`); Vercel does not use it.
