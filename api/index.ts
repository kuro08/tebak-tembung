import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { wordsPart1 } from '../src/data/wordsPart1.js';
import { wordsPart2 } from '../src/data/wordsPart2.js';
import { wordsPart3 } from '../src/data/wordsPart3.js';
import { wordsPart4 } from '../src/data/wordsPart4.js';
import { wordsPart5 } from '../src/data/wordsPart5.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Combine all word data parts
const JAVANESE_WORDS_DATA = [
  ...wordsPart1,
  ...wordsPart2,
  ...wordsPart3,
  ...wordsPart4,
  ...wordsPart5
];

const app = express();

// API Route to get the daily word securely
app.get('/api/daily-word', (req, res) => {
  try {
    // Use UTC+7 (Java Time) days since epoch for stability
    // This changes exactly at 00:00 WIB (UTC+7)
    const JAVA_OFFSET = 7 * 3600000;
    const now = Date.now();
    const daysSinceEpoch = Math.floor((now + JAVA_OFFSET) / 86400000);
    
    // Fixed offset to ensure "KUDU" is the word for today (2026-04-12 Java Time)
    const offset = 70; 
    
    if (!JAVANESE_WORDS_DATA || JAVANESE_WORDS_DATA.length === 0) {
      throw new Error('JAVANESE_WORDS_DATA is empty or undefined');
    }

    const wordIndex = (daysSinceEpoch + offset) % JAVANESE_WORDS_DATA.length;
    const selected = JAVANESE_WORDS_DATA[wordIndex];
    
    if (!selected) {
      throw new Error(`Failed to select word at index ${wordIndex}`);
    }

    // Return ONLY the word and hints for today
    res.json({
      word: (selected.word || 'KUDU').toUpperCase(),
      hints: selected.hints || { jv: 'Pituduh...', id: 'Petunjuk...', en: 'Hint...' }
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error instanceof Error ? error.message : String(error) 
    });
  }
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not in a serverless environment
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

if (process.env.NODE_ENV !== 'production') {
  startServer();
}

export default app;
