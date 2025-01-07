import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function FullPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setMessage('Error fetching post');
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/comments`);
        if (!response.ok) {
          throw new Error('Error fetching comments');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error('Received comments data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setMessage('Error fetching comments');
      }
    };

    fetchPost();
    fetchComments();
  }, [postId]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setMessage('Comment cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to post a comment');
        return;
      }

      const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error adding comment');
      }

      const data = await response.json();
      console.log('New comment added:', data);

      setComments((prevComments) => [data, ...prevComments]);
      setNewComment('');
      setMessage('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setMessage(error.message || 'Error adding comment');
    }
  };

  const convertUrlsToFullLinks = (text) => {
    const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/g;
    return text.replace(urlPattern, (url) => {
      if (url.startsWith('http://localhost')) {
        return url;
      }
      return `http://localhost:3000/${url}`;
    });
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="fullPostWrapper">
      <button className="button" id="logoutButton" onClick={handleLogout}>Выйти</button>
      <div className="fullPost">
        <img className="fullPostImg" src={`http://localhost:3000${post.image || '/defaultPhoto.jpg'}`} alt="Post" />
        <img className="fullPostAvatar" src={post.avatar || '/defaultAvatar.jpg'} alt="Avatar" />
        <h1 className="fullPostUserName">{post.name}</h1>
        <div className="fullPostText" dangerouslySetInnerHTML={{
          __html: convertUrlsToFullLinks(post.text),
        }} />

        <div className="commentsSection">
          <h3>Comments</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleAddComment}>Post Comment</button>
          {message && <p>{message}</p>}
          <div className="commentsList">
            {comments.length === 0 ? (
              <p>No comments yet.</p> 
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p><strong>{comment.user_name}:</strong> {comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
