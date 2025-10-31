import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kanban To-Do Dashboard',
  description: 'A modern Kanban board for managing tasks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
