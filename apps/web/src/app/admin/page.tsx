'use client';

import React from 'react';

export default function AdminDashboard() {
  const metrics = [
    { label: 'Total Users', value: '2,847', change: '+12%', color: '#fff' },
    { label: 'Active Tournaments', value: '24', change: '+3', color: '#fff' },
    { label: 'Monthly Revenue', value: '$45,230', change: '+8.2%', color: '#fff' },
    { label: 'Total Matches', value: '12,453', change: '+5.1%', color: '#fff' },
  ];

  const recentActivities = [
    { id: 1, user: 'User_42', action: 'Joined platform', time: '2 minutes ago', type: 'join' },
    { id: 2, user: 'Pro_Player_7', action: 'Created tournament', time: '15 minutes ago', type: 'tournament' },
    { id: 3, user: 'User_891', action: 'Made deposit', time: '32 minutes ago', type: 'payment' },
    { id: 4, user: 'Champion_5', action: 'Won match', time: '1 hour ago', type: 'match' },
    { id: 5, user: 'User_203', action: 'Account suspended', time: '2 hours ago', type: 'suspension' },
  ];

  const recentTransactions = [
    { id: 1, user: 'User_156', type: 'Deposit', amount: '+$500', status: 'Completed', time: '45 min' },
    { id: 2, user: 'User_428', type: 'Withdrawal', amount: '-$250', status: 'Pending', time: '1 hour' },
    { id: 3, user: 'User_89', type: 'Deposit', amount: '+$1,200', status: 'Completed', time: '2 hours' },
    { id: 4, user: 'User_501', type: 'Winnings', amount: '+$3,450', status: 'Completed', time: '3 hours' },
    { id: 5, user: 'User_772', type: 'Withdrawal', amount: '-$800', status: 'Completed', time: '4 hours' },
  ];


  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#999', margin: '8px 0 0 0' }}>
          Welcome back. Here's your platform overview.
        </p>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {metrics.map((metric, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#111',
              border: '1px solid #222',
              borderRadius: '8px',
              padding: '20px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#1a1a1a';
              (e.currentTarget as HTMLElement).style.borderColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#111';
              (e.currentTarget as HTMLElement).style.borderColor = '#222';
            }}
          >
            <p style={{ fontSize: '12px', color: '#999', margin: 0, letterSpacing: '0.5px' }}>
              {metric.label}
            </p>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: metric.color }}>
                {metric.value}
              </p>
              <span style={{ fontSize: '12px', color: '#4ade80', backgroundColor: '#1a3a1a', padding: '4px 8px', borderRadius: '4px' }}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            backgroundColor: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            padding: '20px',
            minHeight: '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>
              Revenue Over Time
            </p>
            <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
              Chart placeholder
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            padding: '20px',
            minHeight: '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>
              Platform Growth
            </p>
            <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
              Chart placeholder
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activities and Transactions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        {/* Recent Activities */}
        <div
          style={{
            backgroundColor: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#fff' }}>
            Recent Activities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                <div>
                  <p style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: '500' }}>
                    {activity.user}
                  </p>
                  <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0 0' }}>
                    {activity.action}
                  </p>
                </div>
                <span style={{ fontSize: '11px', color: '#666' }}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          style={{
            backgroundColor: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#fff' }}>
            Recent Transactions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: '500' }}>
                    {transaction.user}
                  </p>
                  <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0 0' }}>
                    {transaction.type}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontSize: '13px',
                      color: transaction.amount.startsWith('+') ? '#4ade80' : '#ff6b6b',
                      margin: 0,
                      fontWeight: '600',
                    }}
                  >
                    {transaction.amount}
                  </p>
                  <p style={{ fontSize: '11px', color: '#666', margin: '4px 0 0 0' }}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
