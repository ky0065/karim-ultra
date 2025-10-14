"use client";
import ReactMarkdown from "react-markdown";
import hljs from "highlight.js";
import { useEffect } from "react";

export default function Markdown({ text }: { text: string }) {
  useEffect(() => {
    document.querySelectorAll("pre code").forEach((el: any) => hljs.highlightElement(el));
  }, [text]);
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({inline, className, children, ...props}: any){
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
              <pre>
                <code className={match ? `language-${match[1]}` : ""} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">{children}</code>
            );
          }
        }}
      >
        {text || ""}
      </ReactMarkdown>
    </div>
  );
}
