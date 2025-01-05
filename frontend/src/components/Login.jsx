import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; 
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

    const user = { email, password };

    try {
      const response = await fetch('http://localhost:3000/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Вход выполнен успешно!');
        navigate('/');
      } else {
        setMessage(`Ошибка: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      setMessage(`Ошибка: ${error.message}`);
    }
  };

  function GoRegistratio() {
    navigate('/register');
  }
  
  function GoHome() {
    navigate('/');
  }

  return (
    <div className="loginPanel">
      <h1>LOGIN</h1>
      <input
        placeholder="Email"
        className="inputName"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        className="inputPassword"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="loginButton" onClick={handleSubmit}>LOGIN</button>
      <button className="outEventButton" onClick={GoRegistratio}>REGISTRATION</button>
      <button className="outEventButton" onClick={GoHome}>EXIT</button>
      {message && <p>{message}</p>}
    </div>
  );
}
