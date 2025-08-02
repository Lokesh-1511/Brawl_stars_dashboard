import { useState, useEffect } from 'react';

export default function Analytics({ playerTag }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (playerTag) {
      fetchAnalytics();
    }
  }, [playerTag]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/api/player/${playerTag}/analytics`);
      const data = await response.json();
      
      if (response.ok) {
        setAnalytics(data);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch analytics');
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
        <h2>Analytics</h2>
        <p>No player tag set.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="view-container">
        <h2>Analytics</h2>
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-container">
        <h2>Analytics</h2>
        <div className="error">{error}</div>
        <button onClick={fetchAnalytics}>Retry</button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="view-container">
        <h2>Analytics</h2>
        <p>No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="view-container">
      <h2>Analytics</h2>
      
      <div className="analytics-grid">
        {/* Battle Performance */}
        <div className="analytics-card">
          <h3>Recent Performance</h3>
          <div className="performance-stats">
            <div className="perf-stat">
              <span className="perf-value">{analytics.recent_performance?.win_rate || 0}%</span>
              <span className="perf-label">Win Rate</span>
            </div>
            <div className="perf-stat">
              <span className="perf-value">{analytics.recent_performance?.total_battles || 0}</span>
              <span className="perf-label">Total Battles</span>
            </div>
            <div className="perf-stat">
              <span className="perf-value">{analytics.recent_performance?.wins || 0}</span>
              <span className="perf-label">Wins</span>
            </div>
            <div className="perf-stat">
              <span className="perf-value">{analytics.recent_performance?.losses || 0}</span>
              <span className="perf-label">Losses</span>
            </div>
          </div>
        </div>

        {/* Most Played */}
        <div className="analytics-card">
          <h3>Most Played</h3>
          <div className="most-played">
            {analytics.recent_performance?.most_played_mode && (
              <div className="most-played-item">
                <strong>Mode:</strong> {analytics.recent_performance.most_played_mode}
              </div>
            )}
            {analytics.recent_performance?.most_played_brawler && (
              <div className="most-played-item">
                <strong>Brawler:</strong> {analytics.recent_performance.most_played_brawler}
              </div>
            )}
          </div>
        </div>

        {/* Player Overview */}
        <div className="analytics-card">
          <h3>Player Overview</h3>
          <div className="overview-stats">
            <div className="overview-item">
              <span className="overview-label">Brawlers Unlocked:</span>
              <span className="overview-value">{analytics.brawler_count || 0}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">3v3 Victories:</span>
              <span className="overview-value">{analytics.player_info?.['3vs3_victories'] || 0}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Solo Victories:</span>
              <span className="overview-value">{analytics.player_info?.solo_victories || 0}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Duo Victories:</span>
              <span className="overview-value">{analytics.player_info?.duo_victories || 0}</span>
            </div>
          </div>
        </div>

        {/* Win Rate Progress */}
        <div className="analytics-card">
          <h3>Win Rate Analysis</h3>
          <div className="win-rate-visual">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${analytics.recent_performance?.win_rate || 0}%`,
                  backgroundColor: (analytics.recent_performance?.win_rate || 0) > 50 ? '#4CAF50' : '#F44336'
                }}
              />
            </div>
            <p className="win-rate-text">
              {analytics.recent_performance?.win_rate || 0}% win rate over last {analytics.battle_stats?.total_battles_analyzed || 0} battles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
