import type { Metadata } from 'next';
import './globals.css';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'RecallForge - AI-Powered Flashcards for Kids',
  description: 'Transform CSV flashcards into fun, AI-generated multiple choice tests for elementary school students.',
  keywords: 'flashcards, education, kids, elementary school, AI, learning, COPPA compliant',
  authors: [{ name: 'RecallForge Team' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Child-safe meta tags */}
        <meta name="child-safety" content="coppa-compliant" />
        <meta name="content-rating" content="general" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Open+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-child antialiased bg-child-50 min-h-screen">
        <ErrorBoundary level="critical">
          <div className="min-h-screen flex flex-col">
            <Header variant="landing" />
            <main className="flex-1">
              {children}
            </main>
            <Footer variant="landing" />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}