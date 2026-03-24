"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PortfolioGalleryProps {
  images: string[];
  car: string;
}

export default function PortfolioGallery({ images, car }: PortfolioGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  }, [lightboxIndex, images.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  }, [lightboxIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxIndex, goNext, goPrev]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev();
      else goNext();
    }
    setTouchStart(null);
  };

  return (
    <>
      {/* Grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className={`relative overflow-hidden rounded-[var(--radius-card)] border border-border cursor-pointer hover:border-text-secondary/30 transition-colors ${
              i === 0 ? "col-span-2 sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={img}
              alt={`${car} — фото ${i + 1}`}
              fill
              className="object-cover"
              sizes={i === 0 ? "(max-width: 768px) 100vw, 800px" : "(max-width: 640px) 50vw, 33vw"}
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X size={28} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/50 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 md:left-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full max-w-[90vw] max-h-[85vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${car} — фото ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 md:right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Следующее фото"
            >
              <ChevronRight size={36} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
