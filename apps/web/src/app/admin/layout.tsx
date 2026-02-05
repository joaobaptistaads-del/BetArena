'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!supabase) {
          router.push('/login');
          return;
        }

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        if (!userId) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (profile?.role !== 'admin') {
          router.push('/home');
          return;
        }

        setLoading(false);
      } catch {
        router.push('/home');
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Tournaments', href: '/admin/tournaments' },
    { label: 'Payments', href: '/admin/payments' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#0a0a0a',
          borderRight: '1px solid #222',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid #222',
          }}
        >
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            ARENA
          </h1>
          <p
            style={{
              fontSize: '12px',
              color: '#999',
              margin: '4px 0 0 0',
              letterSpacing: '1px',
            }}
          >
            ADMIN PANEL
          </p>
        </div>

        {/* Menu Items */}
        <nav
          style={{
            flex: 1,
            padding: '16px 0',
          }}
        >
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    padding: '12px 20px',
                    color: active ? '#fff' : '#ccc',
                    backgroundColor: active ? '#111' : 'transparent',
                    borderLeft: active ? '3px solid #fff' : 'none',
                    paddingLeft: active ? '17px' : '20px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid #1a1a1a',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#111';
                      (e.currentTarget as HTMLElement).style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#ccc';
                    }
                  }}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #222',
            fontSize: '12px',
            color: '#666',
          }}
        >
          <p style={{ margin: 0 }}>BetArena Admin</p>
          <p style={{ margin: '4px 0 0 0' }}>v1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: '280px',
          flex: 1,
          backgroundColor: '#000',
          color: '#fff',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
