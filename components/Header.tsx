"use client";
export default function Header({ onOpenSettings, onOpenDocs, onNewSession }: { onOpenSettings: ()=>void; onOpenDocs: ()=>void; onNewSession: ()=>void }) {
  return (
    <header className="flex items-center justify-between py-3">
      <div className="text-xl font-semibold">Karim Ultra</div>
      <div className="flex items-center gap-2">
        <button className="border rounded px-3 py-1" onClick={onNewSession}>New chat</button>
        <button className="border rounded px-3 py-1" onClick={onOpenDocs}>Docs</button>
        <button className="border rounded px-3 py-1" onClick={onOpenSettings}>Settings</button>
      </div>
    </header>
  );
}
