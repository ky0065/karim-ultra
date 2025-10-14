export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const apiKey  = process.env.OPENAI_API_KEY || "";
const model   = process.env.KARIM_MODEL || "gpt-4o-mini";

export async function* parseOpenAIStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content ?? "";
        if (delta) yield delta as string;
      } catch {}
    }
  }
}

export async function streamCompletion(messages: ChatMessage[]) {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({ model, stream: true, messages })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`LLM error: ${res.status} ${t}`);
  }
  return parseOpenAIStream(res.body as ReadableStream<Uint8Array>);
}
