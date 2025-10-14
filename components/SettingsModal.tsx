"use client";
import { useEffect, useState } from "react";

export default function SettingsModal({ open, onClose }: {open:boolean; onClose:()=>void}) {
  const [model, setModel] = useState("");
  const [rag, setRag] = useState(true);
  const [sys, setSys] = useState("");

  useEffect(() => {
    if (open) {
      setModel(localStorage.getItem("karim_model") || "");
      setRag(localStorage.getItem("karim_rag") !== "false");
      setSys(localStorage.getItem("karim_sys") || "");
    }
  }, [open]);

  function save() {
    if (model) localStorage.setItem("karim_model", model);
    localStorage.setItem("karim_rag", String(rag));
    if (sys) localStorage.setItem("karim_sys", sys);
    onClose();
    location.reload();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border rounded-lg w-full max-w-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Settings</h2>
        <div className="space-y-3">
          <label className="block">
            <div className="text-sm mb-1">Override Model (optional)</div>
            <input className="w-full border rounded px-3 py-2 bg-transparent" value={model} onChange={e=>setModel(e.target.value)} placeholder="e.g. gpt-4o-mini or llama3.1:8b-instruct" />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={rag} onChange={e=>setRag(e.target.checked)} />
            <span>Enable RAG retrieval</span>
          </label>
          <label className="block">
            <div className="text-sm mb-1">System Prompt (Karim persona)</div>
            <textarea className="w-full border rounded px-3 py-2 bg-transparent" rows={5} value={sys} onChange={e=>setSys(e.target.value)} placeholder="Custom system prompt..." />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="border rounded px-3 py-1" onClick={onClose}>Cancel</button>
          <button className="border rounded px-3 py-1" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
