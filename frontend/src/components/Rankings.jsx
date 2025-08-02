import { useState, useEffect } from 'react';

export default function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rankingType, setRankingType] = useState('players');

  useEffect(() => {
    fetchRankings();
  }, [rankingType]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/api/rankings/${rankingType}`);
      const data = await response.json();
      
      if (response.ok) {
        setRankings(data.items || []);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch rankings');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="view-container">
      <h2>Global Rankings</h2>
      
      <div className="ranking-controls">
        <button
          className={`ranking-btn ${rankingType === 'players' ? 'active' : ''}`}
          onClick={() => setRankingType('players')}
        >
          👤 Players
        </button>
        <button
          className={`ranking-btn ${rankingType === 'clubs' ? 'active' : ''}`}
          onClick={() => setRankingType('clubs')}
        >
          🏘️ Clubs
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading rankings...</div>
      ) : error ? (
        <div className="error">
          {error}
          <button onClick={fetchRankings}>Retry</button>
        </div>
      ) : (
        <div className="rankings-list">
          {rankings.slice(0, 50).map((item, index) => (
            <div key={index} className="ranking-item">
              <div className="rank-position">
                {getRankIcon(item.rank)}
              </div>
              
              <div className="ranking-info">
                <div className="ranking-name">{item.name}</div>
                <div className="ranking-tag">#{item.tag}</div>
              </div>
              
              <div className="ranking-stats">
                <div className="stat-value">{item.trophies?.toLocaleString()}</div>
                <div className="stat-label">Trophies</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
