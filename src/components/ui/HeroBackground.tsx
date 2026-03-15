"use client";

import { useState } from "react";
import Image from "next/image";

interface HeroBackgroundProps {
  src: string;
  alt: string;
}

/**
 * Client component for hero background images with graceful 404 handling.
 * When image doesn't exist yet, silently falls back to the gradient underneath.
 *
 * Image paths:
 *   Homepage:  /images/hero/home.webp
 *   Services:  /images/hero/{slug}.webp  (e.g. /images/hero/ppf.webp)
 *
 * Recommended size: 1920×1080, WebP or JPG, < 300 KB.
 */
export default function HeroBackground({ src, alt }: HeroBackgroundProps) {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      className="object-cover object-[65%_40%] md:object-[center_60%]"
      sizes="100vw"
      onError={() => setError(true)}
    />
  );
}
