import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Ошибка: зайдите в свой аккаунт');
    }
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTextChange = (value) => {
    setText(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Ошибка: зайдите в свой аккаунт');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    const htmlContent = text; // ReactQuill stores HTML content
    formData.append('text', htmlContent); // Add the HTML content to form data

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
        setMessage(`Ошибка: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage('Ошибка при отправке запроса.');
    }
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to the home page or login page
  };

  return (
    <div className="createPostWrapper">
      <button className="buttonExit" id="logoutButton" onClick={handleLogout}>
        Выйти
      </button>
      {message ? (
        <div className="errorMessage">{message}</div>
      ) : (
        <div className="formContainer">
          <h1>Создать пост</h1>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleImageChange} />
            <ReactQuill
              value={text}
              onChange={handleTextChange}
              placeholder="Введите текст поста"
              modules={{
                toolbar: [
                  [{ 'header': '1'}, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  [{ 'align': [] }],
                  ['link', 'image'],
                  [{ 'color': [] }, { 'background': [] }],
                  ['blockquote', 'code-block'],
                ],
              }}
            />
            <button type="submit" className="submitButton" disabled={!image || !text}>
              Добавить пост
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
}
