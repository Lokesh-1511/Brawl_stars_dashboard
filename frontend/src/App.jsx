import { useEffect, useState } from 'react';

function App() {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/player/8VJ8PQLQP')
      .then(res => res.json())
      .then(data => setPlayer(data))
      .catch(err => console.error('Error fetching:', err));
  }, []);

  return (
    <div>
      <h1>Brawl Stars Player Info</h1>
      {player ? (
        <pre>{JSON.stringify(player, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
