"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const HERO_IMAGES = [
  { src: "/images/hero/home.webp", alt: "Детейлинг студия Detailing Place" },
  { src: "/images/hero/ppf.webp", alt: "Оклейка антигравийной плёнкой PPF" },
  { src: "/images/hero/polirovka.webp", alt: "Полировка и керамическое покрытие" },
  { src: "/images/hero/tonirovka.webp", alt: "Тонировка автомобиля" },
  { src: "/images/hero/antihrom.webp", alt: "Антихром — оклейка хрома в чёрный" },
];

export default function HeroSlideshow() {
  const [errors, setErrors] = useState<Set<number>>(new Set());

  return (
    <div className="absolute inset-0 w-full h-full">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1200}
        loop
        allowTouchMove={false}
        style={{ width: "100%", height: "100%" }}
      >
        {HERO_IMAGES.map((img, i) =>
          errors.has(i) ? null : (
            <SwiperSlide key={img.src} style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover object-[65%_40%] md:object-[center_60%]"
                sizes="100vw"
                onError={() => setErrors((prev) => new Set(prev).add(i))}
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
}
