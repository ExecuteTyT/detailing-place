import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getBlogPost, getBlogPosts } from "@/lib/db/queries/content";

export const runtime = "nodejs";
export const alt = "Detailing Place — статья в блоге";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const heading = post?.title ?? "Блог Detailing Place";
  const category = post?.category ?? "Полезные статьи";
  const fontData = await readFile(join(process.cwd(), "public", "fonts", "Montserrat-Bold.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0E0E0E 0%, #1A1A2E 100%)",
          fontFamily: "Montserrat",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(0, 240, 255, 0.12)",
              border: "2px solid #00F0FF",
              borderRadius: 999,
              fontSize: 26,
              color: "#00F0FF",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            {category}
          </div>
        </div>

        <h1
          style={{
            fontSize: heading.length > 60 ? 60 : 76,
            fontWeight: 800,
            color: "#F5F5F5",
            lineHeight: 1.08,
            margin: 0,
            maxWidth: 1040,
          }}
        >
          {heading}
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 30,
            color: "#A0A0A0",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#CCFF00" }}>dpkzn.ru/blog</span>
          <span>Detailing Place · Казань</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Montserrat",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
