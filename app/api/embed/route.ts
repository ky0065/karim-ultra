import { prisma } from "@/lib/db";
import { embed } from "@/lib/embeddings";
import mammoth from "mammoth";
import pdf from "pdf-parse";

function chunkText(text: string, maxChars=2400) {
  const chunks: string[] = [];
  for (let i=0;i<text.length;i+=maxChars) chunks.push(text.slice(i,i+maxChars));
  return chunks;
}

async function extractFromFile(file: File): Promise<{title:string; text:string}> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name || "upload";
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) {
    const data = await pdf(buf);
    return { title: name, text: data.text || "" };
  } else if (lower.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer: buf });
    return { title: name, text: result.value || "" };
  } else {
    return { title: name, text: buf.toString("utf-8") };
  }
}

export async function GET() {
  const docs = await prisma.doc.findMany({ select: { id: true, title: true, createdAt: true } });
  return Response.json(docs);
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return new Response("No file", { status: 400 });
    const { title, text } = await extractFromFile(file);
    if (!text.trim()) return new Response("Empty file", { status: 400 });
    const parts = chunkText(text);
    const vecs = await embed(parts);
    const payload = parts.map((t, i) => ({ id: i, text: t, embedding: vecs[i] || [] }));
    const doc = await prisma.doc.create({ data: { title, text, chunks: payload } });
    return Response.json({ ok: true, id: doc.id });
  } else {
    const { title, text } = await req.json();
    if (!title || !text) return new Response("Missing title or text", { status: 400 });
    const parts = chunkText(text);
    const vecs = await embed(parts);
    const payload = parts.map((t, i) => ({ id: i, text: t, embedding: vecs[i] || [] }));
    const doc = await prisma.doc.create({ data: { title, text, chunks: payload } });
    return Response.json({ ok: true, id: doc.id });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return new Response("Missing id", { status: 400 });
  await prisma.doc.delete({ where: { id } });
  return Response.json({ ok: true });
}
