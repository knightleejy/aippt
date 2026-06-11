const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'content.json');
const PASSWORD = 'admin123';

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Load initial data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) { console.error('Load error:', e.message); }
  return { content: {}, sectionOrder: [], version: 1, updatedAt: Date.now() };
}

// Save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/content - Public read
app.get('/api/content', (req, res) => {
  const data = loadData();
  res.json(data);
});

// POST /api/content - Protected write
app.post('/api/content', (req, res) => {
  const { password, content, sectionOrder } = req.body;
  if (password !== PASSWORD) {
    return res.status(401).json({ error: '密码错误' });
  }
  const data = {
    content: content || {},
    sectionOrder: sectionOrder || [],
    version: (loadData().version || 1) + 1,
    updatedAt: Date.now()
  };
  saveData(data);
  res.json({ success: true, version: data.version });
});

// DELETE /api/content - Reset (protected)
app.delete('/api/content', (req, res) => {
  const password = req.headers.authorization;
  if (password !== PASSWORD) {
    return res.status(401).json({ error: '密码错误' });
  }
  saveData({ content: {}, sectionOrder: [], version: 1, updatedAt: Date.now() });
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0', timestamp: Date.now() });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
