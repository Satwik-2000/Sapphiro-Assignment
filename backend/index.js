const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = parseInt(process.env.PORT) || 4000;
const JWT_SECRET = 'skjdbkwlews';

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [
  { id: 1, title: 'Interview at Sapphiro', completed: false },
  { id: 2, title: 'Attend blockchain class', completed: true }
];
let nextId = 3;

// Hardcoded user for demo
const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('sapphiro_admin', 10)
  }
];

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare passwords
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ 
    token,
    user: { id: user.id, username: user.username }
  });
});

// Task endpoints
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Protected routes
app.post('/tasks', authenticateToken, (req, res) => {
  const { title, completed = false } = req.body;
  
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: Boolean(completed)
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;
  
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    tasks[taskIndex].title = title.trim();
  }

  if (completed !== undefined) {
    tasks[taskIndex].completed = Boolean(completed);
  }

  res.json(tasks[taskIndex]);
});

app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks = tasks.filter(task => task.id !== id);
  res.status(204).send();
});

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});