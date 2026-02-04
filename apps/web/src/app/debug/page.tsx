'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function DebugPage() {
  const { user, loading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<string>('checking...');

  useEffect(() => {
    const checkStatus = async () => {
      if (!supabase) {
        setSupabaseStatus('❌ Supabase não inicializado');
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setSupabaseStatus(`❌ Erro: ${error.message}`);
          setSessionInfo(null);
          return;
        }

        if (session) {
          setSupabaseStatus('✅ Sessão ativa');
          setSessionInfo({
            user: session.user.email,
            userId: session.user.id,
            expiresAt: session.expires_at,
            metadata: session.user.user_metadata,
          });
        } else {
          setSupabaseStatus('❌ Nenhuma sessão ativa');
          setSessionInfo(null);
        }
      } catch (err: any) {
        setSupabaseStatus(`❌ Erro ao verificar: ${err.message}`);
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-blue-400">🔍 Debug Auth</h1>

        {/* AuthContext Status */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">📍 AuthContext Status</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="text-slate-400">Loading:</span>
              <span className={loading ? 'text-yellow-400' : 'text-green-400'}>
                {' '}{loading ? '⏳ true' : '✅ false'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">User:</span>
              <span className={user ? 'text-green-400' : 'text-red-400'}>
                {' '}{user ? `✅ ${user.email}` : '❌ null'}
              </span>
            </div>
            {user && (
              <>
                <div>
                  <span className="text-slate-400">User ID:</span>
                  <span className="text-blue-400">{' '}{user.id}</span>
                </div>
                <div>
                  <span className="text-slate-400">Role:</span>
                  <span className="text-blue-400">{' '}{user.role}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Supabase Session Status */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🔐 Supabase Session</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="text-slate-400">Status:</span>
              <span className="text-blue-400">{' '}{supabaseStatus}</span>
            </div>
            {sessionInfo && (
              <>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <span className="text-green-400">{' '}{sessionInfo.user}</span>
                </div>
                <div>
                  <span className="text-slate-400">User ID:</span>
                  <span className="text-green-400">{' '}{sessionInfo.userId}</span>
                </div>
                <div>
                  <span className="text-slate-400">Expires At:</span>
                  <span className="text-green-400">{' '}{new Date(sessionInfo.expiresAt * 1000).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Local Storage Check */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">💾 LocalStorage</h2>
          <div className="space-y-2 font-mono text-xs break-all max-h-48 overflow-y-auto">
            {Object.entries(localStorage).map(([key, value]) => {
              if (key.includes('supabase') || key.includes('auth')) {
                try {
                  const parsed = JSON.parse(value);
                  return (
                    <div key={key} className="bg-slate-800 p-2 rounded">
                      <div className="text-blue-400 font-bold">{key}:</div>
                      <div className="text-slate-300">{JSON.stringify(parsed, null, 2)}</div>
                    </div>
                  );
                } catch {
                  return (
                    <div key={key} className="text-slate-400">
                      {key}: {value}
                    </div>
                  );
                }
              }
              return null;
            })}
            {Object.entries(localStorage).filter(([key]) => key.includes('supabase') || key.includes('auth')).length === 0 && (
              <div className="text-red-400">❌ Nenhum dado de autenticação no localStorage</div>
            )}
          </div>
        </div>

        {/* Environment Check */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">⚙️ Environment</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="text-slate-400">NEXT_PUBLIC_SUPABASE_URL:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-400' : 'text-red-400'}>
                {' '}{process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-400' : 'text-red-400'}>
                {' '}{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🎮 Ações</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-bold"
          >
            🔄 Recarregar página
          </button>
        </div>
      </div>
    </div>
  );
}
