import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'https://mehak9-12.github.io',
  }),
);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000/process-image';

// Health check route for Render
app.get('/health', (req, res) => res.send('Backend is healthy'));

app.post('/remove-bg', upload.single('file'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(PYTHON_SERVICE_URL, form, {
      headers: form.getHeaders(),
      responseType: 'arraybuffer',
    });

    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (err) {
    console.error('Error details:', err.message); // Added for easier debugging in Render logs
    res.status(500).json({ error: 'Failed to process image' });
  }
});

const PORT = process.env.PORT || 5000;

// 2. CHANGE: Listen on '0.0.0.0' (Required for Render)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express running on port ${PORT}`);
});
