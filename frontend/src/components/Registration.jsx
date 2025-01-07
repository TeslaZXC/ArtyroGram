import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null); 
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length > 0;
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage('Введите корректный email.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Пароль должен быть не менее 6 символов.');
      return;
    }

    if (!validateName(name)) {
      setMessage('Имя не может быть пустым.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('password', password);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      const response = await fetch('http://localhost:3000/add-user', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Пользователь зарегистрирован!');
        navigate('/');
      } else {
        setMessage(`Ошибка: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      setMessage(`Ошибка: ${error.message}`);
    }
  };

  function GoLogin() {
    navigate('/login');
  }

  return (
    <div className="loginPanel">
      <h1>Registration</h1>
      <input
        placeholder="Email"
        className="inputEmail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Name"
        className="inputName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Password"
        className="inputPassword"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="file-upload-label">
        Загрузить аватар
        <input
          type="file"
          id="file-upload"
          onChange={handleAvatarChange}
          className="file-upload-input"
        />
      </label>

      <button className="loginButton" onClick={handleSubmit}>REGISTER</button>
      <button className="outEventButton" onClick={GoLogin}>LOGIN</button>
      {message && <p>{message}</p>}
    </div>
  );
}
