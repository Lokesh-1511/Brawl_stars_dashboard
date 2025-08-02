import { useState, useEffect } from 'react';

export default function PlayerProfile({ playerTag }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (playerTag) {
      fetchPlayerData();
    }
  }, [playerTag]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/api/player/${playerTag}`);
      const data = await response.json();
      
      if (response.ok) {
        setPlayer(data);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch player data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!playerTag) {
    return (
      <div className="view-container">
        <h2>Player Profile</h2>
        <p>No player tag set. Please update your profile with a valid player tag.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="view-container">
        <h2>Player Profile</h2>
        <div className="loading">Loading player data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-container">
        <h2>Player Profile</h2>
        <div className="error">{error}</div>
        <button onClick={fetchPlayerData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="view-container">
      <h2>Player Profile</h2>
      
      {player && (
        <div className="player-profile">
          <div className="profile-header">
            <h3>{player.name}</h3>
            <span className="tag">#{player.tag}</span>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{player.trophies?.toLocaleString()}</div>
              <div className="stat-label">Current Trophies</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{player.highestTrophies?.toLocaleString()}</div>
              <div className="stat-label">Highest Trophies</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{player.expLevel}</div>
              <div className="stat-label">Level</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{player.brawlers?.length || 0}</div>
              <div className="stat-label">Brawlers</div>
            </div>
          </div>

          <div className="victory-stats">
            <h4>Victory Stats</h4>
            <div className="victory-grid">
              <div className="victory-card">
                <span className="victory-count">{player['3vs3Victories'] || 0}</span>
                <span className="victory-type">3v3 Victories</span>
              </div>
              <div className="victory-card">
                <span className="victory-count">{player.soloVictories || 0}</span>
                <span className="victory-type">Solo Victories</span>
              </div>
              <div className="victory-card">
                <span className="victory-count">{player.duoVictories || 0}</span>
                <span className="victory-type">Duo Victories</span>
              </div>
            </div>
          </div>

          {player.club && (
            <div className="club-info">
              <h4>Club</h4>
              <div className="club-card">
                <div className="club-name">{player.club.name}</div>
                <div className="club-tag">#{player.club.tag}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
