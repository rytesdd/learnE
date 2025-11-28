// 字幕服务 - 用于获取YouTube视频的英文字幕
import axios from 'axios';

/**
 * 从YouTube URL获取字幕
 * @param {string} videoUrl - YouTube视频URL
 * @returns {Promise} 返回字幕数据
 */
export const fetchYouTubeSubtitles = async (videoUrl) => {
  try {
    // 调用后端API获取字幕
    const response = await axios.post('/api/subtitle', {
      url: videoUrl
    });
    
    if (response.data && response.data.subtitle) {
      return {
        videoId: response.data.videoId,
        title: response.data.title,
        subtitles: response.data.subtitle.map(sub => ({
          text: sub.text,
          startTime: sub.start,
          duration: sub.duration
        }))
      };
    }
    
    throw new Error('未获取到字幕数据');
  } catch (error) {
    console.error('获取字幕失败:', error);
    if (error.response) {
      throw new Error(error.response.data?.error || '获取字幕失败');
    }
    throw new Error('网络错误，请稍后重试');
  }
};

