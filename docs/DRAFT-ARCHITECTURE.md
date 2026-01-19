# Draft Session Architecture

## Overview

Replaces localStorage-based session management with PostgreSQL-backed drafts.

---

## 🎯 Key Benefits

| Feature | Old (localStorage) | New (PostgreSQL) |
|---------|-------------------|------------------|
| **Cross-device** | ❌ No | ✅ Yes |
| **Shareable URLs** | ❌ No | ✅ Yes (`/new/abc-123`) |
| **Auto-save** | ⚠️ On change only | ✅ Every 2s + on change |
| **Dashboard visibility** | ❌ Hidden | ✅ "Drafts" tab |
| **Storage limit** | ⚠️ ~10MB | ✅ Unlimited |
| **Multiple drafts** | ⚠️ Last one only | ✅ Unlimited |
| **Survives refresh** | ✅ Yes | ✅ Yes |
| **Survives crashes** | ✅ Yes | ✅ Yes |

---

## 📊 Database Schema

```prisma
model Draft {
  id             String   @id @default(uuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])

  // Video information
  youtubeUrl     String?
  title          String?
  thumbnail      String?
  duration       Int?
  youtubeId      String?
  uploader       String?
  description    String?

  // Processing state
  currentStep    String   @default("upload")
  status         String   @default("draft")
  processingStatus String?

  // Transcript data (JSON)
  transcriptData   Json?
  transcriptSource String?

  // Linked video (when completed)
  videoId        String?  @unique

  // Timestamps
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  lastAccessedAt DateTime @default(now())

  @@index([userId])
  @@index([status])
  @@index([lastAccessedAt])
}
```

---

## 🔄 Complete Flow

### 1. User Visits `/pages/new`

```
User clicks "Create Knowledge Base"
        │
        ▼
GET /pages/new
        │
        ▼
POST /api/drafts
{
  title: "Untitled Knowledge Base",
  currentStep: "upload",
  status: "draft"
}
        │
        ▼
Returns: { draft: { id: "abc-123", ... } }
        │
        ▼
Redirect to: /pages/new/abc-123
```

### 2. User Works on Draft

```
/pages/new/abc-123
        │
        ▼
GET /api/drafts/abc-123
Returns: Draft state
        │
        ▼
Page renders with restored state
        │
        ▼
┌────────────────────────────────────┐
│ Auto-save every 2 seconds         │
│ PATCH /api/drafts/abc-123         │
│ {                                  │
│   currentStep: "knowledge",       │
│   videoInfo: {...},               │
│   transcriptData: {...},          │
│   lastAccessedAt: now()           │
│ }                                  │
└────────────────────────────────────┘
```

### 3. User Refreshes Page

```
User refreshes /pages/new/abc-123
        │
        ▼
GET /api/drafts/abc-123
        │
        ▼
Returns EXACT state from database
{
  currentStep: "knowledge",
  videoInfo: {...},
  transcriptData: {...}
}
        │
        ▼
Page restores EXACT state
✅ No data lost!
```

### 4. User Views Drafts in Dashboard

```
/pages/dashboard → Drafts tab
        │
        ▼
GET /api/drafts?status=draft
        │
        ▼
Returns all drafts for user:
[
  {
    id: "abc-123",
    title: "How I Built...",
    currentStep: "knowledge",
    lastAccessedAt: "2 hours ago"
  },
  {
    id: "def-456",
    title: "Understanding Quantum...",
    currentStep: "upload",
    lastAccessedAt: "1 day ago"
  }
]
        │
        ▼
Show cards with [Resume] buttons
        │
        ▼
Click Resume → /pages/new/abc-123
```

---

## 🛠️ Implementation

### API Endpoints

#### 1. `POST /api/drafts` - Create Draft
```typescript
// Request
{
  title: "My Video",
  youtubeUrl: "https://youtube.com/...",
  currentStep: "upload"
}

// Response
{
  success: true,
  draft: { id: "abc-123", ... },
  sessionUrl: "/pages/new/abc-123"
}
```

#### 2. `GET /api/drafts` - List Drafts
```typescript
// Query params: ?status=draft
// Response
{
  success: true,
  drafts: [...],
  total: 3
}
```

