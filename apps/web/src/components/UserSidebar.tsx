'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UserSidebar() {
  const [activeNav, setActiveNav] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', href: '/home' },
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'challenges', label: 'Challenges', href: '/challenges' },
    { id: 'tournaments', label: 'Tournaments', href: '/tournaments' },
    { id: 'rankings', label: 'Rankings', href: '/rankings' },
  ];

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '280px',
    height: '100vh',
    backgroundColor: '#000',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    zIndex: 1000,
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '900',
    color: '#fff',
    marginBottom: '48px',
    letterSpacing: '2px',
    fontFamily: 'Arial, sans-serif',
  };

  const navListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  };

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '12px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: isActive ? '#fff' : '#ccc',
    fontSize: '16px',
    fontWeight: isActive ? '600' : '500',
    backgroundColor: isActive ? '#111' : 'transparent',
    border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'block',
  });

  const navItemHoverStyle: React.CSSProperties = {
    backgroundColor: '#111',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
  };

  return (
    <nav style={sidebarStyle}>
      <div style={logoStyle}>ARENA</div>
      <ul style={navListStyle}>
        {navItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={() => setActiveNav(item.id)}
              style={navItemStyle(activeNav === item.id)}
              onMouseEnter={(e) => {
                if (activeNav !== item.id) {
                  Object.assign(e.currentTarget.style, navItemHoverStyle);
                }
              }}
              onMouseLeave={(e) => {
                if (activeNav !== item.id) {
                  Object.assign(e.currentTarget.style, navItemStyle(false));
                }
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div
        style={{
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '12px',
          color: '#999',
        }}
      >
        BetArena Platform
      </div>
    </nav>
  );
}
