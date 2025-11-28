import React, { useState } from 'react';
import { fetchYouTubeSubtitles } from '../../services/subtitles/subtitleService';
import SelectableSubtitle from '../Subtitle/SelectableSubtitle';

const VideoLinkInput = ({ onSubtitlesLoaded, onWordSelect }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subtitles, setSubtitles] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');

  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleFetchSubtitles = async (url) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await fetchYouTubeSubtitles(url);
      setSubtitles(result.subtitles);
      setVideoTitle(result.title || '');
      
      if (onSubtitlesLoaded) {
        onSubtitlesLoaded(result.subtitles);
      }
    } catch (err) {
      setError(err.message || '获取字幕失败，请检查链接是否正确');
      setSubtitles([]);
      setVideoTitle('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videoUrl.trim() && isValidYouTubeUrl(videoUrl)) {
      handleFetchSubtitles(videoUrl);
    } else {
      setError('请输入有效的YouTube链接');
    }
  };

  return (
    <div className="video-link-input">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="youtube-link">粘贴YouTube视频链接：</label>
          <input
            type="text"
            id="youtube-link"
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setError('');
            }}
            placeholder="https://www.youtube.com/watch?v=... 或 https://youtu.be/..."
            className="url-input"
          />
          <button type="submit" disabled={loading || !videoUrl.trim()}>
            {loading ? '获取中...' : '获取字幕'}
          </button>
        </div>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {videoTitle && (
        <div className="video-title">
          <h3>{videoTitle}</h3>
        </div>
      )}
      
      {subtitles.length > 0 && (
        <div className="subtitles-container">
          <h3>英文字幕内容（点击单词查看翻译）：</h3>
          <div className="subtitles">
            {subtitles.map((subtitle, index) => (
              <div key={index} className="subtitle-line">
                <SelectableSubtitle 
                  text={subtitle.text} 
                  onWordSelect={onWordSelect}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLinkInput;

