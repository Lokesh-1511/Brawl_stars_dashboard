import { useState, useEffect } from 'react';
import PlayerProfile from './PlayerProfile';
import BattleLog from './BattleLog';
import Analytics from './Analytics';
import Rankings from './Rankings';

export default function Dashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('profile');
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { id: 'profile', label: 'Player Profile', icon: '👤' },
    { id: 'battles', label: 'Battle Log', icon: '⚔️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'rankings', label: 'Rankings', icon: '🏆' }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'profile':
        return <PlayerProfile playerTag={user.playerTag} />;
      case 'battles':
        return <BattleLog playerTag={user.playerTag} />;
      case 'analytics':
        return <Analytics playerTag={user.playerTag} />;
      case 'rankings':
        return <Rankings />;
      default:
        return <PlayerProfile playerTag={user.playerTag} />;
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <h1>Brawl Stars Dashboard</h1>
        </div>
        <div className="header-right">
          <span>Welcome, {user.username}!</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button 
            className="close-btn"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>
        <ul className="menu-items">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                className={`menu-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveView(item.id);
                  setMenuOpen(false);
                }}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderActiveView()}
      </main>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div 
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
