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
  // 结构化数据现在通过子页面的 StructuredDataEnhancer 组件统一管理

  return (
    <>

      <ThemeProvider>
        <EnvIndicator />
        {children}
      </ThemeProvider>
    </>
  );
}
