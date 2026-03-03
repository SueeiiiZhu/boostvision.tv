import { ImageResponse } from "next/og";
import { getBlogPostBySlug } from "@/lib/strapi/api/blog";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function Image({ params }: Props) {
  const { slug, locale } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  const title = post?.title || "BoostVision Blog";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #0ea5e9 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.02em",
            opacity: 0.9,
          }}
        >
          BoostVision Blog
        </div>
        <div
          style={{
            display: "block",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: "100%",
            maxHeight: "220px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "inline-flex",
            fontSize: 26,
            fontWeight: 500,
            opacity: 0.9,
          }}
        >
          www.boostvision.tv
        </div>
      </div>
    ),
    size
  );
}
