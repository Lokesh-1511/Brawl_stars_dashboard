import { useState } from 'react';

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    playerTag: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate player tag format
    if (formData.playerTag && !/^[A-Z0-9]{3,15}$/.test(formData.playerTag.replace('#', ''))) {
      setError('Player tag must be 3-15 characters with letters and numbers only');
      setLoading(false);
      return;
    }

    // Simple validation (in a real app, you'd send this to your backend)
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (isSignup && !formData.playerTag) {
      setError('Player tag is required for signup');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        username: formData.username,
        playerTag: formData.playerTag || null,
        createdAt: new Date().toISOString()
      };
      
      onLogin(userData);
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏆 Brawl Stars Dashboard</h1>
        <h2>{isSignup ? 'Create Account' : 'Login'}</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          {isSignup && (
            <input
              type="text"
              name="playerTag"
              placeholder="Player Tag (e.g., 8VJ8PQLQP)"
              value={formData.playerTag}
              onChange={handleChange}
              required
            />
          )}
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>
        
        <p>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button" 
            className="link-button"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
