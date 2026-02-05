'use client';

import { useEffect, useState } from 'react';
import UserSidebar from '../../../components/UserSidebar';
import { supabase } from '../../../lib/supabase';

export default function ChallengesPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    opponent: '',
    game: 'Counter-Strike 2',
    prize: '',
    date: '',
  });
  const [games, setGames] = useState<{ id: string; name: string }[]>([]);

  const containerStyle: React.CSSProperties = {
    marginLeft: '280px',
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
    color: '#fff',
    padding: '32px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '900',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  };

  const createButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #fff',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  };

  const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    backgroundColor: '#111',
    color: isActive ? '#fff' : '#ccc',
    border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  });

  const challengesGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  };

  const challengeCardStyle: React.CSSProperties = {
    backgroundColor: '#111',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  };

  const challengeCardHoverStyle: React.CSSProperties = {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
  };

  const cardHeaderStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  };

  const opponentNameStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px',
  };

  const gameNameStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#999',
  };

  const cardBodyStyle: React.CSSProperties = {
    padding: '20px',
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '13px',
  };

  const infoLabelStyle: React.CSSProperties = {
    color: '#999',
  };

  const infoValueStyle: React.CSSProperties = {
    color: '#fff',
    fontWeight: '600',
  };

  const statusBadgeStyle = (status: string): React.CSSProperties => {
    const colors: { [key: string]: string } = {
      pending: '#ffa500',
      active: '#00d9ff',
      finished: '#999',
    };
    return {
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: `${colors[status] || '#999'}20`,
      color: colors[status] || '#999',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      border: `1px solid ${colors[status] || '#999'}40`,
    };
  };

  const buttonsRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  };

  const actionButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #fff',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const mockChallenges = [
    {
      id: 1,
      opponent: 'ProPlayer123',
      game: 'Counter-Strike 2',
      prize: 50,
      date: '2025-02-05',
      status: 'pending',
    },
    {
      id: 2,
      opponent: 'EsportsKing',
      game: 'Valorant',
      prize: 75,
      date: '2025-02-04',
      status: 'active',
    },
    {
      id: 3,
      opponent: 'SilverStrike',
      game: 'Call of Duty',
      prize: 100,
      date: '2025-02-03',
      status: 'finished',
    },
    {
      id: 4,
      opponent: 'GoldenAim',
      game: 'Counter-Strike 2',
      prize: 50,
      date: '2025-02-06',
      status: 'pending',
    },
    {
      id: 5,
      opponent: 'NeonGhost',
      game: 'Valorant',
      prize: 60,
      date: '2025-02-02',
      status: 'finished',
    },
    {
      id: 6,
      opponent: 'ThunderStorm',
      game: 'Dota 2',
      prize: 120,
      date: '2025-02-05',
      status: 'active',
    },
  ];

  const [challenges, setChallenges] = useState(mockChallenges);

  useEffect(() => {
    const loadData = async () => {
      if (!supabase) return;

      const { data: gamesData } = await supabase
        .from('games')
        .select('id, name')
        .eq('active', true);

      if (gamesData) {
        setGames(gamesData);
      }

      const { data: challengesData } = await supabase
        .from('challenges')
        .select('id, opponent_username, prize, status, scheduled_at, games(name)')
        .order('created_at', { ascending: false });

      if (challengesData) {
        const mapped = challengesData.map((c: any) => ({
          id: c.id,
          opponent: c.opponent_username,
          game: c.games?.name || 'Unknown',
          prize: Number(c.prize || 0),
          date: c.scheduled_at ? String(c.scheduled_at).slice(0, 10) : '',
          status: c.status || 'pending',
        }));
        setChallenges(mapped);
      }
    };

    loadData();
  }, []);

  const handleCreateChallenge = async () => {
    if (!createForm.opponent || !createForm.prize || !createForm.date) return;

    if (!supabase) {
      const newChallenge = {
        id: Date.now(),
        opponent: createForm.opponent,
        game: createForm.game,
        prize: Number(createForm.prize),
        date: createForm.date,
        status: 'pending',
      } as const;
      setChallenges([newChallenge, ...challenges]);
      setCreateForm({ opponent: '', game: 'Counter-Strike 2', prize: '', date: '' });
      setShowCreate(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const selectedGame = games.find((g) => g.name === createForm.game) || games[0];
    if (!selectedGame) return;

    const { data } = await supabase
      .from('challenges')
      .insert({
        challenger_id: userId,
        opponent_username: createForm.opponent,
        game_id: selectedGame.id,
        prize: Number(createForm.prize),
        status: 'pending',
        scheduled_at: createForm.date,
      })
      .select('id, opponent_username, prize, status, scheduled_at, games(name)')
      .single();

    if (data) {
      const mapped = {
        id: data.id,
        opponent: data.opponent_username,
        game: data.games?.name || createForm.game,
        prize: Number(data.prize || 0),
        date: data.scheduled_at ? String(data.scheduled_at).slice(0, 10) : createForm.date,
        status: data.status || 'pending',
      };
      setChallenges([mapped, ...challenges]);
    }

    setCreateForm({ opponent: '', game: 'Counter-Strike 2', prize: '', date: '' });
    setShowCreate(false);
  };

  const filteredChallenges =
    filterStatus === 'all'
      ? challenges
      : challenges.filter((c) => c.status === filterStatus);

  return (
    <>
      <UserSidebar />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Challenges</h1>
          <button
            style={createButtonStyle}
            onClick={() => setShowCreate((v) => !v)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
            }}
          >
            {showCreate ? 'Close' : 'Create Challenge'}
          </button>
        </div>

        {showCreate && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <input
                type="text"
                placeholder="Opponent username"
                value={createForm.opponent}
                onChange={(e) => setCreateForm({ ...createForm, opponent: e.target.value })}
                style={{ background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '10px 12px', borderRadius: '4px' }}
              />
              <select
                value={createForm.game}
                onChange={(e) => setCreateForm({ ...createForm, game: e.target.value })}
                style={{ background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '10px 12px', borderRadius: '4px' }}
              >
                {(games.length ? games : [{ id: 'local', name: 'Counter-Strike 2' }]).map((g) => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Prize (R$)"
                value={createForm.prize}
                onChange={(e) => setCreateForm({ ...createForm, prize: e.target.value })}
                style={{ background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '10px 12px', borderRadius: '4px' }}
              />
              <input
                type="date"
                value={createForm.date}
                onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                style={{ background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '10px 12px', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={createButtonStyle} onClick={handleCreateChallenge}>Create Challenge</button>
            </div>
          </div>
        )}

        <div style={filterContainerStyle}>
          {['all', 'pending', 'active', 'finished'].map((status) => (
            <button
              key={status}
              style={filterButtonStyle(filterStatus === status)}
              onClick={() => setFilterStatus(status)}
              onMouseEnter={(e) => {
                if (filterStatus !== status) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.backgroundColor = '#111';
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== status) {
                  Object.assign(e.currentTarget.style, filterButtonStyle(false));
                }
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div style={challengesGridStyle}>
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              style={challengeCardStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, challengeCardHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, challengeCardStyle)}
            >
              <div style={cardHeaderStyle}>
                <div style={opponentNameStyle}>{challenge.opponent}</div>
                <div style={gameNameStyle}>{challenge.game}</div>
              </div>
              <div style={cardBodyStyle}>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Prize</span>
                  <span style={infoValueStyle}>{challenge.prize} USD</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Date</span>
                  <span style={infoValueStyle}>{challenge.date}</span>
                </div>
                <div style={{ padding: '12px 0' }}>
                  <span style={statusBadgeStyle(challenge.status)}>
                    {challenge.status.toUpperCase()}
                  </span>
                </div>
                <div style={buttonsRowStyle}>
                  <button
                    style={actionButtonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#cc0511';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#e50914';
                    }}
                  >
                    {challenge.status === 'pending'
                      ? 'Accept'
                      : challenge.status === 'active'
                        ? 'View'
                        : 'Details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999',
            }}
          >
            <p style={{ fontSize: '18px', marginBottom: '16px' }}>No challenges found</p>
            <p style={{ fontSize: '14px' }}>Create a new challenge to get started</p>
          </div>
        )}
      </div>
    </>
  );
}
