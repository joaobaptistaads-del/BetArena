'use client';

import { motion } from 'framer-motion';
import useGeoLocation from '../hooks/useGeoLocation';

export default function HomePage() {
  const { country, currency, locale, paymentHint } = useGeoLocation();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-3xl text-center">
        <motion.h1
          className="text-4xl font-bold text-white md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          BetArena
        </motion.h1>
        <p className="mt-4 text-lg text-slate-300">
          Plataforma para campeonatos EA FC 26 com pagamentos seguros e experiência gamer.
        </p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-left">
          <p className="text-sm uppercase text-slate-400">Contexto regional</p>
          <p className="mt-2 text-slate-200">
            País: {country ?? 'Detectando...'} | Moeda: {currency} | Idioma: {locale}
          </p>
          <p className="mt-2 text-slate-400">Pagamento em destaque: {paymentHint}</p>
        </div>
      </div>
    </main>
  );
}
