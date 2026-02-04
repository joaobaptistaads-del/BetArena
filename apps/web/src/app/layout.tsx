import type { ReactNode } from 'react';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Header from '../components/Header';

export const metadata = {
  title: 'BetArena - Plataforma de Torneios EA FC 26',
  description: 'Campeonatos seguros de EA FC 26 com pagamentos via Pix, Mercado Pago, PayPal e Stripe',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
