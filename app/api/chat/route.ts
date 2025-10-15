import { prisma } from "@/lib/db";
import { basicModerationCheck } from "@/lib/moderation";
import { streamCompletion, ChatMessage } from "@/lib/llm";
import { embed, cosineSim } from "@/lib/embeddings";

export const runtime = "nodejs";

async function retrieveTopContext(query: string, k=5) {
  const [qvec] = await embed([query]);
  if (!qvec?.length) return "";
  const docs = await prisma.doc.findMany({});
  const scored: {score:number; text:string; title:string}[] = [];
  for (const d of docs) {
      const  chunks: any[] = typeof d.chunks === "string" ? (d.chunks ? JSON.parse(d.chunks) : []) : (d.chunks as any[]);

      
    for (const ch of chunks) {

      const score = cosineSim(qvec, ch.embedding || []);
      scored.push({ score, text: ch.text, title: d.title });
    }
  }
  scored.sort((a,b)=>b.score-a.score);
  return scored.slice(0,k).map(s => `# ${s.title}\n${s.text}`).join("\n\n");
}

export async function POST(req: Request) {
  const { userMessage, sessionId, useRag = true } = await req.json() as {userMessage:string; sessionId:string; useRag?:boolean};
  if (!sessionId) return new Response("Missing sessionId", { status: 400 });
  if (!basicModerationCheck(userMessage || "")) return new Response("Message blocked by moderation.", { status: 400 });

  const systemPrompt = process.env.KARIM_SYSTEM_PROMPT || "You are Karim, a helpful, concise AI assistant. Be friendly, pragmatic, and solution-oriented.";

  const history = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    take: 50
  });

  const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }];
  if (useRag) {
    const ctx = await retrieveTopContext(userMessage, 5);
    if (ctx) messages.unshift({ role: "system", content: "Use this context if relevant. If irrelevant, ignore it.\n\n" + ctx });
  }
  for (const m of history) messages.push({ role: m.role as any, content: m.content });
  messages.push({ role: "user", content: userMessage });

  await prisma.message.create({ data: { role: "user", content: userMessage, sessionId } });

  const encoder = new TextEncoder();
  let full = "";
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const token of await streamCompletion(messages)) {
          full += token;
          controller.enqueue(encoder.encode(token));
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      } finally {
        try { await prisma.message.create({ data: { role: "assistant", content: full, sessionId } }); } catch {}
      }
    }
  });

  return new Response(stream, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
