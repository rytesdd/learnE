import React, { useState, useEffect, useRef } from 'react';
import { fetchYouTubeSubtitles } from '../../services/subtitles/subtitleService';

const VideoLinkInput = ({ onSubtitlesLoaded }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subtitles, setSubtitles] = useState([]);
  const [selectedWords, setSelectedWords] = useState(new Set());
  const subtitleRefs = useRef({});
  
  // 阻止空格键滚动页面的默认行为
  useEffect(() => {
    const handleSpaceKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); // 阻止空格键滚动页面
      }
    };
    
    window.addEventListener('keydown', handleSpaceKey);
    return () => {
      window.removeEventListener('keydown', handleSpaceKey);
    };
  }, []);

  // 重置选中状态当字幕变化时
  useEffect(() => {
    setSelectedWords(new Set());
    subtitleRefs.current = {};
  }, [subtitles]);

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
    setError('');
    
    // 自动检测URL有效性并尝试获取字幕
    if (e.target.value.trim() && isValidYouTubeUrl(e.target.value)) {
      handleFetchSubtitles(e.target.value);
    } else if (!e.target.value.trim()) {
      setSubtitles([]);
    }
  };

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
      if (onSubtitlesLoaded) {
        onSubtitlesLoaded(result.subtitles);
      }
    } catch (err) {
      setError(err.message || '获取字幕失败，请检查链接是否正确');
      setSubtitles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      handleFetchSubtitles(videoUrl);
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
            onChange={handleUrlChange}
            placeholder="https://www.youtube.com/watch?v=... 或 https://youtu.be/..."
            className="url-input"
          />
          <button type="submit" disabled={loading || !videoUrl.trim()}>
            {loading ? '获取中...' : '获取字幕'}
          </button>
        </div>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {subtitles.length > 0 && (
        <div className="subtitles-container">
          <h3>英文字幕内容：</h3>
          <div className="subtitles">
            {subtitles.map((subtitle, index) => (
              <div key={index} className="subtitle-line">
                {subtitle.text.split(/\s+/).map((word, wordIndex) => {
                  const wordId = `${index}-${wordIndex}`;
                  const isSelected = selectedWords.has(wordId);
                  
                  return (
                    <span 
                      key={wordIndex} 
                      className={`subtitle-word ${isSelected ? 'selected' : ''}`}
                      id={wordId}
                      ref={(el) => subtitleRefs.current[wordId] = el}
                      onClick={() => {
                        const newSelectedWords = new Set(selectedWords);
                        if (isSelected) {
                          newSelectedWords.delete(wordId);
                        } else {
                          newSelectedWords.add(wordId);
                        }
                        setSelectedWords(newSelectedWords);
                      }}
                    >
                      {word}
                      {wordIndex < subtitle.text.split(/\s+/).length - 1 && ' '}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLinkInput;