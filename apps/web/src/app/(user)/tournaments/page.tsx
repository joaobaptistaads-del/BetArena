'use client';

import { useEffect, useState } from 'react';
import UserSidebar from '../../../components/UserSidebar';
import { supabase } from '../../../lib/supabase';

export default function TournamentsPage() {
  const [filterType, setFilterType] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    game: 'Counter-Strike 2',
    prize: '',
    players: '',
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

  const tournamentsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  };

  const tournamentCardStyle: React.CSSProperties = {
    backgroundColor: '#111',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  };

  const tournamentCardHoverStyle: React.CSSProperties = {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
  };

  const cardHeaderStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  };

  const tournamentNameStyle: React.CSSProperties = {
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
    flex: 1,
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
      registration: '#ffa500',
      ongoing: '#00d9ff',
      finished: '#999',
      available: '#00d965',
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

  const actionButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #fff',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '16px',
  };

  const mockTournaments = [
    {
      id: 1,
      name: 'FPS Masters 2025',
      game: 'Counter-Strike 2',
      prize: 5000,
      players: 128,
      status: 'ongoing',
      type: 'joined',
    },
    {
      id: 2,
      name: 'Monthly Showdown',
      game: 'Valorant',
      prize: 2000,
      players: 64,
      status: 'registration',
      type: 'available',
    },
    {
      id: 3,
      name: 'Regional Cup',
      game: 'Dota 2',
      prize: 3000,
      players: 96,
      status: 'ongoing',
      type: 'joined',
    },
    {
      id: 4,
      name: 'Winter Series',
      game: 'Counter-Strike 2',
      prize: 10000,
      players: 256,
      status: 'registration',
      type: 'available',
    },
    {
      id: 5,
      name: 'Spring Championship',
      game: 'League of Legends',
      prize: 8000,
      players: 200,
      status: 'finished',
      type: 'created',
    },
    {
      id: 6,
      name: 'Pro League Qualifier',
      game: 'Counter-Strike 2',
      prize: 15000,
      players: 512,
      status: 'registration',
      type: 'available',
    },
  ];

  const [tournaments, setTournaments] = useState(mockTournaments);

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

      const { data: tournamentsData } = await supabase
        .from('tournaments')
        .select('id, title, prize_pool, max_players, status, organizer_id, games(name)')
        .order('created_at', { ascending: false });

      if (tournamentsData) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        const mapped = tournamentsData.map((t: any) => ({
          id: t.id,
          name: t.title,
          game: t.games?.name || 'Unknown',
          prize: Number(t.prize_pool || 0),
          players: Number(t.max_players || 0),
          status: t.status === 'open' ? 'registration' : t.status === 'ongoing' ? 'ongoing' : t.status,
          type: t.organizer_id && userId && t.organizer_id === userId ? 'created' : 'available',
        }));

        setTournaments(mapped);
      }
    };

    loadData();
  }, []);

  const handleCreateTournament = async () => {
    if (!createForm.name || !createForm.prize || !createForm.players) return;

    if (!supabase) {
      const newTournament = {
        id: Date.now(),
        name: createForm.name,
        game: createForm.game,
        prize: Number(createForm.prize),
        players: Number(createForm.players),
        status: 'registration',
        type: 'created',
      } as const;

      setTournaments([newTournament, ...tournaments]);
      setCreateForm({ name: '', game: 'Counter-Strike 2', prize: '', players: '' });
      setShowCreate(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const selectedGame = games.find((g) => g.name === createForm.game) || games[0];
    if (!selectedGame) return;

    const { data } = await supabase
      .from('tournaments')
      .insert({
        organizer_id: userId,
        game_id: selectedGame.id,
        title: createForm.name,
        platform: 'ps5',
        status: 'open',
        max_players: Number(createForm.players),
        prize_pool: Number(createForm.prize),
      })
      .select('id, title, prize_pool, max_players, status, organizer_id, games(name)')
      .single();

    if (data) {
      const mapped = {
        id: data.id,
        name: data.title,
        game: data.games?.name || createForm.game,
        prize: Number(data.prize_pool || 0),
        players: Number(data.max_players || 0),
        status: data.status === 'open' ? 'registration' : data.status,
        type: 'created',
      };
      setTournaments([mapped, ...tournaments]);
    }

    setCreateForm({ name: '', game: 'Counter-Strike 2', prize: '', players: '' });
    setShowCreate(false);
  };

  const filteredTournaments =
    filterType === 'all' ? tournaments : tournaments.filter((t) => t.type === filterType);

  return (
    <>
      <UserSidebar />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Tournaments</h1>
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
            {showCreate ? 'Close' : 'Create Tournament'}
          </button>
        </div>

        {showCreate && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <input
                type="text"
                placeholder="Tournament name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
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
                type="number"
                placeholder="Players"
                value={createForm.players}
                onChange={(e) => setCreateForm({ ...createForm, players: e.target.value })}
                style={{ background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '10px 12px', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={createButtonStyle} onClick={handleCreateTournament}>Create Tournament</button>
            </div>
          </div>
        )}

        <div style={filterContainerStyle}>
          {['all', 'available', 'joined', 'created'].map((type) => (
            <button
              key={type}
              style={filterButtonStyle(filterType === type)}
              onClick={() => setFilterType(type)}
              onMouseEnter={(e) => {
                if (filterType !== type) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.backgroundColor = '#111';
                }
              }}
              onMouseLeave={(e) => {
                if (filterType !== type) {
                  Object.assign(e.currentTarget.style, filterButtonStyle(false));
                }
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div style={tournamentsGridStyle}>
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              style={tournamentCardStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, tournamentCardHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, tournamentCardStyle)}
            >
              <div style={cardHeaderStyle}>
                <div style={tournamentNameStyle}>{tournament.name}</div>
                <div style={gameNameStyle}>{tournament.game}</div>
              </div>
              <div style={cardBodyStyle}>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Prize Pool</span>
                  <span style={infoValueStyle}>{tournament.prize.toLocaleString()} USD</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Players</span>
                  <span style={infoValueStyle}>{tournament.players}</span>
                </div>
                <div style={{ padding: '12px 0' }}>
                  <span style={statusBadgeStyle(tournament.status)}>
                    {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                  </span>
                </div>
                <button
                  style={actionButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#cc0511';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#e50914';
                  }}
                >
                  {tournament.type === 'available'
                    ? 'Join Tournament'
                    : tournament.type === 'created'
                      ? 'Manage'
                      : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999',
            }}
          >
            <p style={{ fontSize: '18px', marginBottom: '16px' }}>No tournaments found</p>
            <p style={{ fontSize: '14px' }}>
              {filterType === 'all'
                ? 'Create a tournament to get started'
                : `No ${filterType} tournaments available`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
