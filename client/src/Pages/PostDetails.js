import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "./PostDetails.css";

const PostDetails = () => {
    const location = useLocation();
  const id = location.state?.postId;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:4000/post/${id}`);
        const data = await res.json();
        console.log(data);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="post-container"><p>Loading...</p></div>;
  if (!post) return <div className="post-container"><p>Post not found.</p></div>;

  return (
    <div className="post-container">
      <div className="post-card">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>By <strong>{post.author}</strong></span> | 
          <span> Category: <strong>{post.category}</strong></span> | 
          <span> Published: <strong>{new Date(post.createdAt).toLocaleString()}</strong></span>
        </div>
        <hr className="divider" />
        <p className="post-content">{post.content}</p>
      </div>
    </div>
  );
};

export default PostDetails;
