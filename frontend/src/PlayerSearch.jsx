import { useState } from 'react';

export default function PlayerSearch() {
  const [tag, setTag] = useState('');
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlayer(null);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/player/${tag}`);
      const data = await res.json();
      if (res.ok) {
        setPlayer(data);
      } else {
        setError(data.error || data.message || 'Player not found');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Brawl Stars Player Search</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={tag}
          onChange={e => setTag(e.target.value)}
          placeholder="Enter player tag (e.g. 8VJ8PQLQP)"
          style={{ width: '70%', padding: 8 }}
          required
        />
        <button type="submit" style={{ padding: '8px 16px', marginLeft: 8 }}>Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {player && (
        <div style={{ textAlign: 'left', marginTop: 16 }}>
          <h3>{player.name} <span style={{ fontSize: 14, color: '#888' }}>#{player.tag}</span></h3>
          <p><strong>Trophies:</strong> {player.trophies}</p>
          <p><strong>Level:</strong> {player.expLevel}</p>
        </div>
      )}
    </div>
  );
}
