"use client";
import { useState } from "react";
export default function CopyButton({ text, className="" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function onCopy(){
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 1200); } catch {}
  }
  return (
    <button onClick={onCopy} className={`text-xs px-2 py-1 border rounded ${className}`}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
