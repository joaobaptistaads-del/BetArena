'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('📝 Tentando fazer login com:', email);
      await signIn(email, password);
      console.log('✅ signIn bem-sucedido, aguardando 1.5s para sessão ser estabelecida...');
      
      // Aguarda mais tempo para garantir que a sessão foi salva e o contexto foi atualizado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('🚀 Redirecionando para /home...');
      router.replace('/home');
      
      // Se chegar aqui e não redirecionar, algo está muito errado
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      console.error('❌ Erro no login:', err);
      setError(err.message || 'Erro ao fazer login');
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="mb-6 text-3xl font-bold text-white">Entrar</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <motion.div
            className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Não tem conta?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </motion.div>
  );
}
