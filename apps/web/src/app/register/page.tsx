'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        setError('Authentication service not configured');
        setLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError) throw authError;

      if (data.session) {
        router.push('/dashboard');
      } else {
        // Email confirmation required
        setError('Check your email for confirmation link');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
            <Link href="/login" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#ccc')}>
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 16px 0' }}>Create Account</h1>
            <p style={{ color: '#999', fontSize: '14px', margin: '0' }}>Join Arena and start competing</p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: error.includes('email') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 38, 38, 0.1)', 
              border: error.includes('email') ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(220, 38, 38, 0.3)', 
              borderRadius: '4px', 
              color: error.includes('email') ? '#22c55e' : '#ef4444', 
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

            {/* Username Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose your username"
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

            {/* Confirm Password Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* Terms Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#fff'
                }}
              />
              <label htmlFor="terms" style={{ fontSize: '12px', color: '#999', cursor: 'pointer', margin: '0' }}>
                I agree to the Terms of Service
              </label>
            </div>

            {/* Create Account Button */}
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
                marginTop: '16px',
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Link */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <p style={{ color: '#999', fontSize: '14px', margin: '0' }}>
              Already have an account?{' '}
              <Link
                href="/login"
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
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
