// 字幕服务 - 用于获取YouTube视频的英文字幕
import axios from 'axios';

// 模拟获取YouTube字幕的函数
const fetchYouTubeSubtitles = async (videoUrl) => {
  try {
    // 从URL中提取视频ID
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('无效的YouTube链接');
    }
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 返回模拟的英文字幕数据
    return {
      videoId,
      subtitles: [
        { text: "Hello everyone, welcome to our tutorial.", startTime: 0, duration: 5 },
        { text: "Today we're going to learn about React development.", startTime: 5, duration: 6 },
        { text: "React is a popular JavaScript library for building user interfaces.", startTime: 11, duration: 7 },
        { text: "It allows you to create reusable UI components.", startTime: 18, duration: 5 },
        { text: "Let's get started with the basics.", startTime: 23, duration: 4 },
        { text: "First, let's set up our development environment.", startTime: 27, duration: 6 },
        { text: "We'll need Node.js and npm installed.", startTime: 33, duration: 4 },
        { text: "Then we can create a new React application.", startTime: 37, duration: 5 },
        { text: "Let's use create-react-app for simplicity.", startTime: 42, duration: 4 },
        { text: "This will set up everything we need to get started.", startTime: 46, duration: 6 }
      ]
    };
  } catch (error) {
    console.error('获取字幕失败:', error);
    throw error;
  }
};

// 从YouTube URL中提取视频ID
const extractVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v');
    } else if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.substring(1);
    }
    return null;
  } catch (error) {
    console.error('解析URL失败:', error);
    return null;
  }
};

// 额外的字幕获取函数（备选）
export const fetchSubtitles = async (videoId, language = 'en') => {
  // 这里可以实现实际的API调用逻辑
  // 目前使用模拟数据
  return fetchYouTubeSubtitles(`https://www.youtube.com/watch?v=${videoId}`);
};

export { fetchYouTubeSubtitles, extractVideoId };