'use client';

import { motion } from 'framer-motion';

type TournamentCardProps = {
  title: string;
  platform: string;
  entryFee: number;
  currency: string;
  maxPlayers: number;
  currentPlayers: number;
};

export default function TournamentCard({
  title,
  platform,
  entryFee,
  currency,
  maxPlayers,
  currentPlayers,
}: TournamentCardProps) {
  const currencySymbol = currency === 'BRL' ? 'R$' : '$';
  const spotsLeft = maxPlayers - currentPlayers;

  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase text-accent">
          {platform}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm text-slate-400">
        <span>
          Taxa: {currencySymbol} {entryFee.toFixed(2)}
        </span>
        <span>•</span>
        <span>
          {currentPlayers}/{maxPlayers} jogadores
        </span>
      </div>

      {spotsLeft > 0 && spotsLeft <= 5 && (
        <p className="mb-3 text-xs font-medium text-yellow-400">
          Últimas {spotsLeft} vagas!
        </p>
      )}

      <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/80">
        Inscrever-se
      </button>
    </motion.div>
  );
}
