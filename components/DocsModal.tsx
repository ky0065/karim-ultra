"use client";
import { useEffect, useState } from "react";

export default function DocsModal({ open, onClose }: {open:boolean; onClose:()=>void}) {
  const [list, setList] = useState<{id:string; title:string; createdAt:string}[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File|null>(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch("/api/embed");
        const data = await res.json();
        setList(data);
      } catch {}
    })();
  }, [open]);

  async function addDoc() {
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      await fetch("/api/embed", { method: "POST", body: fd });
    } else if (title && text) {
      await fetch("/api/embed", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ title, text }) });
    } else return;
    setTitle(""); setText(""); setFile(null);
    const res = await fetch("/api/embed");
    setList(await res.json());
  }

  async function removeDoc(id: string) {
    await fetch("/api/embed", { method: "DELETE", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id }) });
    const res = await fetch("/api/embed");
    setList(await res.json());
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border rounded-lg w-full max-w-2xl p-4">
        <h2 className="text-lg font-semibold mb-3">Docs (RAG)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Add</h3>
            <input className="w-full border rounded px-3 py-2 mb-2 bg-transparent" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2 bg-transparent" rows={8} placeholder="Paste text or markdown..." value={text} onChange={e=>setText(e.target.value)} />
            <div className="mt-2 text-sm">Or upload a file:</div>
            <input type="file" className="mt-1" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
            <div className="mt-3 flex justify-end">
              <button className="border rounded px-3 py-1" onClick={addDoc}>Ingest</button>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Library</h3>
            <div className="max-h-80 overflow-auto space-y-2">
              {list.map(d => (
                <div key={d.id} className="border rounded p-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs opacity-60">{new Date(d.createdAt).toLocaleString()}</div>
                  </div>
                  <button className="text-sm border rounded px-2 py-1" onClick={()=>removeDoc(d.id)}>Delete</button>
                </div>
              ))}
              {list.length === 0 && <div className="text-sm opacity-70">No docs yet.</div>}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="border rounded px-3 py-1" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
