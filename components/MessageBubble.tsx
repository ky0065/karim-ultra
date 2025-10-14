"use client";
import Markdown from "@/components/Markdown";
import CopyButton from "@/components/CopyButton";
import clsx from "clsx";

export default function MessageBubble({ role, content }: { role: "user"|"assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={clsx("w-full flex mb-3", isUser ? "justify-end" : "justify-start")}>
      <div className={clsx("max-w-[80%] rounded-lg p-3 border", isUser ? "bg-neutral-200 dark:bg-neutral-800" : "bg-white dark:bg-neutral-950")}>
        {!isUser && (
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium opacity-70">Karim</div>
            <CopyButton text={content} />
          </div>
        )}
        {isUser ? <div className="whitespace-pre-wrap break-words">{content}</div> : <Markdown text={content} />}
      </div>
    </div>
  );
}
