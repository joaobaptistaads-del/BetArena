'use client';

import React, { useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  gamesConnected: number;
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const users: User[] = [
    { id: 1, username: 'User_2847', email: 'user2847@betarena.com', joinDate: '2025-01-15', status: 'Active', gamesConnected: 3 },
    { id: 2, username: 'Pro_Player_1', email: 'pro.player1@betarena.com', joinDate: '2024-12-20', status: 'Active', gamesConnected: 8 },
    { id: 3, username: 'Champion_5', email: 'champion5@betarena.com', joinDate: '2024-11-10', status: 'Active', gamesConnected: 12 },
    { id: 4, username: 'User_891', email: 'user891@betarena.com', joinDate: '2025-01-02', status: 'Inactive', gamesConnected: 1 },
    { id: 5, username: 'Banned_User_42', email: 'banned.user42@betarena.com', joinDate: '2024-10-25', status: 'Suspended', gamesConnected: 0 },
    { id: 6, username: 'User_203', email: 'user203@betarena.com', joinDate: '2025-01-08', status: 'Active', gamesConnected: 5 },
    { id: 7, username: 'User_156', email: 'user156@betarena.com', joinDate: '2024-12-30', status: 'Active', gamesConnected: 2 },
    { id: 8, username: 'User_428', email: 'user428@betarena.com', joinDate: '2025-01-20', status: 'Inactive', gamesConnected: 0 },
    { id: 9, username: 'User_89', email: 'user89@betarena.com', joinDate: '2024-11-05', status: 'Active', gamesConnected: 7 },
    { id: 10, username: 'User_501', email: 'user501@betarena.com', joinDate: '2025-01-12', status: 'Active', gamesConnected: 4 },
    { id: 11, username: 'User_772', email: 'user772@betarena.com', joinDate: '2024-12-15', status: 'Active', gamesConnected: 6 },
    { id: 12, username: 'User_633', email: 'user633@betarena.com', joinDate: '2025-01-05', status: 'Suspended', gamesConnected: 0 },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#4ade80';
      case 'Inactive':
        return '#fbbf24';
      case 'Suspended':
        return '#ff6b6b';
      default:
        return '#999';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#1a3a1a';
      case 'Inactive':
        return '#3a3a1a';
      case 'Suspended':
        return '#3a1a1a';
      default:
        return '#1a1a1a';
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
          Users Management
        </h1>
        <p style={{ fontSize: '14px', color: '#999', margin: '8px 0 0 0' }}>
          Manage platform users and their accounts
        </p>
      </div>

      {/* Search and Filter */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '10px 14px',
            backgroundColor: '#111',
            border: '1px solid #222',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLInputElement).style.borderColor = '#444';
            (e.currentTarget as HTMLInputElement).style.backgroundColor = '#1a1a1a';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLInputElement).style.borderColor = '#222';
            (e.currentTarget as HTMLInputElement).style.backgroundColor = '#111';
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '10px 14px',
            backgroundColor: '#111',
            border: '1px solid #222',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '150px',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLSelectElement).style.borderColor = '#444';
            (e.currentTarget as HTMLSelectElement).style.backgroundColor = '#1a1a1a';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLSelectElement).style.borderColor = '#222';
            (e.currentTarget as HTMLSelectElement).style.backgroundColor = '#111';
          }}
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
          Showing {paginatedUsers.length} of {filteredUsers.length} users
        </p>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: '#111',
          border: '1px solid #222',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '24px',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #222' }}>
              <th
                style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  color: '#999',
                  fontWeight: '600',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                Username
              </th>
              <th
                style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  color: '#999',
                  fontWeight: '600',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                Email
              </th>
              <th
                style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  color: '#999',
                  fontWeight: '600',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                Join Date
              </th>
              <th
                style={{
                  padding: '14px 16px',
                  textAlign: 'center',
                  color: '#999',
                  fontWeight: '600',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: '14px 16px',
                  textAlign: 'center',
                  color: '#999',
                  fontWeight: '600',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                Games Connected
              </th>
              <th
                style={{
                  padding: '14px 16px',
                  textAlign: 'center',
                  color: '#999',
                  fontWeight: '600',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: '1px solid #1a1a1a',
                  backgroundColor: index % 2 === 0 ? '#111' : '#0f0f0f',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = index % 2 === 0 ? '#111' : '#0f0f0f';
                }}
              >
                <td
                  style={{
                    padding: '14px 16px',
                    color: '#fff',
                    fontWeight: '500',
                  }}
                >
                  {user.username}
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    color: '#ccc',
                  }}
                >
                  {user.email}
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    color: '#999',
                  }}
                >
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      backgroundColor: getStatusBgColor(user.status),
                      color: getStatusColor(user.status),
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-block',
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    textAlign: 'center',
                    color: '#ccc',
                  }}
                >
                  {user.gamesConnected}
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#222',
                        color: '#fff',
                        border: '1px solid #333',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#444';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#222';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#333';
                      }}
                    >
                      View
                    </button>
                    {user.status !== 'Suspended' && (
                      <button
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3a1a1a',
                          color: '#ff6b6b',
                          border: '1px solid #5a2a2a',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4a2a2a';
                          (e.currentTarget as HTMLButtonElement).style.borderColor = '#6a3a3a';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a1a1a';
                          (e.currentTarget as HTMLButtonElement).style.borderColor = '#5a2a2a';
                        }}
                      >
                        Ban
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedUsers.length === 0 && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
              No users found matching your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              backgroundColor: currentPage === 1 ? '#0f0f0f' : '#222',
              color: currentPage === 1 ? '#666' : '#fff',
              border: '1px solid #333',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (currentPage > 1) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage > 1) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#222';
              }
            }}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '8px 12px',
                backgroundColor: page === currentPage ? '#fff' : '#222',
                color: page === currentPage ? '#000' : '#fff',
                border: page === currentPage ? '1px solid #fff' : '1px solid #333',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: page === currentPage ? '600' : '400',
                minWidth: '36px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (page !== currentPage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
                }
              }}
              onMouseLeave={(e) => {
                if (page !== currentPage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#222';
                }
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              backgroundColor: currentPage === totalPages ? '#0f0f0f' : '#222',
              color: currentPage === totalPages ? '#666' : '#fff',
              border: '1px solid #333',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (currentPage < totalPages) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage < totalPages) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#222';
              }
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
