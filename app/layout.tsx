import type { Metadata } from 'next';
import './globals.css';

// Centralised Configurations
import { constructMetadata } from '../config/metadata';

// Providers
import { QueryProvider } from '../providers/QueryProvider';
import { FirebaseProvider } from '../providers/FirebaseProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import { GeminiProvider } from '../providers/GeminiProvider';

// Centralised SEO Meta Tags Setup
export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning // Prevent warning from Theme hydration
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
        <QueryProvider>
          <FirebaseProvider>
            <ThemeProvider>
              <GeminiProvider>
                {children}
              </GeminiProvider>
            </ThemeProvider>
          </FirebaseProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
