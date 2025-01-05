import React from 'react';

export default function Post({ post }) {
    return (
        <div className="post">
            <img className="postImg" src={"http://localhost:3000" + post.image || 'defaultPhoto.jpg'} alt="Post" />
            <img className="postAvatar" src={post.avatar || 'defaultAvatar.jpg'} alt="Avatar" />
            <h1 className="postUserName">{post.name}</h1>
        </div>
    );
}
