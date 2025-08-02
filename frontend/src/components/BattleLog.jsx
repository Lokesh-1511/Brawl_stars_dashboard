import { useState, useEffect } from 'react';

export default function BattleLog({ playerTag }) {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (playerTag) {
      fetchBattleLog();
    }
  }, [playerTag]);

  const fetchBattleLog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/api/player/${playerTag}/battlelog`);
      const data = await response.json();
      
      if (response.ok) {
        setBattles(data.items || []);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch battle log');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'victory': return '#4CAF50';
      case 'defeat': return '#F44336';
      default: return '#FFC107';
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'victory': return '🏆';
      case 'defeat': return '💔';
      default: return '⚖️';
    }
  };

  if (!playerTag) {
    return (
      <div className="view-container">
        <h2>Battle Log</h2>
        <p>No player tag set.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="view-container">
        <h2>Battle Log</h2>
        <div className="loading">Loading battle log...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-container">
        <h2>Battle Log</h2>
        <div className="error">{error}</div>
        <button onClick={fetchBattleLog}>Retry</button>
      </div>
    );
  }

  return (
    <div className="view-container">
      <h2>Battle Log</h2>
      
      {battles.length === 0 ? (
        <p>No battles found.</p>
      ) : (
        <div className="battle-list">
          {battles.slice(0, 20).map((battle, index) => (
            <div key={index} className="battle-card">
              <div className="battle-header">
                <div 
                  className="battle-result"
                  style={{ color: getResultColor(battle.battle?.result) }}
                >
                  {getResultIcon(battle.battle?.result)} {battle.battle?.result?.toUpperCase()}
                </div>
                <div className="battle-time">
                  {new Date(battle.battleTime).toLocaleDateString()}
                </div>
              </div>
              
              <div className="battle-info">
                <div className="battle-mode">
                  <strong>Mode:</strong> {battle.battle?.mode || 'Unknown'}
                </div>
                <div className="battle-type">
                  <strong>Type:</strong> {battle.battle?.type || 'Unknown'}
                </div>
                {battle.battle?.duration && (
                  <div className="battle-duration">
                    <strong>Duration:</strong> {battle.battle.duration}s
                  </div>
                )}
              </div>

              {battle.battle?.starPlayer && (
                <div className="star-player">
                  <strong>⭐ Star Player:</strong> {battle.battle.starPlayer.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
