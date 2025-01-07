import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Post({ post }) {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/post/${post.id}`);
  };

  const truncatedText = post?.text?.length > 35 ? post.text.substring(0, 35) + '...' : post?.text;

  return (
    <div className="post">
      <img className="postImg" src={"http://localhost:3000" + (post.image || '/defaultPhoto.jpg')} alt="Post" />
      <img className="postAvatar" src={post.avatar || '/defaultAvatar.jpg'} alt="Avatar" />
      <h1 className="postUserName">{post.name}</h1>
      <div className="postText">
        <div
          dangerouslySetInnerHTML={{
            __html: truncatedText,
          }}
        />
        <button className="readMoreButton" onClick={handleReadMore}>Читать далее</button>
      </div>
    </div>
  );
}
