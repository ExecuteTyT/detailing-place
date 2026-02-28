"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SEOTextProps {
  html: string;
  className?: string;
}

export default function SEOText({ html, className }: SEOTextProps) {
  const [expanded, setExpanded] = useState(false);

  // Strip HTML for truncation check
  const textContent = html.replace(/<[^>]*>/g, "");
  const needsTruncation = textContent.length > 200;

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-main max-w-3xl">
        <div
          className={cn(
            "prose prose-invert prose-sm md:prose-base max-w-none",
            "prose-headings:font-display prose-headings:text-text",
            "prose-p:text-text-secondary prose-a:text-accent-cyan",
            !expanded && needsTruncation && "md:line-clamp-none line-clamp-[4] overflow-hidden"
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {needsTruncation && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-3 text-sm text-accent-cyan hover:underline md:hidden cursor-pointer min-h-[44px]"
          >
            Читать далее
          </button>
        )}
      </div>
    </section>
  );
}
