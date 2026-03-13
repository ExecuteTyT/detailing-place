"use client";

import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

export interface Review {
  author: string;
  rating: number;
  text: string;
  car?: string;
  date?: string;
}

interface ReviewsCarouselProps {
  reviews: Review[];
  className?: string;
}

const AVATAR_COLORS = [
  "bg-accent-gold/20 text-accent-gold",
  "bg-accent-gold/20 text-accent-gold",
  "bg-accent-whatsapp/20 text-accent-whatsapp",
  "bg-purple-500/20 text-purple-400",
  "bg-orange-500/20 text-orange-400",
];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function ReviewsCarousel({ reviews, className }: ReviewsCarouselProps) {
  if (reviews.length === 0) return null;

  return (
    <section className={cn("section-padding section-warm section-spotlight", className)}>
      <div className="container-main">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-8">
            Отзывы клиентов
          </h2>
        </AnimatedSection>

        <AnimatedSection>
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 20 },
          }}
          touchRatio={1.5}
          resistance={true}
          resistanceRatio={0.85}
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="card card-glow-top p-5 h-full flex flex-col relative overflow-hidden">
                {/* Decorative quote mark */}
                <Quote
                  size={64}
                  className="absolute -top-1 -right-1 text-accent-gold/5 rotate-180"
                  strokeWidth={1}
                />

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={20}
                      className={cn(
                        s < review.rating
                          ? "text-accent-gold fill-accent-gold"
                          : "text-border/40"
                      )}
                    />
                  ))}
                </div>

                <p className="text-sm text-text-secondary leading-relaxed flex-1 relative z-10">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
                  {/* Avatar circle */}
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    AVATAR_COLORS[i % AVATAR_COLORS.length]
                  )}>
                    {getInitials(review.author)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{review.author}</p>
                    {review.car && (
                      <p className="text-xs text-text-secondary">{review.car}</p>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </AnimatedSection>

        <AnimatedSection>
        <div className="text-center mt-6">
          <Button
            variant="secondary"
            size="md"
            href="https://yandex.ru/maps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Все отзывы на Яндекс.Картах
          </Button>
        </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
