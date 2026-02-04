'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type User = {
  id: string;
  email: string;
  username?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      if (!supabase) {
        console.warn('Supabase not initialized');
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error('Session check error:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Session found for:', session.user.email);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username,
            role: session.user.user_metadata?.role || 'player',
          });
        } else {
          console.log('❌ No session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', _event, !!session);
        
        if (!isMounted) return;

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username,
            role: session.user.user_metadata?.role || 'player',
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        isMounted = false;
        subscription?.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase não configurado');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }

    if (!data.session) {
      throw new Error('Não foi possível criar sessão. Verifique suas credenciais.');
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email!,
        username: data.user.user_metadata?.username,
        role: data.user.user_metadata?.role || 'player',
      });
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (!supabase) {
      throw new Error('Supabase não configurado');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role: 'player',
        },
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/home` : undefined,
      },
    });

    if (error) throw error;

    // Check if email confirmation is required
    if (data.user && !data.session) {
      throw new Error('Por favor, confirme seu email antes de fazer login.');
    }

    if (data.user && data.session) {
      setUser({
        id: data.user.id,
        email: data.user.email!,
        username,
        role: 'player',
      });
    }
  };

  const signOut = async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
