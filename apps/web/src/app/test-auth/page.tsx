'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function TestAuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const testLogin = async () => {
    setOutput([]);
    addLog('🔧 Iniciando teste de login...');

    if (!supabase) {
      addLog('❌ Supabase não inicializado');
      return;
    }

    addLog(`📧 Email: ${email}`);
    addLog('🔐 Tentando autenticar...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        addLog(`❌ Erro de autenticação: ${error.message}`);
        return;
      }

      addLog('✅ Autenticação bem-sucedida!');
      addLog(`👤 User: ${data.user?.email}`);
      addLog(`🔑 User ID: ${data.user?.id}`);
      addLog(`📋 Session: ${data.session ? 'Ativa' : 'Nenhuma'}`);

      if (data.session) {
        addLog(`⏰ Expires at: ${new Date(data.session.expires_at! * 1000).toLocaleString()}`);
        addLog('💾 Salvando no localStorage...');
        
        // Forçar salvamento da sessão
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        addLog('✅ Sessão salva!');
      } else {
        addLog('⚠️ Nenhuma sessão retornada pelo Supabase!');
      }

      // Verificar session novamente
      addLog('🔍 Verificando sessão...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        addLog(`❌ Erro ao verificar sessão: ${sessionError.message}`);
      } else if (session) {
        addLog(`✅ Sessão confirmada: ${session.user.email}`);
      } else {
        addLog('❌ Nenhuma sessão ativa!');
      }

    } catch (err: any) {
      addLog(`❌ Erro: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-8">🧪 Teste de Autenticação</h1>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6 space-y-4">
          <div>
            <label className="block text-white mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white"
              placeholder="sua senha"
            />
          </div>

          <button
            onClick={testLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
          >
            🚀 Testar Login
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">📋 Saída:</h2>
          <div className="bg-black p-4 rounded font-mono text-xs text-green-400 max-h-96 overflow-y-auto space-y-1">
            {output.length === 0 ? (
              <div className="text-slate-500">Nenhuma saída ainda...</div>
            ) : (
              output.map((line, idx) => <div key={idx}>{line}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
