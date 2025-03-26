import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';
import './Profile.css';

const ProfilePage = () => {
  const { userInfo } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo?.username) {
      return;
    }
    fetchProfile();
  }, [userInfo]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:4000/profile/${userInfo.username}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Profile data:', data);
        setProfile(data.user);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile</h1>
          <div className="profile-avatar">
            {userInfo.username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>Username</label>
            <p>{userInfo.username}</p>
          </div>

          <div className="info-group">
            <label>Email Address</label>
            <p>{profile?.email || 'No email set'}</p>
          </div>

          {profile && (
            <div className="subscription-status">
              <label>Subscription Status</label>
              <p className={profile.isSubscribed ? 'subscribed' : 'not-subscribed'}>
                {profile.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
