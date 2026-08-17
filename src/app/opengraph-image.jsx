import { ImageResponse } from "next/og";

export const alt = "Contextra — Understand the story, not just the headline";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #020617 0%, #172033 65%, #334155 100%)",
          color: "white",
          padding: "68px 76px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px" }}>Contextra</div>
          <div style={{ display: "flex", border: "2px solid #f59e0b", borderRadius: 999, padding: "12px 22px", color: "#fbbf24", fontSize: 20, fontWeight: 700 }}>
            News with context
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
          <div style={{ color: "#fbbf24", fontSize: 22, fontWeight: 800, letterSpacing: "4px", textTransform: "uppercase" }}>Beyond the headline</div>
          <div style={{ marginTop: 22, fontSize: 68, lineHeight: 1.05, fontWeight: 900, letterSpacing: "-3px" }}>
            Understand the story, not just the headline.
          </div>
          <div style={{ marginTop: 28, color: "#cbd5e1", fontSize: 26, lineHeight: 1.35 }}>
            Sourced reporting, useful background, and clearly labelled analysis.
          </div>
        </div>
      </div>
    ),
    size
  );
}
