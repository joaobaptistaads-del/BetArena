import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'NEX ARENA - Plataforma Profissional de Esports',
  description: 'Plataforma profissional para torneios competitivos de EA FC 26 com sistema de escrow seguro',
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
