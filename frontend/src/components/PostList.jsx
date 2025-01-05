import React, { useEffect, useState } from 'react';
import Post from './Post';

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/posts')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка получения постов:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p>Ошибка: {error}</p>;
    }

    return (
        <main>
            <div className="postList">
                {posts.length === 0 ? (
                    <p>Посты не найдены</p>
                ) : (
                    posts.map(post => (
                        <Post key={post.id} post={post} />
                    ))
                )}
            </div>
        </main>
    );
}
