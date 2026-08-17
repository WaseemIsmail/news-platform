import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/firestore";

export const alt = "Contextra article preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ArticleOpenGraphImage({ params }) {
  const { slug = "" } = await params;
  const article = await getArticleBySlug(slug);
  const title = article?.title || "Understand the story, not just the headline.";
  const category = article?.category || "News with context";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #020617 0%, #172033 62%, #334155 100%)",
          color: "white",
          padding: "64px 72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 34, fontWeight: 900 }}>Contextra</div>
          <div style={{ borderRadius: 999, background: "#f59e0b", color: "#020617", padding: "12px 22px", fontSize: 19, fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px" }}>
            {category}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1030 }}>
          <div style={{ color: "#fbbf24", fontSize: 20, fontWeight: 800, letterSpacing: "4px", textTransform: "uppercase" }}>
            Sourced reporting · Clear context
          </div>
          <div style={{ marginTop: 24, fontSize: title.length > 95 ? 48 : 58, lineHeight: 1.08, fontWeight: 900, letterSpacing: "-2px" }}>
            {title}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
