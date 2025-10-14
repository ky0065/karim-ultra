import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId") || "";
  const format = (searchParams.get("format") || "md").toLowerCase();

  const s = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { messages: { orderBy: { createdAt: "asc" } } }
  });
  if (!s) return new Response("Not found", { status: 404 });

  const title = `Karim Chat - ${s.name}`;
  // Cast messages array to any[] and type parameter to avoid implicit any errors
  const lines = (s.messages as any[]).map((m: any) => "**" + m.role + "**: " + m.content);
  const md = `# ${title}\n\n${lines.join("\n\n")}`;
  const txt = `${title}\n\n` + (s.messages as any[]).map((m: any) => m.role.toUpperCase() + ": " + m.content).join("\n\n");

  const body = format === "txt" ? txt : md;
  return new Response(body, {
    headers: {
      "Content-Type": format === "txt" ? "text/plain" : "text/markdown",
      "Content-Disposition": `attachment; filename=\"karim_${s.id}.${format}\"`
    }
  });
}
