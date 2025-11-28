// Vercel Serverless Function - /api/upload
import { extractVideoId } from '../src/services/subtitles/youtubeApiService.js';

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, fileName } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    res.json({
      success: true,
      message: 'Document uploaded successfully',
      fileName: fileName || 'untitled.txt',
      contentLength: content.length
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
}

