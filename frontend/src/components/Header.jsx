import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);  
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchUserData(token);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('http://localhost:3000/get-user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
            } else {
                setIsLoggedIn(false);
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            setIsLoggedIn(false);
            localStorage.removeItem('token');
        }
    };

    function handleLogin() {
        navigate('/login');
    }

    function handleExit() {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null); 
        navigate('/login');
    }

    function GoCreatePost() {
        navigate('createPost')
    }

    return (
        <header className="mainHeader">
            <h1>ARTYRO GRAM</h1>
            {isLoggedIn ? (
                <div className="user-info">
                    <img src={user?.avatar} alt="User Avatar" className="avatar" />
                    <span>{user?.name}</span>
                    <button onClick={GoCreatePost} className='button'>Add post</button>
                    <button onClick={handleExit} className='button'>Exit</button>
                </div>
            ) : (
                <button onClick={handleLogin} className='button'>Login</button>
            )}
        </header>
    );
}
