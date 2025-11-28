// YouTube API 服务工具函数

/**
 * 从 YouTube URL 中提取视频 ID
 * @param {string} url - YouTube 视频 URL
 * @returns {string|null} - 视频 ID 或 null
 */
export function extractVideoId(url) {
  if (!url) return null;
  
  // 匹配各种 YouTube URL 格式
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // 如果 URL 本身就是视频 ID（11个字符的字符串）
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }
  
  return null;
}

