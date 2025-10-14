"use client";
import { useEffect, useState } from "react";

export type Session = { id: string; name: string; createdAt: string };

export default function Sidebar({ current, onSelect }: { current?: string; onSelect: (id:string)=>void }) {
  const [list, setList] = useState<Session[]>([]);
  const [renameId, setRenameId] = useState<string|null>(null);
  const [renameVal, setRenameVal] = useState("");

  async function refresh(){
    const res = await fetch("/api/sessions");
    setList(await res.json());
  }
  useEffect(()=>{ refresh(); }, []);

  async function create(){
    await fetch("/api/sessions", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name: "New chat" }) });
    refresh();
  }
  async function remove(id: string){
    await fetch("/api/sessions", { method: "DELETE", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id }) });
    refresh();
  }
  async function rename(id: string, name: string){
    await fetch("/api/sessions", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id, name }) });
    setRenameId(null);
    refresh();
  }

  return (
    <aside className="w-64 border-r h-full p-3 bg-white/60 dark:bg-neutral-950/60">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Sessions</div>
        <button className="text-sm border rounded px-2 py-1" onClick={create}>New</button>
      </div>
      <div className="space-y-1 overflow-auto max-h-[70vh]">
        {list.map(s => (
          <div key={s.id} className={`flex items-center justify-between border rounded px-2 py-1 cursor-pointer ${current===s.id ? "bg-neutral-200 dark:bg-neutral-800" : ""}`}>
            {renameId===s.id ? (
              <input className="bg-transparent flex-1" value={renameVal} onChange={e=>setRenameVal(e.target.value)} onKeyDown={e=>e.key==="Enter" && rename(s.id, renameVal)} />
            ) : (
              <div onClick={()=>onSelect(s.id)} className="flex-1">{s.name}</div>
            )}
            <div className="flex gap-1 ml-2">
              {renameId===s.id ? (
                <button className="text-xs border rounded px-1" onClick={()=>rename(s.id, renameVal)}>Save</button>
              ) : (
                <button className="text-xs border rounded px-1" onClick={()=>{ setRenameId(s.id); setRenameVal(s.name); }}>Rename</button>
              )}
              <button className="text-xs border rounded px-1" onClick={()=>remove(s.id)}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
