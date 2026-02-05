'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!supabase) {
        setError('Authentication service not configured');
        setLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid #222', padding: '16px 0' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '2px' }}>
            ARENA
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/register" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#ccc')}>
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 16px 0' }}>Sign In</h1>
            <p style={{ color: '#999', fontSize: '14px', margin: '0' }}>Enter your credentials to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: 'rgba(220, 38, 38, 0.1)', 
              border: '1px solid rgba(220, 38, 38, 0.3)', 
              borderRadius: '4px', 
              color: '#ef4444', 
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #222',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  caretColor: '#fff'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#555';
                  e.currentTarget.style.backgroundColor = '#111';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#222';
                  e.currentTarget.style.backgroundColor = '#0a0a0a';
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #222',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  caretColor: '#fff'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#555';
                  e.currentTarget.style.backgroundColor = '#111';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#222';
                  e.currentTarget.style.backgroundColor = '#0a0a0a';
                }}
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: loading ? '#999' : '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Link */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <p style={{ color: '#999', fontSize: '14px', margin: '0' }}>
              Don't have an account?{' '}
              <Link
                href="/register"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.2s ease',
                  borderBottom: '1px solid transparent',
                  paddingBottom: '2px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderBottomColor = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderBottomColor = 'transparent';
                }}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
