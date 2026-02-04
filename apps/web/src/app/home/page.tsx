'use client';

import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useGeoLocation from '../../hooks/useGeoLocation';
import TournamentCard from '../../components/TournamentCard';

type Tournament = {
  id: string;
  title: string;
  platform: string;
  entryFee: number;
  currency: string;
  maxPlayers: number;
  currentPlayers: number;
  prizePool: number;
  startDate: string;
  status: string;
};

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { currency } = useGeoLocation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'upcoming'>('open');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Mock data - substituir por chamada à API
    const mockTournaments: Tournament[] = [
      {
        id: '1',
        title: 'Campeonato Brasileiro EA FC 26',
        platform: 'PS5',
        entryFee: currency === 'BRL' ? 50 : 10,
        currency: currency,
        maxPlayers: 32,
        currentPlayers: 18,
        prizePool: currency === 'BRL' ? 1280 : 256,
        startDate: '2026-02-10T19:00:00Z',
        status: 'open',
      },
      {
        id: '2',
        title: 'Torneio Sul-Americano',
        platform: 'Xbox',
        entryFee: currency === 'BRL' ? 75 : 15,
        currency: currency,
        maxPlayers: 16,
        currentPlayers: 12,
        prizePool: currency === 'BRL' ? 960 : 192,
        startDate: '2026-02-08T20:00:00Z',
        status: 'open',
      },
      {
        id: '3',
        title: 'Copa Americas PC',
        platform: 'PC',
        entryFee: currency === 'BRL' ? 100 : 20,
        currency: currency,
        maxPlayers: 64,
        currentPlayers: 45,
        prizePool: currency === 'BRL' ? 5120 : 1024,
        startDate: '2026-02-12T18:00:00Z',
        status: 'open',
      },
      {
        id: '4',
        title: 'Liga Pro PS5',
        platform: 'PS5',
        entryFee: currency === 'BRL' ? 150 : 30,
        currency: currency,
        maxPlayers: 16,
        currentPlayers: 16,
        prizePool: currency === 'BRL' ? 1920 : 384,
        startDate: '2026-02-06T21:00:00Z',
        status: 'upcoming',
      },
    ];
    setTournaments(mockTournaments);
  }, [currency]);

  const filteredTournaments = tournaments.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-white">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Torneios Disponíveis</h1>
            <p className="text-slate-400">
              Inscreva-se em torneios competitivos e ganhe prêmios
            </p>
          </div>

          <div className="mb-8 flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'open'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Inscrições Abertas
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Em Breve
            </button>
          </div>

          {filteredTournaments.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-12 text-center">
              <p className="text-slate-400">Nenhum torneio encontrado nesta categoria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  title={tournament.title}
                  platform={tournament.platform}
                  entryFee={tournament.entryFee}
                  currency={tournament.currency}
                  maxPlayers={tournament.maxPlayers}
                  currentPlayers={tournament.currentPlayers}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
