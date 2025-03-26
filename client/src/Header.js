import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Header.css';

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userData => {
        if (userData) {
          setUserInfo(userData);
        }
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      setUserInfo(null);
    });
  }

  const username = userInfo?.username;

  return (
    <header className="header-root">
      <div className="header-content">
        <Link to="/" className="header-logo">Blog App</Link>
        <nav className="header-nav">
          <Link to="/home" className={`header-nav-link ${location.pathname === '/home' ? 'active' : ''}`}>Home</Link>
          {username ? (
            <>
              <Link to="/myblog" className={`header-nav-link ${location.pathname === '/myblog' ? 'active' : ''}`}>My Blog</Link>
              <Link to="/create" className={`header-nav-link ${location.pathname === '/create' ? 'active' : ''}`}>Create Post</Link>
              <Link to="/subscription" className={`header-nav-link ${location.pathname === '/subscription' ? 'active' : ''}`}>Subscribe</Link>
              <Link to="/profile" className={`header-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
              <a onClick={logout} className="header-nav-link header-logout-btn">Logout ({username})</a>
            </>
          ) : (
            <>
              <Link to="/login" className={`header-nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
              <Link to="/register" className={`header-nav-link ${location.pathname === '/register' ? 'active' : ''}`}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}