'use client';

import UserSidebar from '../../../components/UserSidebar';

export default function DashboardPage() {
  const containerStyle: React.CSSProperties = {
    marginLeft: '280px',
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
    color: '#fff',
    padding: '32px',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '900',
    color: '#fff',
    marginBottom: '8px',
    fontFamily: 'Arial, sans-serif',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#999',
  };

  const sectionsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginTop: '32px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#111',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '24px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const cardHoverStyle: React.CSSProperties = {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: '#111',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  };

  const statBoxStyle: React.CSSProperties = {
    backgroundColor: '#111',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    padding: '20px',
    textAlign: 'center',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '900',
    color: '#fff',
    marginBottom: '4px',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #fff',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '16px',
    width: '100%',
  };

  const activityListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const activityItemStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#ccc',
    transition: 'all 0.3s ease',
  };

  return (
    <>
      <UserSidebar />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Dashboard</h1>
          <p style={subtitleStyle}>Welcome back to BetArena</p>
        </div>

        <div style={statsGridStyle}>
          <div style={statBoxStyle}>
            <div style={statValueStyle}>42</div>
            <div style={statLabelStyle}>Challenges</div>
          </div>
          <div style={statBoxStyle}>
            <div style={statValueStyle}>8,450</div>
            <div style={statLabelStyle}>ELO</div>
          </div>
          <div style={statBoxStyle}>
            <div style={statValueStyle}>68%</div>
            <div style={statLabelStyle}>Win Rate</div>
          </div>
        </div>

        <div style={sectionsContainerStyle}>
          <div
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <div style={cardTitleStyle}>Featured Challenge</div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '8px' }}>
                <strong>Counter-Strike 2</strong>
              </p>
              <p style={{ fontSize: '12px', color: '#999' }}>vs OpponentName</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>Prize: 50 USD</p>
            </div>
            <button style={buttonStyle} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.boxShadow = 'none';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.boxShadow = 'none';
            }}>
              Accept Challenge
            </button>
          </div>

          <div
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <div style={cardTitleStyle}>Active Tournaments</div>
            <p style={{ fontSize: '13px', color: '#ccc', marginBottom: '12px' }}>
              You are participating in 3 tournaments
            </p>
            <ul style={activityListStyle}>
              <li style={activityItemStyle}>FPS Masters - Quarterfinals</li>
              <li style={activityItemStyle}>Monthly Showdown - Group Stage</li>
              <li style={activityItemStyle}>Regional Cup - 2 days left</li>
            </ul>
            <button style={buttonStyle} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.boxShadow = 'none';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.boxShadow = 'none';
            }}>
              View All
            </button>
          </div>

          <div
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <div style={cardTitleStyle}>Recent Activity</div>
            <ul style={activityListStyle}>
              <li style={activityItemStyle}>Won match vs Player123 - 16:14</li>
              <li style={activityItemStyle}>Ranked up to Gold II</li>
              <li style={activityItemStyle}>Challenge accepted from ProPlayer</li>
              <li style={activityItemStyle}>Tournament advanced to semifinals</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
