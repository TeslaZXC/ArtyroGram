import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function FullPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
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
      }
    };

    fetchPost();
  }, [postId]);

  // Handle logout
  const handleLogout = () => {
    navigate('/'); 
  };

  if (!post) return <p>Loading...</p>; 

  return (
    <div className="fullPostWrapper">
      <button className="button" id="logoutButton" onClick={handleLogout}>Выйти</button>
      <div className="fullPost">
        <img className="fullPostImg" src={"http://localhost:3000" + (post.image || '/defaultPhoto.jpg')} alt="Post" />
        <img className="fullPostAvatar" src={post.avatar || '/defaultAvatar.jpg'} alt="Avatar" />
        <h1 className="fullPostUserName">{post.name}</h1>
        <div className="fullPostText" 
          dangerouslySetInnerHTML={{
            __html: post.text, 
          }} />
      </div>
    </div>
  );
}
