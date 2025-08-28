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
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Creamoda | AI-Powered Fashion Design Platform',
    'description': 'Reimagine Fashion with All-in-One AI-powered Solution. Create, design, and transform fashion with our comprehensive AI tools: background removal, virtual try-on, outfit generation, and more.',
    'url': 'https://creamoda.ai',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://creamoda.ai/{search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    'mainEntity': {
      '@type': 'SoftwareApplication',
      'name': 'Creamoda AI Fashion Tools',
      'applicationCategory': 'DesignApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'description': 'Free credits for new users'
      }
    }
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
