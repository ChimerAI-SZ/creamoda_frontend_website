'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // 添加调试信息
  console.log('Google Analytics measurementId:', measurementId);
  
  if (!measurementId) {
    console.warn('Google Analytics: measurementId is empty');
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Analytics script loaded successfully');
        }}
        onError={(e) => {
          console.error('Google Analytics script failed to load:', e);
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href
          });
          console.log('Google Analytics initialized with ID: ${measurementId}');
        `}
      </Script>
    </>
  );
}