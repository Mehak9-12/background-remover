import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ FIX: serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ FIX: define env variable
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;

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
    res.status(500).json({ error: 'Failed to process image' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Express running on port ${PORT}`));
