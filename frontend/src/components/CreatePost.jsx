import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Check if the user is logged in (token is available in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect or display error message
      setMessage('Ошибка: зайдите в свой аккаунт');
    }
  }, []); // This useEffect will run once on component mount

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');  // Check for token again on form submission
    if (!token) {
      setMessage('Ошибка: зайдите в свой аккаунт');
      return; // Prevent form submission if no token
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:3000/create-post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Пост успешно добавлен!');
      } else {
        setMessage(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage('Ошибка при отправке запроса.');
    }
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="createPostWrapper">
      <button className="button" id="logoutButton" onClick={handleLogout}>Выйти</button>
      {message ? (
        <div className="errorMessage">{message}</div> // Display error message on the whole screen if no token
      ) : (
        <div className="formContainer">
          <h1>Создать пост</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              onChange={handleImageChange}
            />
            <button type="submit" className="submitButton" disabled={!image}>Добавить пост</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
}
