import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brand Intelligence',
  description: 'Generate Brand Visibility Snapshots and Sales Starter Kits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

