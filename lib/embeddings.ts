const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const apiKey  = process.env.OPENAI_API_KEY || "";
const embedModel = process.env.KARIM_EMBED_MODEL || "text-embedding-3-small";

export async function embed(texts: string[]): Promise<number[][]> {
  try {
    const res = await fetch(`${baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({ model: embedModel, input: texts })
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    return json.data.map((d: any) => d.embedding as number[]);
  } catch {
    return texts.map(() => []);
  }
}

export function cosineSim(a: number[], b: number[]): number {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i=0;i<a.length;i++){ dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
