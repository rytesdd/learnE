import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import { translateText, translateSentence } from './utils/translationUtils';

function App() {
  const [documentContent, setDocumentContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
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

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // 只有当选中的文本长度大于0且小于100个字符时才进行翻译
    if (selectedText && selectedText.length > 0 && selectedText.length <= 100) {
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
    if (!text) return;
    
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
    } catch (err) {
      setError('翻译失败，请稍后重试');
      console.error('Translation error:', err);
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>文档阅读与翻译工具</h1>
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
            {/* 复制成功提示信息 */}
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