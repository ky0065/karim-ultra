# Karim Ultra (TypeScript, Vercel-ready)

Features:
- Multi-session chat (create/rename/delete)
- SSE streaming chat
- Tailwind UI (dark/light)
- Markdown + code highlight + copy
- File uploads (PDF/DOCX/TXT) → RAG with embeddings
- Conversation export (MD/TXT)
- Prisma + SQLite (swap to Neon/Supabase for Vercel production)
- Path alias `@/*` via `tsconfig.json`

## Quickstart (local)
```bash
npm install
npx prisma generate
npx prisma migrate dev -n init
cp .env.example .env.local  # fill in keys
npm run dev
```

## Deploy to Vercel
- Set **Environment Variables**: `OPENAI_BASE_URL`, `OPENAI_API_KEY`, `KARIM_MODEL`, `KARIM_EMBED_MODEL`, `KARIM_SYSTEM_PROMPT`, `DATABASE_URL` (use a hosted Postgres/Neon or SQLite file via Vercel Blob).
- Add a **Prisma Generate** step in build (already covered by devDependency).

## Notes
- All API routes use **Node runtime** (required by Prisma + PDF/DOCX parsing).
- If your embedding endpoint is unavailable, RAG degrades gracefully.
- For very large files, consider chunked background jobs (queue) later.
