"use client";

import { useState } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

function SliderImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return <PlaceholderImage type="before-after" label={alt} className="absolute inset-0" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 768px"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "ДО",
  afterLabel = "ПОСЛЕ",
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-main">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-8">
          До и после
        </h2>

        <div className="relative max-w-3xl mx-auto aspect-[16/10] rounded-[var(--radius-card)] overflow-hidden select-none border border-border">
          {/* After image (full) */}
          <SliderImage src={afterImage} alt={afterLabel} />

          {/* Before image (clipped) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <SliderImage src={beforeImage} alt={beforeLabel} />
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none"
            style={{ left: `${position}%` }}
          >
            {/* Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <span className="text-bg text-xs font-bold">&lArr;&rArr;</span>
            </div>
          </div>

          {/* Range input (invisible, for touch) */}
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            aria-label="Сравнение до и после"
          />

          {/* Labels */}
          <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded z-10">
            ДО
          </span>
          <span className="absolute top-4 right-4 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded z-10">
            ПОСЛЕ
          </span>
        </div>

        {/* Description labels */}
        <div className="max-w-3xl mx-auto mt-4 flex justify-between text-sm text-text-secondary">
          <span>{beforeLabel}</span>
          <span>{afterLabel}</span>
        </div>
      </div>
    </section>
  );
}
