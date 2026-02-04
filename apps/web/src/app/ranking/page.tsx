'use client';

import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RankingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const mockRankings = [
    { position: 1, username: 'ProGamer2026', elo: 2450, wins: 156, losses: 23 },
    { position: 2, username: 'FC_Master', elo: 2380, wins: 142, losses: 31 },
    { position: 3, username: 'SkillKing', elo: 2310, wins: 128, losses: 28 },
    { position: 4, username: 'Champion99', elo: 2250, wins: 115, losses: 35 },
    { position: 5, username: 'ElitePlayer', elo: 2180, wins: 98, losses: 42 },
  ];

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-white">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Ranking Global</h1>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Posição</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Jogador</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">ELO</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Vitórias</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Derrotas</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockRankings.map((player, index) => {
                  const winRate = ((player.wins / (player.wins + player.losses)) * 100).toFixed(1);
                  return (
                    <motion.tr
                      key={player.username}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold ${
                            player.position === 1 ? 'text-yellow-500' :
                            player.position === 2 ? 'text-slate-400' :
                            player.position === 3 ? 'text-orange-600' :
                            'text-slate-500'
                          }`}>
                            #{player.position}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">{player.username}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-primary">{player.elo}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-green-500">{player.wins}</td>
                      <td className="px-6 py-4 text-center text-red-500">{player.losses}</td>
                      <td className="px-6 py-4 text-center text-slate-300">{winRate}%</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
