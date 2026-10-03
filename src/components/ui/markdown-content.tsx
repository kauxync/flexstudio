"use client";

import { useMemo } from "react";
import { marked } from "marked";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  const html = useMemo(() => {
    if (!content) return "";
    try {
      return marked.parse(content, {
        breaks: true,
        gfm: true,
      }) as string;
    } catch (e) {
      console.error("[MarkdownRenderError]", e);
      return `<p>${content}</p>`;
    }
  }, [content]);

  return (
    <div
      className={cn(
        "markdown-content-body text-sm sm:text-base leading-relaxed text-muted-foreground",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
