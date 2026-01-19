# Utils Directory Structure

This directory contains all utility functions organized by functionality.

## 📁 Directory Organization

```
utils/
├── db/                     # Database utilities
│   ├── db.ts              # Prisma client configuration
│   └── chunking.ts        # Smart chunking for transcripts
│
├── ai/                     # AI utilities
│   ├── embeddings.ts      # Embedding generation (Mistral/OpenAI)
│   └── transcribe.ts      # Whisper transcription (Groq)
│
├── vector/                 # Vector database utilities
│   └── pinecone.ts        # Pinecone operations (upsert, query, delete)
│
├── youtube/                # YouTube utilities
│   └── youtube.ts         # YouTube video download & metadata
│
├── validation/             # Validation utilities
│   ├── validation.ts      # Server-side validation
│   └── client-validation.ts # Client-side validation
│
└── scripts/                # Maintenance scripts
    ├── clean-database.ts  # Database cleanup utility
    ├── create-pinecone-index.js # Pinecone index setup
    ├── reset-db.bat       # Database reset script (Windows)
    ├── swagger.yaml       # API documentation
    └── test-email.js      # Email testing utility
```

## 🔧 Usage Examples

### Database (Prisma Client)
```typescript
import prisma from '@/lib/db'; // Still in lib for compatibility
import { buildMacroChunks } from '@/utils/db/chunking';

// Create chunks from transcript segments
const chunks = buildMacroChunks(videoId, segments, 30, 8);
```

### AI Utilities
```typescript
import { generateEmbeddings } from '@/utils/ai/embeddings';
import { transcribeAudio } from '@/utils/ai/transcribe';

// Generate embeddings
const embeddings = await generateEmbeddings(texts, 'mistral');

// Transcribe audio file
const transcription = await transcribeAudio(audioFile);
```

### Vector Operations
```typescript
import {
  upsertVectors,
  queryVectors,
  deleteVectorsByVideoId
} from '@/utils/vector/pinecone';

// Upload vectors
await upsertVectors(vectors, 100);

// Query similar vectors
const results = await queryVectors(queryVector, 20, { videoId });

// Delete all vectors for a video
await deleteVectorsByVideoId(videoId);
```

### YouTube
```typescript
import { downloadVideo, getVideoMetadata } from '@/utils/youtube/youtube';

// Get video info
const metadata = await getVideoMetadata(youtubeUrl);

// Download video
const filePath = await downloadVideo(youtubeUrl);
```

### Validation
```typescript
import { validateArray, validateProvider } from '@/utils/validation/validation';
import { validateYouTubeUrl } from '@/utils/validation/client-validation';

// Server-side validation
const result = validateArray(data, 5000, "Invalid data");
const provider = validateProvider(input, ["mistral", "openai"]);

// Client-side validation
const isValid = validateYouTubeUrl(url);
```

## 📝 Notes

- **lib/db.ts** remains in `lib` for backward compatibility (Prisma client)
- **lib/auth.ts** and **lib/utils.ts** remain in `lib` (core Next.js utilities)
- All new utilities should be added to the appropriate subdirectory
- Update this README when adding new utility categories

## 🔄 Migration Status

✅ Database utilities moved to `utils/db/`
✅ AI utilities moved to `utils/ai/`
✅ Vector utilities centralized in `utils/vector/`
✅ YouTube utilities moved to `utils/youtube/`
✅ Validation utilities moved to `utils/validation/`
✅ Scripts organized in `utils/scripts/`
✅ Import paths updated across all API routes
