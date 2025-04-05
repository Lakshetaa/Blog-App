import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './create.css';

const CreateBlogPage = () => {
  const { userInfo } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userInfo?.username) {
      setError('Please log in to create a blog post');
      return;
    }

    // Validate inputs
    if (!title || !content || !category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('https://blog-app-25of.onrender.com/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          author: userInfo.username,
          category
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Blog post created successfully!');
        // Clear form
        setTitle('');
        setContent('');
        setCategory('');
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/myblog');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create blog post');
      }
    } catch (error) {
      setError('Error creating blog post. Please try again.');
      console.error('Error:', error);
    }
  };

  if (!userInfo?.username) {
    return (
      <div className="create-blog-form">
        <h2>Access Denied</h2>
        <p>Please log in to create a blog post.</p>
      </div>
    );
  }

  return (
    <div className="create-blog-form">
      <h2>Create New Blog Post</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Blog category (e.g., Technology, Travel, Food)"
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            required
          />
        </div>

        <button type="submit" className="submit-button">Create Post</button>
      </form>
    </div>
  );
};

export default CreateBlogPage;