import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LabelZoom - Read Small Text Easily',
  description: 'Scan and read product labels with ease using LabelZoom',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className="min-h-screen pb-16">{children}</main>
          <Navigation />
        </body>
      </html>
    </ClerkProvider>
  );
} 