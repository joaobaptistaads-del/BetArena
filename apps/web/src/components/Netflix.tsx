// Netflix-style reusable components
import React from 'react';

// Button component
export function NetflixButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-white text-black font-bold hover:bg-gray-200',
    secondary: 'bg-transparent border border-white text-white font-bold hover:bg-white hover:text-black',
    ghost: 'bg-transparent text-white font-bold hover:text-gray-300',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded transition-all duration-200 cursor-pointer`}
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

// Card component
export function NetflixCard({
  children,
  hover = true,
}: {
  children: React.ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '24px',
        transition: 'all 0.3s ease',
        cursor: hover ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </div>
  );
}

// Section component
export function NetflixSection({
  title,
  subtitle,
  children,
  background = 'black',
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  background?: 'black' | 'dark' | 'darker';
}) {
  const bgClasses = {
    black: '#000',
    dark: '#0a0a0a',
    darker: '#050505',
  };

  return (
    <section style={{ padding: '60px 40px', background: bgClasses[background] }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: '40px' }}>
          {title && <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '10px', color: '#fff' }}>{title}</h2>}
          {subtitle && <p style={{ fontSize: '1rem', color: '#999' }}>{subtitle}</p>}
          <div style={{ height: '2px', width: '40px', background: '#fff', marginTop: '15px' }} />
        </div>
      )}
      {children}
    </section>
  );
}

// Navbar component
export function NetflixNavbar({
  user,
  onLogout,
  links,
}: {
  user?: { email: string };
  onLogout?: () => void;
  links?: Array<{ label: string; href: string }>;
}) {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        background: 'rgba(0, 0, 0, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>ARENA</div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        {links?.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontSize: '0.9rem',
              color: '#999',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
          >
            {link.label}
          </a>
        ))}

        {user && (
          <>
            <span style={{ fontSize: '0.85rem', color: '#999' }}>{user.email}</span>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 20px',
                background: 'transparent',
                border: '1px solid #999',
                color: '#999',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fff';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#999';
                e.currentTarget.style.color = '#999';
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
