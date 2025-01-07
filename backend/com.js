const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const app = express();
const JWT_SECRET = 'your_jwt_secret'; // Ваш секрет для JWT

// Настройка подключения к базе данных MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Замените на ваше имя пользователя
  password: '',  // Замените на ваш пароль
  database: 'ArtyroGram'  // Замените на ваше имя базы данных
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключено к базе данных MySQL');
});

app.use(express.json());

// Получение всех комментариев для конкретного поста
app.get('/comments/:postId', (req, res) => {
  const postId = req.params.postId;

  // Получаем комментарии для поста
  db.query('SELECT * FROM comments WHERE post_id = ?', [postId], (err, comments) => {
    if (err) {
      console.error('Ошибка при получении комментариев:', err);
      return res.status(500).json({ error: 'Error fetching comments' });
    }

    if (comments.length === 0) {
      return res.status(404).json({ error: 'No comments found for this post' });
    }

    // Отправляем комментарии в формате JSON
    res.json(comments);
  });
});

// Добавление нового комментария
app.post('/comments/:postId', (req, res) => {
  const postId = req.params.postId;
  const { text } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // Декодируем токен
    const email = decoded.email;  // Используем email для поиска userId

    // Получаем user_id по email
    db.query('SELECT id FROM users WHERE email = ?', [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = result[0].id;

      // Добавляем комментарий в базу данных
      const query = 'INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)';
      db.query(query, [postId, userId, text], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error adding comment' });
        }

        const newComment = {
          id: result.insertId,
          text: text,
          user_id: userId,
        };

        res.status(201).json(newComment);  // Отправляем новый комментарий в ответе
      });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Настройка порта
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
