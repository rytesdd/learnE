import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import { translateText, translateSentence } from './utils/translationUtils';
import VideoLinkInput from './components/Player/VideoLinkInput';

function App() {
  const [activeTab, setActiveTab] = useState('document'); // 'document' 或 'youtube'
  const [documentContent, setDocumentContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [wordList, setWordList] = useState([]); // 背单词列表
  const [candidateWords, setCandidateWords] = useState([]); // 候选词列表
  const contentRef = useRef(null);

  // 防抖函数
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentContent(e.target.result);
        setFileName(file.name);
      };
      reader.readAsText(file);
    } else {
      alert('请选择一个有效的TXT文件');
    }
  };

  // 防抖版本的文件上传处理函数
  const debouncedHandleFileUpload = debounce(handleFileUpload, 300);

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // 如果选中的是单个单词（不包含空格），添加到候选词
    if (selectedText && !selectedText.includes(' ') && selectedText.length <= 50) {
      // 单个单词：添加到候选词并翻译
      setSelectedText(selectedText);
      try {
        const result = await fetchTranslation(selectedText);
        if (result && result.word) {
          // 添加到候选词列表
          if (!candidateWords.find(w => w.word === selectedText)) {
            setCandidateWords(prev => [...prev, { 
              word: selectedText, 
              translation: result, 
              timestamp: Date.now() 
            }]);
          }
        }
      } catch (err) {
        console.error('翻译失败:', err);
      }
    } else if (selectedText && selectedText.length > 0 && selectedText.length <= 100) {
      // 多个单词或句子：只翻译，不添加到候选词
      setSelectedText(selectedText);
      fetchTranslation(selectedText);
    } else if (selectedText.length > 100) {
      // 如果选中的文本过长，显示提示信息
      setError('选中的文本过长，请选择少于100个字符的文本进行翻译');
      setSelectedText('');
      setTranslation(null);
    } else {
      setSelectedText('');
      setTranslation(null);
    }
  };

  // 清空选择功能
  const clearSelection = () => {
    setSelectedText('');
    setTranslation(null);
    setError('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  };

  // 复制翻译结果功能
  const copyTranslation = () => {
    if (!translation) return;
    
    let textToCopy = '';
    if (translation.word) {
      // 单词翻译
      textToCopy = `单词: ${translation.word}\n翻译: ${translation.translation}\n释义: ${translation.definition}`;
    } else {
      // 句子翻译
      textToCopy = `原文: ${translation.original}\n翻译: ${translation.translation}`;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      // 显示复制成功的提示信息
      setShowCopiedMessage(true);
      // 3秒后隐藏提示信息
      setTimeout(() => {
        setShowCopiedMessage(false);
      }, 3000);
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };

  const fetchTranslation = async (text) => {
    if (!text) return null;
    
    setIsLoading(true);
    setError('');
    
    try {
      // 如果选中的文本包含空格，认为是句子，否则认为是单词
      const isSentence = text.includes(' ');
      const result = isSentence ? await translateSentence(text) : await translateText(text);
      setTranslation(result);
      
      // 平滑滚动到翻译结果区域
      setTimeout(() => {
        const translationPanel = document.querySelector('.translation-panel');
        if (translationPanel) {
          translationPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
      
      return result;
    } catch (err) {
      setError('翻译失败，请稍后重试');
      console.error('Translation error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('mouseup', handleTextSelection);
      return () => {
        contentElement.removeEventListener('mouseup', handleTextSelection);
      };
    }
  }, []);

  // 节流函数
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  };

  // 监听滚动事件，控制回到顶部按钮的显示
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 回到顶部功能
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // 处理单词选择（用于背单词和候选词功能）
  const handleWordSelect = useCallback((word, translation) => {
    // 添加到候选词列表（如果还没有）
    if (!candidateWords.find(w => w.word === word)) {
      setCandidateWords(prev => [...prev, { word, translation, timestamp: Date.now() }]);
    }
  }, [candidateWords]);

  // 添加单词到背单词列表
  const addToWordList = (word) => {
    const wordData = candidateWords.find(w => w.word === word);
    if (wordData && !wordList.find(w => w.word === word)) {
      setWordList(prev => [...prev, wordData]);
    }
  };

  // 从背单词列表移除单词
  const removeFromWordList = (word) => {
    setWordList(prev => prev.filter(w => w.word !== word));
  };

  // 清空背单词列表
  const clearWordList = () => {
    setWordList([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>学英语工具</h1>
        <div className="tab-buttons">
          <button 
            className={activeTab === 'document' ? 'active' : ''}
            onClick={() => setActiveTab('document')}
          >
            📄 文档解析
          </button>
          <button 
            className={activeTab === 'youtube' ? 'active' : ''}
            onClick={() => setActiveTab('youtube')}
          >
            🎥 YouTube字幕
          </button>
          <button 
            className={activeTab === 'words' ? 'active' : ''}
            onClick={() => setActiveTab('words')}
          >
            📚 背单词
          </button>
        </div>
      </header>
      <main className="app-main">
        <section className="document-upload-section">
          <input 
            type="file" 
            accept=".txt" 
            onChange={debouncedHandleFileUpload} 
          />
          <button onClick={() => document.querySelector('input[type="file"]').click()}>
            选择TXT文档
          </button>
          {fileName && <p className="file-name">已选择: {fileName}</p>}
        </section>
        
        {documentContent && (
          <section className="document-content" ref={contentRef}>
            <h2>文档内容</h2>
            <div className="content-text">
              <pre>{documentContent}</pre>
            </div>
          </section>
        )}
        
        {activeTab === 'document' && (
          <>
            <section className="document-upload-section">
              <input 
                type="file" 
                accept=".txt" 
                onChange={debouncedHandleFileUpload} 
              />
              <button onClick={() => document.querySelector('input[type="file"]').click()}>
                选择TXT文档
              </button>
              {fileName && <p className="file-name">已选择: {fileName}</p>}
            </section>
            
            {documentContent && (
              <section className="document-content" ref={contentRef}>
                <h2>文档内容（点击单词查看翻译并添加到候选词）</h2>
                <div className="content-text">
                  <pre>{documentContent}</pre>
                </div>
              </section>
            )}
            
            {(selectedText || isLoading || translation || error) && (
              <div className="translation-panel">
                <h3>翻译结果</h3>
                {isLoading && (
                  <div className="loading-container">
                    <span className="loading"></span>
                    翻译中...
                  </div>
                )}
                {error && <p className="error-message">{error}</p>}
                {translation && !isLoading && (
                  <div className="translation-item">
                    {translation.word ? (
                      <>
                        <p><strong>单词:</strong> {translation.word}</p>
                        <p><strong>翻译:</strong> {translation.translation}</p>
                        <p><strong>释义:</strong> {translation.definition}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>原文:</strong> {translation.original}</p>
                        <p><strong>翻译:</strong> {translation.translation}</p>
                      </>
                    )}
                  </div>
                )}
                {!translation && !isLoading && !error && selectedText && (
                  <p>未找到 "{selectedText}" 的翻译</p>
                )}
                {showCopiedMessage && (
                  <div className="copied-message">
                    ✅ 翻译结果已复制到剪贴板
                  </div>
                )}
                <div className="translation-actions">
                  <button className="copy-translation-btn" onClick={copyTranslation}>
                    复制翻译结果
                  </button>
                  <button className="clear-selection-btn" onClick={clearSelection}>
                    清空选择
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'youtube' && (
          <section className="youtube-section">
            <VideoLinkInput 
              onSubtitlesLoaded={(subtitles) => {
                console.log('字幕已加载:', subtitles.length);
              }}
              onWordSelect={handleWordSelect}
            />
          </section>
        )}

        {activeTab === 'words' && (
          <section className="words-section">
            <div className="words-header">
              <h2>背单词</h2>
              <div className="words-stats">
                <span>候选词: {candidateWords.length}</span>
                <span>已添加: {wordList.length}</span>
              </div>
            </div>

            {candidateWords.length > 0 && (
              <div className="candidate-words">
                <h3>候选词（点击添加到背单词列表）</h3>
                <div className="candidate-list">
                  {candidateWords.map((item, index) => (
                    <div key={index} className="candidate-word-item">
                      <div className="word-info">
                        <strong>{item.word}</strong>
                        <span>{item.translation.translation}</span>
                      </div>
                      <button 
                        onClick={() => addToWordList(item.word)}
                        disabled={wordList.find(w => w.word === item.word)}
                      >
                        {wordList.find(w => w.word === item.word) ? '已添加' : '添加'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {wordList.length > 0 && (
              <div className="word-list">
                <div className="word-list-header">
                  <h3>我的单词本 ({wordList.length})</h3>
                  <button onClick={clearWordList} className="clear-btn">清空列表</button>
                </div>
                <div className="word-list-items">
                  {wordList.map((item, index) => (
                    <div key={index} className="word-item">
                      <div className="word-content">
                        <strong>{item.word}</strong>
                        <span>{item.translation.translation}</span>
                        {item.translation.definition && (
                          <p className="definition">{item.translation.definition}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => removeFromWordList(item.word)}
                        className="remove-btn"
                      >
                        移除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {wordList.length === 0 && candidateWords.length === 0 && (
              <div className="empty-state">
                <p>还没有单词</p>
                <p>在 YouTube 字幕中点击单词查看翻译，它们会自动出现在候选词列表中</p>
              </div>
            )}
          </section>
        )}
      </main>
      {/* 回到顶部按钮 */}
      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop} aria-label="回到顶部">
          ↑
        </button>
      )}
    </div>
  );
}

export default App;