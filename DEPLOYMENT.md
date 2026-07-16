# Deployment Guide

## Vercel Deployment (API Only)

**Important:** This backend uses Socket.IO for real-time features, which is **NOT supported on Vercel's serverless platform**. The Vercel deployment below only works for HTTP API routes. Socket.IO functionality will be disabled.

### Prerequisites

- Vercel account
- PostgreSQL database (use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))
- Git repository connected to Vercel

### Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```env
NODE_ENV=production
PORT=4004
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add Vercel deployment config"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect the `vercel.json` configuration

3. **Add environment variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Add `NODE_ENV=production`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Files Created for Vercel

- `vercel.json` - Vercel configuration
- `api/index.ts` - Serverless function entry point
- `vercel-build` script in `package.json`

### Limitations on Vercel

- ❌ Socket.IO (WebSocket) connections will NOT work
- ❌ Real-time features disabled
- ❌ Serverless functions have cold starts
- ❌ Database connections may timeout on idle
- ✅ All HTTP REST API routes work normally

---

## Recommended Alternative: Railway.app

For full Socket.IO support, deploy to **Railway.app** instead:

### Why Railway?

- ✅ Supports Socket.IO and WebSockets
- ✅ Persistent server (no cold starts)
- ✅ Built-in PostgreSQL database
- ✅ Auto-deploy from GitHub
- ✅ Free tier available

### Deployment Steps on Railway

1. **Push code to GitHub** (same as above)

2. **Create Railway project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will create a database and set `DATABASE_URL` automatically

4. **Configure environment variables**
   - Go to Variables tab
   - Add `NODE_ENV=production`
   - `DATABASE_URL` is auto-set by Railway

5. **Deploy**
   - Railway auto-deploys on every push
   - Your app will be available at `https://your-app.up.railway.app`

### Railway Configuration

No special configuration needed. Railway automatically:
- Runs `npm install`
- Runs `npm run build`
- Runs `npm start`

---

## Other Supported Platforms

- **Render.com** - Similar to Railway, supports WebSockets
- **Fly.io** - Docker-based, supports volumes for PostgreSQL
- **Heroku** - Traditional PaaS, supports WebSockets

---

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Server runs at http://localhost:4004
```

## Production Build (Self-Hosted)

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

---

## Troubleshooting

### Database Connection Issues

- Ensure `DATABASE_URL` is correctly set
- Check PostgreSQL is running and accessible
- Verify database credentials

### Socket.IO Not Working on Vercel

- Socket.IO is NOT supported on Vercel serverless functions
- Use Railway, Render, or self-hosted server instead

### Build Failures

- Ensure TypeScript compiles: `npm run build`
- Check for TypeScript errors: `npx tsc --noEmit`
- Verify all dependencies are in `package.json`