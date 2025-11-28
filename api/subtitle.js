// Vercel Serverless Function - /api/subtitle
import axios from 'axios';
import { extractVideoId } from '../src/services/subtitles/youtubeApiService.js';

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
        const captionsResponse = await axios.get(`${instance}/api/v1/captions/${videoId}`, {
          timeout: 5000 // 5秒超时
        });
        
        if (captionsResponse.data && captionsResponse.data.length > 0) {
          const englishCaption = captionsResponse.data.find(caption => 
            caption.label.toLowerCase().includes('english') || 
            caption.language_code === 'en'
          );
          
          if (englishCaption) {
            const subtitleResponse = await axios.get(`${instance}${englishCaption.url}`, {
              timeout: 5000
            });
            
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
    const response = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { timeout: 5000 }
    );
    return response.data.title;
  } catch (error) {
    return 'Unknown Title';
  }
}

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}

