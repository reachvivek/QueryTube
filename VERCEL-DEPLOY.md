# 🚀 Deploy to Vercel in 10 Minutes

## ✅ No Database Changes Needed!
- **Local Dev**: Keep using SQLite (file:./dev.db)
- **Production**: Vercel automatically provisions PostgreSQL

---

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

## Step 2: Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Click **Deploy** (don't configure anything yet)
4. Wait for first deployment (it will fail - that's OK!)

---

## Step 3: Add Environment Variables

In Vercel Dashboard → **Settings** → **Environment Variables**, add these:

### 🔴 REQUIRED (App won't work without these)

```env
# OpenAI (for Whisper transcription)
OPENAI_API_KEY=sk-proj-xxxxx

# Mistral (for embeddings - CRITICAL!)
MISTRAL_API_KEY=xxxxx

# Pinecone (for vector storage)
PINECONE_API_KEY=pcsk_xxxxx
PINECONE_INDEX=querytube
PINECONE_ENVIRONMENT=us-east-1-aws

# NextAuth (generate: openssl rand -base64 32)
NEXTAUTH_SECRET=your-32-char-random-string
NEXTAUTH_URL=https://your-app.vercel.app

# Email (Gmail recommended)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-gmail-app-password
EMAIL_FROM=QueryTube <noreply@yourapp.com>
```

### 🟢 RECOMMENDED (Free & Faster)

```env
# Groq - FREE 14,400 requests/day!
GROQ_API_KEY=gsk_xxxxx
DEFAULT_AI_PROVIDER=groq
DEFAULT_MODEL=llama-3.3-70b-versatile
```

---

## Step 4: Setup Vercel Postgres

1. In Vercel Dashboard → **Storage** → **Create Database**
2. Choose **Postgres**
3. Click **Create** (free tier available)
4. Vercel auto-sets `DATABASE_URL` environment variable

---

## Step 5: Setup Pinecone Index

1. Go to [app.pinecone.io](https://app.pinecone.io/)
2. Create new index:
   - **Name**: `querytube`
   - **Dimensions**: `1024` (for mistral-embed)
   - **Metric**: `cosine`
   - **Region**: `us-east-1`

---

## Step 6: Redeploy

1. Go to **Deployments** tab
2. Click **...** on latest deployment → **Redeploy**
3. Check "Use existing Build Cache" → **Redeploy**

---

## Step 7: Run Database Migration

After deployment succeeds:

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Pull production env vars
vercel env pull .env.production

# Run migration (one-time)
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma migrate deploy
```

**OR** use Vercel Dashboard:
1. Go to **Deployments** → Click on your deployment
2. Click **...** → **Open Terminal**
3. Run: `npx prisma db push`

---

## ✅ Done! Test Your App

Visit `https://your-app.vercel.app` and:
- Landing page loads ✓
- Upload a YouTube video ✓
- Ask questions ✓

---

## 🔧 Troubleshooting

### Build Error: "Module not found"
**Fix**: Redeploy after adding all environment variables

### Database Error: "Can't reach database server"
**Fix**:
1. Make sure Vercel Postgres is created
2. Run `npx prisma db push` in Vercel terminal

### Embedding Error: "Exceeding max 8192 tokens"
**Fix**: Already fixed in code (`lib/chunking.ts` enforces 6000 token limit)

### Email Not Working
**Fix**:
1. Use Gmail [App Password](https://support.google.com/accounts/answer/185833)
2. Not your regular Gmail password!

---

## 📋 Environment Variables Checklist

Copy-paste this into Vercel:

- [ ] `OPENAI_API_KEY`
- [ ] `MISTRAL_API_KEY` ⚠️ CRITICAL
- [ ] `PINECONE_API_KEY`
- [ ] `PINECONE_INDEX`
- [ ] `PINECONE_ENVIRONMENT`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`
- [ ] `EMAIL_SERVER_HOST`
- [ ] `EMAIL_SERVER_PORT`
- [ ] `EMAIL_SERVER_USER`
- [ ] `EMAIL_SERVER_PASSWORD`
- [ ] `EMAIL_FROM`
- [ ] `GROQ_API_KEY` (recommended)

---

## 🎯 Quick Command Reference

```bash
# Deploy
vercel

# Check logs
vercel logs

# Open production database
vercel env pull .env.production
# Then use DATABASE_URL from .env.production with Prisma Studio

# Rollback deployment
vercel rollback
```

---

**Need help?** Check [Vercel Docs](https://vercel.com/docs) or [open an issue](https://github.com/reachvivek/querytube/issues).
