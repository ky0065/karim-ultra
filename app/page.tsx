"use client";
import { useEffect, useState } from "react";
import "./globals.css";
import Header from "@/components/Header";
import DocsModal from "@/components/DocsModal";
import SettingsModal from "@/components/SettingsModal";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

export default function Page() {
  const [openSettings, setOpenSettings] = useState(false);
  const [openDocs, setOpenDocs] = useState(false);
  const [sessionId, setSessionId] = useState<string|null>(null);

  async function ensureSession() {
    const res = await fetch("/api/sessions");
    const list = await res.json();
    if (list.length) setSessionId(list[0].id);
    else {
      const created = await fetch("/api/sessions", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name: "First chat" }) }).then(r=>r.json());
      setSessionId(created.id);
    }
  }
  useEffect(() => { ensureSession(); }, []);

  function newSession(){ fetch("/api/sessions", { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name: "New chat" }) }).then(()=>ensureSession()); }

  if (!sessionId) return <main className="p-4">Loading…</main>;

  return (
    <main className="h-screen flex">
      <Sidebar current={sessionId} onSelect={(id)=>setSessionId(id)} />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-4">
        <Header onOpenSettings={()=>setOpenSettings(true)} onOpenDocs={()=>setOpenDocs(true)} onNewSession={newSession} />
        <div className="flex justify-end gap-2 mb-3">
          <a className="text-sm border rounded px-3 py-1" href={`/api/export?sessionId=${sessionId}&format=md`}>Export MD</a>
          <a className="text-sm border rounded px-3 py-1" href={`/api/export?sessionId=${sessionId}&format=txt`}>Export TXT</a>
        </div>
        <Chat sessionId={sessionId} />
        <SettingsModal open={openSettings} onClose={()=>setOpenSettings(false)} />
        <DocsModal open={openDocs} onClose={()=>setOpenDocs(false)} />
        <footer className="text-xs text-neutral-500 mt-4 text-center">Karim Ultra • SSE streaming • RAG • Multi-session</footer>
      </div>
    </main>
  );
}
