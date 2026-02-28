"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { WorkExample } from "@/lib/services";
import Badge from "@/components/ui/Badge";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

function WorkImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return <PlaceholderImage type="work" className="absolute inset-0" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 33vw"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

interface WorkExamplesProps {
  works: WorkExample[];
  title?: string;
  moreLink?: string;
  className?: string;
}

export default function WorkExamples({
  works,
  title = "Примеры работ",
  moreLink = "/portfolio",
  className,
}: WorkExamplesProps) {
  if (works.length === 0) return null;

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-main">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-8">
            {title}
          </h2>
        </AnimatedSection>

        <AnimatedSection>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            768: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          touchRatio={1.5}
          resistance={true}
          resistanceRatio={0.85}
          freeMode={true}
        >
          {works.map((work, i) => (
            <SwiperSlide key={i}>
              <div className="card card-glow-top overflow-hidden">
                <div className="relative aspect-video">
                  <WorkImage
                    src={work.image}
                    alt={`${work.car} — ${work.tags.join(", ")}`}
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-text">{work.car}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {work.tags.map((tag) => (
                      <Badge key={tag} variant="popular">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* "See more" slide */}
          {moreLink && (
            <SwiperSlide>
              <Link
                href={moreLink}
                className="card card-glow-top flex items-center justify-center aspect-video text-accent-cyan font-bold text-lg hover:bg-bg-hover hover:shadow-[var(--shadow-glow-cyan)] transition-all"
              >
                Все работы &rarr;
              </Link>
            </SwiperSlide>
          )}
        </Swiper>
        </AnimatedSection>
      </div>
    </section>
  );
}
