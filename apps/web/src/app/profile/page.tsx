'use client';

import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-white">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Meu Perfil</h1>

          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Informações da Conta</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400">Nome de usuário</p>
                  <p className="text-white">{user.username || 'Não definido'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Tipo de conta</p>
                  <p className="text-white capitalize">{user.role || 'player'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Estatísticas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-slate-400">Torneios</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">0</p>
                  <p className="text-sm text-slate-400">Vitórias</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-400">0</p>
                  <p className="text-sm text-slate-400">Derrotas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-500">1000</p>
                  <p className="text-sm text-slate-400">ELO</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Carteira</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Saldo disponível</p>
                  <p className="text-3xl font-bold text-white">R$ 0,00</p>
                </div>
                <button className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90">
                  Adicionar Fundos
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