#### 3. `GET /api/drafts/[id]` - Get Draft
```typescript
// Response
{
  success: true,
  draft: {
    id: "abc-123",
    currentStep: "knowledge",
    videoInfo: {...},
    transcriptData: {...}
  }
}
```

#### 4. `PATCH /api/drafts/[id]` - Update Draft (Auto-save)
```typescript
// Request
{
  currentStep: "knowledge",
  processingStatus: "processed",
  transcriptData: {...},
  lastAccessedAt: "2026-01-19T05:00:00.000Z"
}

// Response
{
  success: true,
  draft: { ... }
}
```

#### 5. `DELETE /api/drafts/[id]` - Delete Draft
```typescript
// Response
{
  success: true,
  message: "Draft deleted successfully"
}
```

---

### Auto-save Hook

```typescript
import { useDraftAutoSave } from '@/hooks/useDraftAutoSave';

// In your component
const { saveNow } = useDraftAutoSave(
  {
    draftId,
    currentStep,
    youtubeUrl,
    videoInfo,
    videoId,
    processingStatus,
    transcriptData,
    transcriptSource,
    errorMessage,
  },
  {
    enabled: true,
    interval: 2000, // 2 seconds
    onSave: (success) => {
      if (success) {
        console.log('Auto-saved!');
      }
    },
    onError: (error) => {
      console.error('Auto-save failed:', error);
    },
  }
);

// Manual save when needed
await saveNow();
```

---

### Page Structure

```
app/
└── pages/
    └── new/
        ├── page.tsx               # Creates draft, redirects to [sessionId]
        └── [sessionId]/
            └── page.tsx           # Main knowledge base creation page
```

---

## 🔐 Security

### Authentication
- All draft endpoints require authentication
- Users can only access their own drafts
- Draft ownership verified on every request

### SQL Injection Protection
- Prisma ORM handles parameterization
- No raw SQL queries used

### XSS Protection
- JSON data sanitized before storage
- React escapes all user content

---

## 🚀 Migration from localStorage

### Step 1: Database Migration
```bash
npx prisma migrate dev --name add_draft_model
```

### Step 2: Update Code
1. Replace localStorage calls with API calls
2. Add `useDraftAutoSave` hook
3. Move to `/pages/new/[sessionId]` route

### Step 3: Data Migration (Optional)
```typescript
// Migrate existing localStorage drafts to database
async function migrateLoc alStorageDrafts() {
  const lastVideoId = localStorage.getItem("youtube-qa-last-video");
  if (!lastVideoId) return;

  const sessionKey = `youtube-qa-session-${lastVideoId}`;
  const savedSession = localStorage.getItem(sessionKey);
  if (!savedSession) return;

  const session = JSON.parse(savedSession);

  // Create draft in database
  const response = await fetch("/api/drafts", {
    method: "POST",
    body: JSON.stringify(session),
  });

  if (response.ok) {
    // Clear localStorage
    localStorage.removeItem("youtube-qa-last-video");
    localStorage.removeItem(sessionKey);
  }
}
```

---

## 📈 Performance

### Auto-save Optimization
- **Debounced**: Only saves if state changed
- **Skip if busy**: Won't queue multiple saves
- **Efficient**: Only sends changed fields

### Database Queries
- **Indexed**: `userId`, `status`, `lastAccessedAt`
- **Selective**: Only fetches needed fields
- **Cached**: Prisma connection pooling

---

## 🧪 Testing

### Manual Test Flow
1. Visit `/pages/new`
2. Create draft → redirected to `/pages/new/abc-123`
3. Enter YouTube URL
4. Refresh page → state restored ✅
5. Close tab → reopen → state restored ✅
6. Check dashboard → draft appears ✅
7. Click "Resume" → continues from exact step ✅

---

## 🐛 Troubleshooting

### Draft not saving
1. Check network tab for API errors
2. Verify authentication is working
3. Check database connection
4. Enable auto-save logging

### State not restoring
1. Check draft ID in URL
2. Verify draft exists in database
3. Check user ownership
4. Review `lastAccessedAt` timestamp

---

## 📝 Future Enhancements

- [ ] **Collaboration**: Share draft with team members
- [ ] **Version history**: Restore previous states
- [ ] **Auto-cleanup**: Delete old abandoned drafts
- [ ] **Offline support**: Queue saves when offline
- [ ] **Real-time sync**: WebSocket updates for collaboration
