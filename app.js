const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// In-memory data (resets when the container restarts)
let tasks = [{ id: 1, title: 'Learn Docker' }, { id: 2, title: 'Set up CI/CD' }];
let nextId = 3;

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/tasks', (_req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) return res.status(400).json({ error: 'title is required' });
  const task = { id: nextId++, title };
  tasks.push(task);

  console.info(JSON.stringify({
    event: 'task.created',
    taskId: task.id,
    timestamp: new Date().toISOString()
  }));
  
  res.status(201).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  tasks = tasks.filter(t => t.id !== Number(req.params.id));

  if (task) {
    console.info(JSON.stringify({
      event: 'task.deleted',
      taskId: id,
      timestamp: new Date().toISOString()
    }));
  }

  res.status(204).end();
});

// Static files + SPA fallback (client-side routing)
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

module.exports = app;
