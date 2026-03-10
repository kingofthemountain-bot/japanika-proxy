# Japanika Dashboard API Proxy

CORS proxy for Tabit API - allows the dashboard to fetch data from Tabit without CORS issues.

## Deploy to Render

1. Create account on render.com
2. New Web Service → Connect this GitHub repo
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
4. Deploy!

## Endpoints

- `GET /api/daily-totals` - Get daily totals for today (or specify `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`)
- `GET /api/organizations` - Get all organizations (48 Japanika locations)

## Local Development

```bash
npm install
node server.js
```

Runs on http://localhost:3456
