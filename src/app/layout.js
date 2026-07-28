import { Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import VisitorTracker from '@/components/VisitorTracker';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  metadataBase: new URL('https://BahijaPets.vercel.app'),
  title: 'BahijaPets - Best Pet Deals & Expert Reviews',
  description: 'Discover a rigorous selection of the best pet products available online. Expert reviews, pros/cons, and real-time updated prices.',
  openGraph: {
    title: 'BahijaPets - Best Pet Deals & Expert Reviews',
    description: 'Discover a rigorous selection of the best pet products available online. Expert reviews, pros/cons, and real-time updated prices.',
    url: 'https://bahijapets.vercel.app',
    siteName: 'BahijaPets',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://bahijapets.vercel.app/api/og',
        width: 1200,
        height: 630,
        alt: 'BahijaPets - Premium Pet Store',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BahijaPets - Best Pet Deals & Expert Reviews',
    description: 'Discover a rigorous selection of the best pet products available online.',
    images: ['https://bahijapets.vercel.app/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-7245366364935377'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const themeScript = `(function(){var h=new Date().getHours();var n=h>=19||h<7;document.documentElement.setAttribute('data-theme',n?'dark':'light');})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-7245366364935377" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7245366364935377"
          crossOrigin="anonymous"
        ></script>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
