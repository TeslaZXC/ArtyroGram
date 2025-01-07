const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const JWT_SECRET = 'your_jwt_secret_key';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'ArtyroGram', 
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.stack);
    return;
  }
  console.log('Подключено к базе данных');
});

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {

    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

app.post('/add-user', upload.single('avatar'), (req, res) => {
  const { email, password, name } = req.body;

  const avatar = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Ошибка базы данных' });

    if (result.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует.' });
    }

    db.query(
      'INSERT INTO users (email, password, name, avatar) VALUES (?, ?, ?, ?)',
      [email, password, name, avatar],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Ошибка базы данных' });
        const token = jwt.sign({ email, avatar }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
      }
    );
  });
});

app.post('/check-user', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: 'Ошибка базы данных' });

    if (result.length > 0) {
      const user = result[0];
      const token = jwt.sign({ email, avatar: user.avatar, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Неверные данные для входа.' });
    }
  });
});

app.get('/get-user', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email } = decoded;

    db.query('SELECT name, avatar FROM users WHERE email = ?', [email], (err, result) => {
      if (err) return res.status(500).json({ error: 'Ошибка базы данных' });

      if (result.length > 0) {
        res.json(result[0]); 
      } else {
        res.status(404).json({ error: 'Пользователь не найден' });
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

app.get('/api/posts', (req, res) => {
  const query = 'SELECT * FROM posts ORDER BY created_at DESC LIMIT 10';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Ошибка получения постов:', err);
      return res.status(500).json({ message: 'Ошибка получения постов', error: err.message });
    }
    
    res.json(results);
  });
});

app.post('/create-post', upload.single('image'), (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, avatar } = decoded;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const text = req.body.text; // Get the text content from the request body

    const query = 'INSERT INTO posts (name, avatar, image, text) VALUES (?, ?, ?, ?)';
    db.query(query, [name, avatar, image, text], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка при добавлении поста' });
      }
      res.json({ message: 'Пост добавлен успешно', data: results });
    });
  } catch (error) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

app.get('/posts/:postId', (req, res) => {
  const postId = req.params.postId;

  const query = 'SELECT * FROM posts WHERE id = ?';

  db.query(query, [postId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Ошибка базы данных' });

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: 'Пост не найден' });
    }
  });
});

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
