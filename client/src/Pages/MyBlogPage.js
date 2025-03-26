import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import './MyBlog.css';

const MyBlogPage = () => {
  const { userInfo } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, [userInfo]);

  const fetchBlogs = async () => {
    try {
      if (!userInfo?.username) {
        throw new Error('Please log in to view your blogs');
      }

      const response = await fetch('http://localhost:4000/post', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched blogs:', data);
      
      // Filter blogs by the current user
      const userBlogs = data.filter(blog => blog.author === userInfo.username);
      setBlogs(userBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setEditFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/post/${editingBlog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...editFormData,
          author: userInfo.username
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBlogs(blogs.map(blog => 
        blog._id === editingBlog._id ? data.blog : blog
      ));
      setEditingBlog(null);
      setEditFormData({
        title: '',
        content: '',
        category: ''
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      setError('Error updating blog post: ' + error.message);
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`http://localhost:4000/post/${blogId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setBlogs(blogs.filter(blog => blog._id !== blogId));
      } catch (error) {
        console.error('Error deleting blog:', error);
        setError('Error deleting blog post: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="myblog-loading">Loading your blogs...</div>;
  }

  if (error) {
    return (
      <div className="myblog-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => {
          setError(null);
          fetchBlogs();
        }}>Try Again</button>
      </div>
    );
  }

  if (!userInfo?.username) {
    return (
      <div className="myblog-error">
        <h2>Access Denied</h2>
        <p>Please log in to view your blogs</p>
      </div>
    );
  }

  return (
    <div className="myblog-container">
      <h1 className="myblog-header">My Blog Posts</h1>
      
      {blogs.length === 0 ? (
        <div className="myblog-no-posts">
          <h2>No blog posts found</h2>
          <p>You haven't created any blog posts yet.</p>
        </div>
      ) : (
        <div className="myblog-grid">
          {blogs.map(blog => (
            <div key={blog._id} className="myblog-card">
              {blog.cover && (
                <img 
                  src={`http://localhost:4000/${blog.cover}`}
                  alt={blog.title}
                  className="myblog-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200';
                  }}
                />
              )}
              <div className="myblog-content">
                <h2 className="myblog-title">{blog.title}</h2>
                <div className="myblog-text">
                  <p className="myblog-content-text">
                    {blog.content.length > 200 
                      ? `${blog.content.substring(0, 200)}...` 
                      : blog.content}
                  </p>
                </div>
                <div className="myblog-meta">
                  <span className="myblog-author">By {blog.author}</span>
                  <span className="myblog-category">{blog.category}</span>
                </div>
                <div className="myblog-footer">
                  <span className="myblog-date">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <div className="myblog-actions">
                    <button 
                      onClick={() => handleEdit(blog)}
                      className="myblog-action-btn myblog-edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="myblog-action-btn myblog-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingBlog && (
        <div className="myblog-edit-form">
          <h2>Edit Blog Post</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="myblog-form-group">
              <label>Title:</label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                required
              />
            </div>
            <div className="myblog-form-group">
              <label>Content:</label>
              <textarea
                value={editFormData.content}
                onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                required
              />
            </div>
            <div className="myblog-form-group">
              <label>Category:</label>
              <input
                type="text"
                value={editFormData.category}
                onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                required
              />
            </div>
            <div className="myblog-form-actions">
              <button type="submit" className="myblog-action-btn myblog-edit-btn">
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setEditingBlog(null)}
                className="myblog-action-btn myblog-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyBlogPage;