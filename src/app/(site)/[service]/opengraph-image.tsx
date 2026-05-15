import { ImageResponse } from "next/og";
import { getService, getAllServices } from "@/lib/db/queries/services";

export const runtime = "nodejs";
export const alt = "Detailing Place — услуга в Казани";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllServices().map((s) => ({ service: s.slug }));
}

interface Props {
  params: Promise<{ service: string }>;
}

export default async function Image({ params }: Props) {
  const { service: slug } = await params;
  const service = getService(slug);
  const heading = service?.h1 ?? "Detailing Place";

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
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 16,
              height: 80,
              background: "#00F0FF",
              borderRadius: 4,
            }}
          />
          <span
            style={{
              fontSize: 32,
              color: "#A0A0A0",
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Detailing Place · Казань
          </span>
        </div>

        <h1
          style={{
            fontSize: heading.length > 40 ? 72 : 88,
            fontWeight: 800,
            color: "#F5F5F5",
            lineHeight: 1.05,
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
            fontSize: 28,
            color: "#CCFF00",
            fontWeight: 700,
          }}
        >
          <span>dpkzn.ru</span>
          <span>Ответим за 15 минут</span>
        </div>
      </div>
    ),
    size,
  );
}
