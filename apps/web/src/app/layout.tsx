import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'BetArena',
  description: 'Plataforma de campeonatos eSports e fintech gamer.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
