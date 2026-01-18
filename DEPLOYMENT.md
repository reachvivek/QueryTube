# 🚀 Vercel Deployment Guide for QueryTube

## Prerequisites

1. **Vercel Account**: [Sign up for free](https://vercel.com/signup)
2. **GitHub Repository**: Code pushed to GitHub
3. **Required API Keys**:
   - OpenAI API key (for Whisper transcription)
   - Mistral API key (for embeddings)
   - Pinecone account (for vector storage)
   - Groq API key (optional but recommended - free & fast)

## Step 1: Database Setup (CRITICAL)

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project → Storage → Create Database → Postgres
2. Vercel will automatically set `DATABASE_URL` environment variable
3. No additional configuration needed!

### Option B: External PostgreSQL (Supabase, Neon, etc.)

1. Create a PostgreSQL database on your preferred provider
2. Get the connection string (format: `postgresql://user:pass@host:5432/db`)
3. You'll add this as `DATABASE_URL` in Step 3

## Step 2: Update Prisma Schema for Production

**Edit `prisma/schema.prisma`:**

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Commit this change:**
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push origin main
```

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Framework Preset: **Next.js** (auto-detected)

### 3.2 Configure Environment Variables

**In Vercel Dashboard → Settings → Environment Variables**, add:

#### REQUIRED Variables:

```bash
# OpenAI (for Whisper transcription)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Mistral (for embeddings - CRITICAL!)
MISTRAL_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Pinecone (for vector storage)
PINECONE_API_KEY=pcsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PINECONE_INDEX=querytube
PINECONE_ENVIRONMENT=us-east-1-aws

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-long-random-secret-here
NEXTAUTH_URL=https://your-app.vercel.app

# Email (for magic link authentication)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-gmail-app-password
EMAIL_FROM=QueryTube <noreply@querytube.app>
```

#### RECOMMENDED Variables:

```bash
# Groq (FREE 14,400 requests/day - faster than GPT!)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Defaults
DEFAULT_AI_PROVIDER=groq
DEFAULT_MODEL=llama-3.3-70b-versatile
DEFAULT_CHUNK_SIZE=90
DEFAULT_OVERLAP=10
```

#### OPTIONAL Variables:

```bash
# Claude (if you want to offer it as an option)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3.3 Deploy

1. Click **Deploy**
2. Vercel will:
   - Install dependencies
   - Generate Prisma client
   - Build Next.js app
   - Deploy to production

## Step 4: Database Migration

After first deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run Prisma migration
vercel env pull .env.production
npx prisma migrate deploy
```

**OR** use Vercel Dashboard:
1. Go to Deployments → Latest Deployment
2. Click "..." → Terminal
3. Run: `npx prisma migrate deploy`

## Step 5: Create Pinecone Index

1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Create new index:
   - **Name**: `querytube` (must match PINECONE_INDEX)
   - **Dimensions**: `1024` (for mistral-embed)
   - **Metric**: `cosine`
   - **Cloud**: AWS
   - **Region**: `us-east-1`

## Step 6: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test the landing page loads
3. Try uploading a YouTube video
4. Test Q&A functionality

## Common Issues & Fixes

### ❌ Build Error: "Module not found"
**Fix**: Make sure `postinstall` script is in `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### ❌ Database Error: "Can't reach database"
**Fix**:
1. Check `DATABASE_URL` is set in Vercel environment variables
2. Make sure Prisma schema uses `postgresql` not `sqlite`
3. Run `npx prisma migrate deploy`

### ❌ API Error: "Exceeding max 8192 tokens"
**Fix**: This is already fixed in `lib/chunking.ts` with 6000 token limit

### ❌ Email Auth Not Working
**Fix**:
1. For Gmail, use [App Password](https://support.google.com/accounts/answer/185833), not regular password
2. Make sure `NEXTAUTH_URL` matches your Vercel domain
3. Check `EMAIL_SERVER_*` variables are correct

## Environment Variables Checklist

- [ ] `OPENAI_API_KEY` - Required
- [ ] `MISTRAL_API_KEY` - **CRITICAL** (for embeddings)
- [ ] `PINECONE_API_KEY` - Required
- [ ] `PINECONE_INDEX` - Required
- [ ] `PINECONE_ENVIRONMENT` - Required
- [ ] `DATABASE_URL` - Auto-set by Vercel Postgres
- [ ] `NEXTAUTH_SECRET` - Required
- [ ] `NEXTAUTH_URL` - Required
- [ ] `EMAIL_SERVER_*` - Required (5 variables)
- [ ] `GROQ_API_KEY` - Recommended
- [ ] `ANTHROPIC_API_KEY` - Optional

## Production Checklist

- [ ] Switched Prisma schema to PostgreSQL
- [ ] Added all environment variables to Vercel
- [ ] Ran database migrations
- [ ] Created Pinecone index (1024 dimensions)
- [ ] Tested video upload
- [ ] Tested Q&A functionality
- [ ] Verified email authentication works
- [ ] Removed all console.logs from production code
- [ ] Build passes without errors

## Monitoring

1. **Logs**: Vercel Dashboard → Deployments → Logs
2. **Analytics**: Vercel Dashboard → Analytics
3. **Database**: Prisma Studio (run locally with production DB)

## Support

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Pinecone Docs: https://docs.pinecone.io

---

**Ready to deploy?** Follow steps 1-6 above. Estimated setup time: 15-20 minutes.
