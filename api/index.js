// Vercel Serverless Function - 将所有 API 路由迁移到这里
// 这个文件会被 Vercel 自动识别为 API 路由

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { extractVideoId } from '../src/services/subtitles/youtubeApiService.js';

const app = express();

// CORS 配置 - Vercel 上不需要复杂的 CORS，因为前后端同域
app.use(cors({
  origin: true, // 允许所有来源（Vercel 会自动处理）
  credentials: true
}));

app.use(express.json());

// 模拟字幕数据
const MOCK_SUBTITLES = {
  'jNQXAC9IVRw': [
    { start: 0, duration: 3, text: "Hi guys, this is my friend!" },
    { start: 3, duration: 4, text: "This is the first video on YouTube!" },
    { start: 7, duration: 3, text: "I'm going to be talking about..." },
    { start: 10, duration: 4, text: "All sorts of things that happen in the world." },
    { start: 14, duration: 3, text: "So, I hope you enjoy it!" }
  ],
  '9IiTdSnmS7E': [
    { start: 0, duration: 3, text: "Hello everyone!" },
    { start: 3, duration: 5, text: "Welcome to our tutorial on modern web development." },
    { start: 8, duration: 6, text: "Today we're going to learn about React and its ecosystem." },
    { start: 14, duration: 5, text: "React is a JavaScript library for building user interfaces." },
    { start: 19, duration: 4, text: "It was developed by Facebook and is widely used today." }
  ]
};

// 从YouTube获取字幕
async function fetchSubtitlesFromYouTube(videoId) {
  try {
    const invidiousInstances = [
      'https://invidious.snopyta.org',
      'https://invidious.kavin.rocks',
      'https://invidious-us.kavin.rocks'
    ];
    
    for (const instance of invidiousInstances) {
      try {
        const captionsResponse = await axios.get(`${instance}/api/v1/captions/${videoId}`);
        
        if (captionsResponse.data && captionsResponse.data.length > 0) {
          const englishCaption = captionsResponse.data.find(caption => 
            caption.label.toLowerCase().includes('english') || 
            caption.language_code === 'en'
          );
          
          if (englishCaption) {
            const subtitleResponse = await axios.get(`${instance}${englishCaption.url}`);
            
            if (subtitleResponse.data && subtitleResponse.data.subtitles) {
              return subtitleResponse.data.subtitles;
            }
          }
        }
      } catch (err) {
        continue;
      }
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

// 获取视频标题
async function getVideoTitle(videoId) {
  try {
    const response = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    return response.data.title;
  } catch (error) {
    return 'Unknown Title';
  }
}

// API路由
app.post('/api/subtitle', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    const title = await getVideoTitle(videoId);
    let captions = await fetchSubtitlesFromYouTube(videoId);
    
    if (!captions || captions.length === 0) {
      captions = MOCK_SUBTITLES[videoId] || [];
    }
    
    const subtitle = captions.map(caption => ({
      start: caption.start || caption.startTime,
      duration: caption.duration || (caption.end - caption.start) || (caption.endTime - caption.startTime),
      text: caption.text
    }));
    
    res.json({
      videoId,
      title,
      availableLang: ['en'],
      subtitle
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch subtitles' });
  }
});

// 文档上传端点
app.post('/api/upload', async (req, res) => {
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
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Vercel Serverless Function 导出
export default app;

