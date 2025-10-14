"use client";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble";

export default function Chat({ sessionId }: { sessionId: string }) {
  const [messages, setMessages] = useState<{role:"user"|"assistant"; content:string}[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); }, [messages]);

  async function send() {
    if (!input.trim() || busy) return;
    const userText = input;
    setInput("");
    setMessages(m => [...m, { role: "user", content: userText }, { role: "assistant", content: "" }]);
    setBusy(true);

    const useRag = (localStorage.getItem("karim_rag") !== "false");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: userText, sessionId, useRag })
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      acc += chunk;
      setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: acc };
        return copy;
      });
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col h-[75vh]">
      <div ref={listRef} className="flex-1 overflow-auto border rounded bg-white dark:bg-neutral-950 p-3">
        {messages.map((m, i) => <MessageBubble key={i} role={m.role} content={m.content} />)}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <input
          className="flex-1 border rounded px-3 py-2 bg-transparent"
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && send()}
          placeholder="Ask Karim anything..."
        />
        <button className="border rounded px-4 py-2" onClick={send} disabled={busy}>{busy ? "…" : "Send"}</button>
      </div>
    </div>
  );
}
