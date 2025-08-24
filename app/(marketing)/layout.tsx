import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/context/ThemeContext";
import EnvIndicator from "@/src/components/EnvIndicator";

export const metadata: Metadata = {
  title: "Chimer AI Tools",
  description: "Professional AI-powered image editing tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "AI 图片编辑工具",
    "image": "https://creamoda.com/images/logo.png",
    "description": "免费在线 AI 图片编辑工具，支持背景移除、图片增强、颜色变换、AI换装等专业图片处理功能。",
    "sku": "AI-IMG-EDIT-001",
    "brand": {
      "@type": "Brand",
      "name": "Creamoda"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "268"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "李明"
        },
        "datePublished": "2025-07-18",
        "reviewBody": "背景移除功能太好用了，一键就能去除背景，效果很自然，节省了我做电商图的大量时间。",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Anna"
        },
        "datePublished": "2025-06-25",
        "reviewBody": "AI 图片增强功能很强大，能让模糊的图片瞬间变清晰，颜色变换也很实用。",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <ThemeProvider>
        <EnvIndicator />
        {children}
      </ThemeProvider>
    </>
  );
}
