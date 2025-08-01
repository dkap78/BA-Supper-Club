
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to update content.json
app.post('/api/update-content', async (req, res) => {
  try {
    const contentPath = path.join(__dirname, 'src', 'data', 'content.json');
    await fs.writeFile(contentPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ success: false, message: 'Failed to update content' });
  }
});

// API endpoint to update feedbacks.json
app.post('/api/update-feedbacks', async (req, res) => {
  try {
    const feedbacksPath = path.join(__dirname, 'src', 'data', 'feedbacks.json');
    await fs.writeFile(feedbacksPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Feedbacks updated successfully' });
  } catch (error) {
    console.error('Error updating feedbacks:', error);
    res.status(500).json({ success: false, message: 'Failed to update feedbacks' });
  }
});

// API endpoint to update admin.json
app.post('/api/update-admin', async (req, res) => {
  try {
    const adminPath = path.join(__dirname, 'src', 'data', 'admin.json');
    await fs.writeFile(adminPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Admin data updated successfully' });
  } catch (error) {
    console.error('Error updating admin data:', error);
    res.status(500).json({ success: false, message: 'Failed to update admin data' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
