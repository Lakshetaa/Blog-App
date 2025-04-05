import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://blog-app-25of.onrender.com/post');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched posts:', data);
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribing:', email);
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="home-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <h2>Error loading posts</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <section className="home-hero">
        <h1 className="home-hero-title">Welcome to Our Blog</h1>
        <p className="home-hero-subtitle">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </section>

      <section className="home-featured">
        <h2 className="home-section-title">Featured Posts</h2>
        <div className="home-posts-grid">
          {posts && posts.length > 0 ? (
            posts.map(post => (
              <article key={post._id} className="home-post-card">
                {post.cover && (
                  <img 
                    src={`https://blog-app-25of.onrender.com/${post.cover}`}
                    alt={post.title}
                    className="home-post-image"
                    onError={(e) => {
                      console.error('Error loading image:', post.cover);
                      e.target.src = 'https://via.placeholder.com/300x200';
                    }}
                  />
                )}
                <div className="home-post-content">
                  <h3 className="home-post-title">{post.title}</h3>
                  {post.summary && (
                    <p className="home-post-summary">{post.summary}</p>
                  )}
                  {post.content && (
                    <div className="home-post-text">
                      <p>
                        {post.content.length > 150 
                          ? `${post.content.substring(0, 150)}...` 
                          : post.content}
                      </p>
                    </div>
                  )}
                  <div className="home-post-meta">
                    {post.author && (
                      <span className="home-post-author">By {post.author}</span>
                    )}
                    {post.category && (
                      <span className="home-post-category">{post.category}</span>
                    )}
                    {post.createdAt && (
                      <span className="home-post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Link to={`/post`}  state={{ postId: post._id }} className="home-post-link">
                    Read More
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="home-no-posts">
              <p>No posts available</p>
            </div>
          )}
        </div>
      </section>

      <section className="home-subscribe">
        <h2>Subscribe to Our Newsletter</h2>
        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
