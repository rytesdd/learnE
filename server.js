// YouTube字幕API服务器
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { extractVideoId } from './src/services/subtitles/youtubeApiService.js';

const app = express();
const PORT = process.env.PORT || 3002; // 更改端口为3002以避免冲突

// 中间件 - 配置 CORS 以支持来自 Vercel 前端的请求
// 先手动处理所有请求的 CORS 头，确保 Access-Control-Allow-Credentials 被设置
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://new-english-17tq.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  // 检查是否是允许的源
  if (origin && (
    allowedOrigins.includes(origin) || 
    /\.vercel\.app$/.test(origin)
  )) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }
  }
  next();
});

// 也使用 cors 中间件作为备用
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://new-english-17tq.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

app.use(express.json());

// 模拟字幕数据 - 用于测试
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

// 获取YouTube视频信息的新方法
async function getVideoInfo(videoId) {
  try {
    // 使用invidious API获取视频信息（这是一个开源的YouTube前端）
    const invidiousInstances = [
      'https://invidious.snopyta.org',
      'https://invidious.kavin.rocks',
      'https://invidious-us.kavin.rocks'
    ];
    
    for (const instance of invidiousInstances) {
      try {
        const response = await axios.get(`${instance}/api/v1/captions/${videoId}?hl=en`);
        if (response.data && response.data.captions) {
          return response.data;
        }
      } catch (err) {
        console.log(`Invidious实例 ${instance} 请求失败，尝试下一个...`);
        continue;
      }
    }
    
    // 如果所有invidious实例都失败了，使用备用方法
    throw new Error('所有Invidious实例都无法访问');
  } catch (error) {
    console.error('获取视频信息失败:', error.message);
    return null;
  }
}

// 从YouTube获取字幕的新方法
async function fetchSubtitlesFromYouTube(videoId) {
  try {
    console.log(`尝试通过Invidious API获取视频 ${videoId} 的字幕`);
    
    // 使用invidious API获取字幕
    const invidiousInstances = [
      'https://invidious.snopyta.org',
      'https://invidious.kavin.rocks',
      'https://invidious-us.kavin.rocks'
    ];
    
    for (const instance of invidiousInstances) {
      try {
        // 首先获取可用的字幕语言
        const captionsResponse = await axios.get(`${instance}/api/v1/captions/${videoId}`);
        
        if (captionsResponse.data && captionsResponse.data.length > 0) {
          // 获取英文字幕
          const englishCaption = captionsResponse.data.find(caption => 
            caption.label.toLowerCase().includes('english') || 
            caption.language_code === 'en'
          );
          
          if (englishCaption) {
            // 获取字幕内容
            const subtitleResponse = await axios.get(`${instance}${englishCaption.url}`);
            
            if (subtitleResponse.data && subtitleResponse.data.subtitles) {
              console.log(`成功通过Invidious API获取字幕数据，共 ${subtitleResponse.data.subtitles.length} 条`);
              return subtitleResponse.data.subtitles;
            }
          }
        }
      } catch (err) {
        console.log(`Invidious实例 ${instance} 请求失败，尝试下一个...`);
        continue;
      }
    }
    
    // 如果所有invidious实例都失败了，返回空数组
    console.log('所有Invidious实例都无法获取字幕');
    return [];
  } catch (error) {
    console.error('通过Invidious API获取字幕失败:', error.message);
    return [];
  }
}

// 获取视频标题的新方法
async function getVideoTitle(videoId) {
  try {
    // 使用oembed获取视频标题
    const response = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    return response.data.title;
  } catch (error) {
    console.error('通过oembed获取视频标题失败:', error.message);
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
    
    // 提取视频ID
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    console.log(`处理视频ID: ${videoId}`);
    
    // 获取视频标题
    const title = await getVideoTitle(videoId);
    console.log(`视频标题: ${title}`);
    
    // 获取英文字幕（默认）
    let captions = await fetchSubtitlesFromYouTube(videoId);
    
    // 如果通过Invidious API没有获取到字幕，则使用模拟数据
    if (!captions || captions.length === 0) {
      console.log('无法通过Invidious API获取字幕，使用模拟数据');
      captions = MOCK_SUBTITLES[videoId] || [];
    }
    
    // 格式化字幕数据
    const subtitle = captions.map(caption => ({
      start: caption.start || caption.startTime,
      duration: caption.duration || (caption.end - caption.start) || (caption.endTime - caption.startTime),
      text: caption.text
    }));
    
    // 返回结果
    res.json({
      videoId,
      title,
      availableLang: ['en'], // 简化处理，只返回英语
      subtitle
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch subtitles' });
  }
});

// 文档上传端点（用于解析文档）
app.post('/api/upload', async (req, res) => {
  try {
    const { content, fileName } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // 这里可以添加文档处理逻辑
    // 目前只是返回成功响应
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

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`YouTube Subtitle API Server is running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/subtitle`);
});

export default app;