import React, { useState } from 'react';
import './Subscription.css';

const SubscriptionPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Failed to subscribe. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <h1>Subscribe to Our Blog</h1>
        <p className="subscription-description">
          Stay updated with our latest blog posts! Subscribe to receive notifications
          whenever we publish new content.
        </p>

        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="subscription-email-input"
              required
            />
          </div>

          <button 
            type="submit" 
            className="subscribe-button"
            disabled={loading}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {status && (
          <div className={`subscription-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="subscription-features">
          <h2>What you'll get:</h2>
          <ul>
            <li>🔔 Instant notifications for new blog posts</li>
            <li>📧 Weekly digest of popular posts</li>
            <li>🎯 Personalized content recommendations</li>
            <li>❌ Unsubscribe anytime with one click</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
