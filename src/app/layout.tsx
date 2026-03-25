import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import { NavBar } from '@/components/NavBar';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vinitos — Your Wine Journal',
  description:
    'Log bottles, record tasting notes, discover similar wines, and build your personal wine journal.',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Toaster richColors position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
