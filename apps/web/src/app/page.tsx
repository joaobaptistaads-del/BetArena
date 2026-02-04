'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-white">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-white md:text-7xl mb-6">
            BetArena
          </h1>
          <p className="text-xl text-slate-300 mb-4">
            Plataforma de Torneios EA FC 26
          </p>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Participe de campeonatos competitivos com pagamentos seguros via Pix, Mercado Pago, PayPal e Stripe. 
            Sistema de escrow garante prêmios aos vencedores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:scale-105"
            >
              Começar Agora
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-lg border border-white/20 bg-slate-800/50 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-slate-800 hover:scale-105"
            >
              Já tenho conta
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="rounded-xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-4 text-4xl">🎮</div>
              <h3 className="mb-2 text-xl font-bold text-white">EA FC 26</h3>
              <p className="text-slate-400">
                Torneios exclusivos para PlayStation, Xbox e PC
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="mb-4 text-4xl">💰</div>
              <h3 className="mb-2 text-xl font-bold text-white">Pagamentos Seguros</h3>
              <p className="text-slate-400">
                Sistema de escrow garante prêmios aos vencedores
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="mb-4 text-4xl">🏆</div>
              <h3 className="mb-2 text-xl font-bold text-white">Rankings</h3>
              <p className="text-slate-400">
                Sistema ELO e rankings competitivos por região
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
