<div align="center">

![QueryTube](public/assets/cover.jpg)

</div>

# 🎥 QueryTube

> **Transform any video into an intelligent Q&A chatbot using AI-powered semantic search**

[![License](https://img.shields.io/badge/License-Custom-red.svg)](LICENSE.md)
[![Author](https://img.shields.io/badge/Author-reachvivek-blue.svg)](https://github.com/reachvivek)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

Created by **Vivek Kumar Singh ([@reachvivek](https://github.com/reachvivek))**

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Data Flow](#-data-flow)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Free Tier Setup](#-free-tier-setup)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

QueryTube converts any video (YouTube or uploaded files) into a smart Q&A assistant that understands natural language questions and provides accurate answers with timestamps.

### Why QueryTube?

- **100% FREE** to run (using Mistral AI + Groq + Pinecone free tiers)
- **Semantic Search**: Understands meaning, not just keywords
- **Source Citations**: Every answer includes exact video timestamps
- **Multi-Language**: Auto-detects and processes any language
- **Self-Hosted**: You own your data and control costs
- **Per-Video Sessions**: Each video maintains independent processing state

---

## ✨ Key Features

### Video Processing
- ✅ YouTube URLs (public videos)
- ✅ Direct file uploads (MP4, MP3, WAV, M4A, WebM, up to 25MB)
- ✅ Auto language detection
- ✅ YouTube captions extraction (instant, free)
- ✅ AI transcription fallback (when captions unavailable)

### Intelligent Features
- ✅ Semantic embedding generation
- ✅ Vector-based similarity search
- ✅ Context-aware Q&A with citations
- ✅ AI-generated video summaries
- ✅ Chat history persistence per video
- ✅ Session management (resume after refresh)
- ✅ Duplicate video detection

### User Experience
- ✅ Clean, intuitive dashboard
- ✅ Real-time progress tracking
- ✅ Per-video isolated sessions
- ✅ Custom modal confirmations (no browser alerts)
- ✅ Direct chat access from dashboard
- ✅ Complete video deletion (DB + vectors)

### Analytics & Management
- ✅ Provider tracking (Mistral/OpenAI for embeddings, Groq/OpenAI/Claude for Q&A)
- ✅ Usage statistics
- ✅ Q&A history per video
- ✅ Processing status monitoring

---

## 🏗 Architecture

### Technology Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS
- shadcn/ui components
- Lucide icons

**Backend:**
- Next.js API Routes
- Prisma ORM
- SQLite database

**AI Services (FREE Tier):**
- **Mistral AI**: Embeddings (1B tokens/month free)
- **Groq**: Q&A generation (14.4K requests/day free)
- **Pinecone**: Vector storage (100K vectors free)

**Video Processing:**
- yt-dlp (YouTube download)
- youtube-caption-extractor (caption extraction)

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│  (Next.js Frontend + shadcn/ui components)              │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼──────┐         ┌────────▼─────┐
│ SQLite DB│         │  Pinecone    │
│ (Videos, │         │ Vector DB    │
│ Chunks,  │         │ (Embeddings) │
│Analytics)│         └──────────────┘
└──────────┘
    │
    │         ┌──────────────────────────────┐
    │         │    External AI Services      │
    │         │  • Mistral (Embeddings)     │
    └─────────┤  • Groq (Q&A Generation)    │
              │  • OpenAI (Fallback)        │
              └──────────────────────────────┘
```

---

## 🔄 Data Flow

### Complete Processing Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    STEP 1: UPLOAD VIDEO                     │
│  YouTube URL or File Upload → Validation → Create Video DB  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 2: EXTRACT TRANSCRIPT                     │
│                                                              │
│  ┌──────────────┐      ┌────────────────┐                 │
│  │ YouTube      │ YES  │ Extract        │                 │
│  │ Has Captions?├─────►│ Captions       │                 │
│  └──────┬───────┘      └────────┬───────┘                 │
│         │ NO                     │                          │
│         ▼                        ▼                          │
│  ┌──────────────┐      ┌────────────────┐                 │
│  │ Use Whisper  │      │ Split into     │                 │
│  │ Transcription│─────►│ Time-stamped   │                 │
│  └──────────────┘      │ Chunks (~90s)  │                 │
│                        └────────┬───────┘                 │
│                                 │                          │
│                        ┌────────▼───────┐                 │
│                        │ Save chunks to │                 │
│                        │ SQLite with    │                 │
│                        │ videoId FK     │                 │
│                        └────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                STEP 3: VECTORIZE                            │
│                                                              │
│  ┌────────────────┐      ┌────────────────┐               │
│  │ Generate       │      │ Upload to      │               │
│  │ Embeddings     │─────►│ Pinecone       │               │
│  │ (Mistral AI)   │      │ Vector DB      │               │
│  │ 1024 dimensions│      └────────┬───────┘               │
│  └────────────────┘               │                        │
│                                    ▼                        │
│                           ┌────────────────┐               │
│                           │ Update chunks  │               │
│                           │ with vectorId  │               │
│                           │ & provider     │               │
│                           └────────┬───────┘               │
│                                    │                        │
│                                    ▼                        │
│                           ┌────────────────┐               │
│                           │ Generate AI    │               │
│                           │ Summary (Groq) │               │
│                           └────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 4: QUERY & ANSWER (RAG)                   │
│                                                              │
│  User Question                                              │
│       │                                                      │
│       ▼                                                      │
│  ┌────────────────┐                                        │
│  │ Convert to     │                                        │
│  │ Embedding      │                                        │
│  │ (Mistral AI)   │                                        │
│  └────────┬───────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌────────────────┐                                        │
│  │ Search         │                                        │
│  │ Pinecone for   │                                        │
│  │ Similar Chunks │                                        │
│  └────────┬───────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌────────────────┐                                        │
│  │ Retrieve Top-K │                                        │
│  │ Relevant       │                                        │
│  │ Segments       │                                        │
│  └────────┬───────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌────────────────┐                                        │
│  │ Generate       │                                        │
│  │ Answer (Groq/  │                                        │
│  │ OpenAI/Claude) │                                        │
│  └────────┬───────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌────────────────┐                                        │
│  │ Save to        │                                        │
│  │ Analytics DB   │                                        │
│  │ with provider  │                                        │
│  └────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

### Session Management Flow

```
┌─────────────────────────────────────────────────────────┐
│              SESSION STORAGE ARCHITECTURE                │
│                                                          │
│  localStorage Structure:                                 │
│  ├── youtube-qa-last-video          (Last active video) │
│  ├── youtube-qa-session-{videoId1}  (Video 1 session)  │
│  ├── youtube-qa-session-{videoId2}  (Video 2 session)  │
│  ├── chat-history-{videoId1}        (Video 1 chat)     │
│  └── chat-history-{videoId2}        (Video 2 chat)     │
│                                                          │
│  Benefits:                                               │
│  • Each video has isolated processing state             │
│  • Switch between videos without losing progress       │
│  • Chat history persists per video                     │
│  • Resume from exactly where you left off              │
└─────────────────────────────────────────────────────────┘
```

### Delete Operation Flow

```
┌─────────────────────────────────────────────────────────┐
│              VIDEO DELETION PROCESS                      │
│                                                          │
│  User clicks Delete                                      │
│       │                                                  │
│       ▼                                                  │
│  ┌────────────────┐                                    │
│  │ Show Custom    │                                    │
│  │ Confirmation   │                                    │
│  │ Modal (shadcn) │                                    │
│  └────────┬───────┘                                    │
│           │ Confirmed                                   │
│           ▼                                             │
│  ┌────────────────┐                                    │
│  │ 1. Fetch all   │                                    │
│  │    chunks with │                                    │
│  │    vectorIds   │                                    │
│  └────────┬───────┘                                    │
│           │                                             │
│           ▼                                             │
│  ┌────────────────┐                                    │
│  │ 2. Delete      │                                    │
│  │    vectors from│                                    │
│  │    Pinecone    │                                    │
│  │    (batches of │                                    │
│  │    100)        │                                    │
│  └────────┬───────┘                                    │
│           │                                             │
│           ▼                                             │
│  ┌────────────────┐                                    │
│  │ 3. Delete      │                                    │
│  │    video from  │                                    │
│  │    SQLite      │                                    │
│  │    (CASCADE    │                                    │
│  │    deletes     │                                    │
│  │    chunks &    │                                    │
│  │    analytics)  │                                    │
│  └────────┬───────┘                                    │
│           │                                             │
│           ▼                                             │
│  ┌────────────────┐                                    │
│  │ 4. Clear       │                                    │
│  │    localStorage│                                    │
│  │    sessions    │                                    │
│  └────────────────┘                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- One of the following:
  - **FREE Stack**: Mistral AI API Key + Groq API Key + Pinecone Account
  - **Paid Stack**: OpenAI API Key + Pinecone Account
- yt-dlp (for YouTube videos)

### Installation

#### 1. Install yt-dlp

**Windows:**
```bash
winget install yt-dlp
```

**macOS:**
```bash
brew install yt-dlp
```

**Linux:**
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

#### 2. Clone & Install

```bash
git clone https://github.com/reachvivek/QueryTube.git
cd QueryTube
npm install
```

#### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# FREE Stack Configuration (Recommended)
MISTRAL_API_KEY=your-mistral-key-here
GROQ_API_KEY=your-groq-key-here
DEFAULT_EMBEDDING_PROVIDER=mistral
DEFAULT_AI_PROVIDER=groq
DEFAULT_MODEL=llama-3.3-70b-versatile

# Pinecone Configuration (Required)
PINECONE_API_KEY=your-pinecone-key-here
PINECONE_INDEX=youtube-qa
PINECONE_ENVIRONMENT=us-east-1-aws

# Optional: OpenAI (Fallback)
OPENAI_API_KEY=your-openai-key-here

# Optional: Claude (Alternative)
ANTHROPIC_API_KEY=your-claude-key-here
```

#### 4. Set Up Pinecone Index

1. Go to [Pinecone Console](https://app.pinecone.io)
2. Create new index:
   - **Name**: `youtube-qa`
   - **Dimensions**: `1024` (for Mistral) or `1536` (for OpenAI)
   - **Metric**: Cosine
   - **Cloud Provider**: Your choice (free tier available)

#### 5. Initialize Database

```bash
npx prisma generate
npx prisma migrate dev
```

#### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MISTRAL_API_KEY` | For FREE stack | - | Mistral AI API key for embeddings |
| `GROQ_API_KEY` | For FREE stack | - | Groq API key for Q&A |
| `PINECONE_API_KEY` | ✅ Yes | - | Pinecone API key for vector storage |
| `PINECONE_INDEX` | ✅ Yes | `youtube-qa` | Pinecone index name |
| `PINECONE_ENVIRONMENT` | ✅ Yes | - | Pinecone region |
| `DEFAULT_EMBEDDING_PROVIDER` | No | `mistral` | Embedding provider (mistral/openai) |
| `DEFAULT_AI_PROVIDER` | No | `groq` | Q&A provider (groq/openai/claude) |
| `DEFAULT_MODEL` | No | `llama-3.3-70b-versatile` | AI model name |
| `OPENAI_API_KEY` | Optional | - | OpenAI API key (fallback) |
| `ANTHROPIC_API_KEY` | Optional | - | Claude API key (alternative) |

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────┐
│              Video                      │
├─────────────────────────────────────────┤
│ id                 (PK, UUID)           │
│ youtubeUrl         (String?)           │
│ youtubeId          (String? UNIQUE)    │
│ title              (String)            │
│ description        (String?)           │
│ duration           (Int - seconds)     │
│ durationFormatted  (String)            │
│ thumbnail          (String?)           │
│ uploader           (String?)           │
│ language           (String)            │
│ status             (String)            │
│ errorMessage       (String?)           │
│ transcriptSource   (String?)           │
│ transcript         (String?)           │
│ summary            (String?)           │  ← AI-generated
│ uploadedAt         (DateTime)          │
│ processedAt        (DateTime?)         │
└──────────────┬──────────────────────────┘
               │ 1
               │
               │ N
┌──────────────▼──────────────────────────┐
│              Chunk                      │
├─────────────────────────────────────────┤
│ id                 (PK, UUID)           │
│ videoId            (FK → Video) CASCADE │  ← Deletes on video delete
│ chunkIndex         (Int)                │
│ text               (String)             │
│ startTime          (Int - seconds)      │
│ endTime            (Int - seconds)      │
│ timestamp          (String "MM:SS")     │
│ vectorId           (String? UNIQUE)     │  ← Pinecone vector ID
│ embeddingProvider  (String?)            │  ← mistral/openai tracking
│ createdAt          (DateTime)           │
└──────────────┬──────────────────────────┘
               │
               │
┌──────────────▼──────────────────────────┐
│            Analytics                    │
├─────────────────────────────────────────┤
│ id                 (PK, UUID)           │
│ videoId            (FK → Video) CASCADE │  ← Deletes on video delete
│ question           (String)             │
│ answer             (String)             │
│ responseTime       (Float - seconds)    │
│ provider           (String)             │  ← groq/openai/claude
│ model              (String)             │  ← llama-3.3-70b-versatile, etc
│ chunksUsed         (Int)                │
│ timestamp          (DateTime)           │
└─────────────────────────────────────────┘

Indexes:
• Video: status, youtubeId
• Chunk: videoId, vectorId, (videoId + chunkIndex UNIQUE)
• Analytics: videoId, timestamp, provider
```

### Key Relationships

1. **Video → Chunks**: One-to-Many with CASCADE delete
   - When a video is deleted, all its chunks are automatically removed
   - Each chunk links to Pinecone via `vectorId`

2. **Video → Analytics**: One-to-Many with CASCADE delete
   - When a video is deleted, all Q&A history is removed
   - Tracks which AI provider generated each answer

3. **Chunk → Pinecone**: One-to-One
   - Each chunk maps to one vector in Pinecone
   - `embeddingProvider` tracks which service created the embedding

---

## 📚 API Documentation

### Core Endpoints

#### 1. Validate Video
```http
GET /api/validate-video?url={youtube_url}
```

#### 2. Process Transcript
```http
POST /api/process-transcript
Body: { videoId, url }
```

#### 3. Generate Embeddings
```http
POST /api/embeddings
Body: { chunks, model?, provider? }
```

#### 4. Upload to Pinecone
```http
POST /api/upload-vectors
Body: { videoId, chunks, embeddings, embeddingProvider, metadata }
```

#### 5. Generate Summary
```http
POST /api/generate-summary
Body: { videoId }
```

#### 6. Ask Question (RAG)
```http
POST /api/qa
Body: { question, videoId?, provider?, model?, topK? }
```

#### 7. Get Video Details
```http
GET /api/videos/{id}
```

#### 8. Update Video
```http
PATCH /api/videos/{id}
Body: { transcript?, chunks?, summary?, status?, ... }
```

#### 9. Delete Video
```http
DELETE /api/videos/{id}
```
Deletes:
- Video record from SQLite
- All chunks (CASCADE)
- All analytics (CASCADE)
- All vectors from Pinecone

---

## 💰 Free Tier Setup

### 100% FREE Configuration

| Service | Free Tier | What It Provides |
|---------|-----------|------------------|
| **Mistral AI** | 1B tokens/month | Embeddings (1024 dimensions) |
| **Groq** | 14,400 requests/day | Q&A generation (Llama 3.3 70B) |
| **Pinecone** | 100K vectors | Vector storage & search |

### Cost Comparison: FREE vs PAID

**Per 45-minute video (~30 chunks):**

| Provider | FREE Stack | PAID Stack (OpenAI) |
|----------|------------|---------------------|
| Embeddings | $0.00 (Mistral) | $0.002 (OpenAI) |
| Q&A (100 questions) | $0.00 (Groq) | $0.05 (GPT-4o-mini) |
| Vector Storage | $0.00 (Pinecone free) | $0.00 (Pinecone free) |
| **Total** | **$0.00** | **~$0.052** |

**Monthly Example (50 videos, 5,000 questions):**
- FREE Stack: **$0/month** 🎉
- PAID Stack: ~$18.50 first month, ~$2.50/month after

### Getting Free API Keys

1. **Mistral AI**: [console.mistral.ai](https://console.mistral.ai) → Create API key
2. **Groq**: [console.groq.com](https://console.groq.com) → Get API key
3. **Pinecone**: [app.pinecone.io](https://app.pinecone.io) → Free tier, no credit card

---

## 🤝 Contributing

This is a proprietary project. See [LICENSE.md](LICENSE.md) for usage restrictions.

For bugs and feature requests, contact [@reachvivek](https://github.com/reachvivek).

---

## 📝 License

**Copyright © 2026 Vivek Kumar Singh (reachvivek)**

Custom Proprietary License - See [LICENSE.md](LICENSE.md)

**TL;DR:**
- ✅ Personal & educational use allowed
- ✅ Fork for learning (with attribution)
- ❌ Commercial use prohibited
- ❌ Redistribution prohibited

---

## 📧 Contact

**Vivek Kumar Singh (reachvivek)**

- 🔗 LinkedIn: [linkedin.com/in/reachvivek](https://linkedin.com/in/reachvivek)
- 💻 GitHub: [@reachvivek](https://github.com/reachvivek)
- 📸 Instagram: [@rogerthatvivek](https://instagram.com/rogerthatvivek)

---

<div align="center">

**Built with ❤️ by [Vivek Kumar Singh](https://github.com/reachvivek)**

⭐ Star this repo if you find it useful!

[Report Bug](https://github.com/reachvivek/QueryTube/issues) · [Request Feature](https://github.com/reachvivek/QueryTube/issues)

---

**© 2026 Vivek Kumar Singh (reachvivek). All rights reserved.**

QueryTube™ is a proprietary project.

</div>
