import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Detailing Place — Премиальный детейлинг в Казани";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
              height: 96,
              background: "#00F0FF",
              borderRadius: 4,
            }}
          />
          <span
            style={{
              fontSize: 36,
              color: "#A0A0A0",
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Detailing Place · Казань
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#F5F5F5",
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 1040,
            }}
          >
            Премиальный детейлинг
          </h1>
          <p
            style={{
              fontSize: 42,
              color: "#CCFF00",
              fontWeight: 700,
              margin: 0,
            }}
          >
            PPF · Керамика · Тонировка · Bi-LED
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#A0A0A0",
          }}
        >
          <span>dpkzn.ru</span>
          <span>Ямашева 7к1 · ежедневно 10–20</span>
        </div>
      </div>
    ),
    size,
  );
}
