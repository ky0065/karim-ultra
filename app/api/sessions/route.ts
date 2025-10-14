import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const list = await prisma.session.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(list);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const s = await prisma.session.create({ data: { name: name || "New Chat" } });
  return Response.json(s);
}

export async function PATCH(req: Request) {
  const { id, name } = await req.json();
  const s = await prisma.session.update({ where: { id }, data: { name } });
  return Response.json(s);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.session.delete({ where: { id } });
  return Response.json({ ok: true });
}
