'use client';

import { useState } from 'react';
import UserSidebar from '../../../components/UserSidebar';

export default function RankingsPage() {
  const [gameFilter, setGameFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('global');

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

  const userStatsContainerStyle: React.CSSProperties = {
    backgroundColor: '#111',
    border: '1px solid rgba(229, 9, 20, 0.3)',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '24px',
  };

  const userStatStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '900',
    color: '#e50914',
    marginBottom: '4px',
  };

  const statDetailStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#ccc',
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  };

  const filterGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const filterLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const filterSelectStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#111',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: '#111',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse' as const,
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const tableHeaderCellStyle: React.CSSProperties = {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const tableRowStyle: React.CSSProperties = {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
  };

  const tableRowHoverStyle: React.CSSProperties = {
    backgroundColor: 'rgba(229, 9, 20, 0.05)',
    borderLeftColor: '#e50914',
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '16px',
    fontSize: '13px',
    color: '#ccc',
  };

  const positionCellStyle: React.CSSProperties = {
    fontWeight: '700',
    color: '#fff',
    fontSize: '16px',
  };

  const playerNameStyle: React.CSSProperties = {
    fontWeight: '600',
    color: '#fff',
  };

  const eloCellStyle: React.CSSProperties = {
    color: '#e50914',
    fontWeight: '700',
  };

  const mockRankings = [
    {
      position: 1,
      name: 'ProPlayer',
      game: 'Counter-Strike 2',
      elo: 2850,
      wins: 256,
      matches: 312,
      winRate: 82,
    },
    {
      position: 2,
      name: 'EsportsKing',
      game: 'Valorant',
      elo: 2720,
      wins: 198,
      matches: 240,
      winRate: 83,
    },
    {
      position: 3,
      name: 'NeonGhost',
      game: 'Counter-Strike 2',
      elo: 2680,
      wins: 178,
      matches: 215,
      winRate: 83,
    },
    {
      position: 4,
      name: 'SilverStrike',
      game: 'Valorant',
      elo: 2540,
      wins: 145,
      matches: 188,
      winRate: 77,
    },
    {
      position: 5,
      name: 'ThunderStorm',
      game: 'Dota 2',
      elo: 2490,
      wins: 142,
      matches: 180,
      winRate: 79,
    },
    {
      position: 6,
      name: 'GoldenAim',
      game: 'Counter-Strike 2',
      elo: 2380,
      wins: 128,
      matches: 165,
      winRate: 78,
    },
    {
      position: 7,
      name: 'OceanWave',
      game: 'Valorant',
      elo: 2250,
      wins: 115,
      matches: 152,
      winRate: 76,
    },
    {
      position: 8,
      name: 'MysticFox',
      game: 'Counter-Strike 2',
      elo: 2150,
      wins: 98,
      matches: 138,
      winRate: 71,
    },
  ];

  return (
    <>
      <UserSidebar />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Global Rankings</h1>
          <p style={subtitleStyle}>FACEIT-style leaderboard</p>
        </div>

        <div style={userStatsContainerStyle}>
          <div style={userStatStyle}>
            <div style={statLabelStyle}>Your Rank</div>
            <div style={statValueStyle}>#42</div>
            <div style={statDetailStyle}>8,450 ELO</div>
          </div>
          <div style={userStatStyle}>
            <div style={statLabelStyle}>Total Matches</div>
            <div style={statValueStyle}>287</div>
            <div style={statDetailStyle}>68% win rate</div>
          </div>
          <div style={userStatStyle}>
            <div style={statLabelStyle}>Rank Progress</div>
            <div style={statValueStyle}>Gold II</div>
            <div style={statDetailStyle}>450 ELO to next</div>
          </div>
          <div style={userStatStyle}>
            <div style={statLabelStyle}>Current Streak</div>
            <div style={statValueStyle}>12</div>
            <div style={statDetailStyle}>wins in a row</div>
          </div>
        </div>

        <div style={filterContainerStyle}>
          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Game</label>
            <select
              style={filterSelectStyle}
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
            >
              <option value="all">All Games</option>
              <option value="cs2">Counter-Strike 2</option>
              <option value="valorant">Valorant</option>
              <option value="dota2">Dota 2</option>
              <option value="lol">League of Legends</option>
            </select>
          </div>
          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Region</label>
            <select
              style={filterSelectStyle}
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="global">Global</option>
              <option value="na">North America</option>
              <option value="eu">Europe</option>
              <option value="br">Brazil</option>
              <option value="kr">South Korea</option>
            </select>
          </div>
        </div>

        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead style={tableHeaderStyle}>
              <tr>
                <th style={tableHeaderCellStyle}>Rank</th>
                <th style={tableHeaderCellStyle}>Player</th>
                <th style={tableHeaderCellStyle}>Game</th>
                <th style={tableHeaderCellStyle}>ELO</th>
                <th style={tableHeaderCellStyle}>Wins</th>
                <th style={tableHeaderCellStyle}>Matches</th>
                <th style={tableHeaderCellStyle}>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {mockRankings.map((player) => (
                <tr
                  key={player.position}
                  style={tableRowStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, tableRowHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, tableRowStyle)}
                >
                  <td style={{ ...tableCellStyle, ...positionCellStyle }}>
                    {player.position}
                  </td>
                  <td style={{ ...tableCellStyle, ...playerNameStyle }}>{player.name}</td>
                  <td style={tableCellStyle}>{player.game}</td>
                  <td style={{ ...tableCellStyle, ...eloCellStyle }}>{player.elo}</td>
                  <td style={tableCellStyle}>{player.wins}</td>
                  <td style={tableCellStyle}>{player.matches}</td>
                  <td style={tableCellStyle}>
                    <span
                      style={{
                        backgroundColor: 'rgba(0, 217, 255, 0.15)',
                        color: '#00d9ff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: '600',
                        fontSize: '12px',
                      }}
                    >
                      {player.winRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: '32px',
            padding: '24px',
            backgroundColor: '#111',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>
            Showing top 8 players. More rankings data available.
          </p>
          <button
            style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              color: '#e50914',
              border: '1px solid #e50914',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(229, 9, 20, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            View All Rankings
          </button>
        </div>
      </div>
    </>
  );
}
