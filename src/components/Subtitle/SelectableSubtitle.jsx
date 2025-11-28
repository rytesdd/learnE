import { useState } from 'react';
import { translateText } from '../../utils/translationUtils';

const SelectableSubtitle = ({ text, onWordSelect }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseUp = async (e) => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const word = selection.toString().trim();
      
      // 只处理单个单词（不包含空格）
      if (word && !word.includes(' ') && word.length <= 50) {
        setSelectedWord(word);
        
        try {
          const result = await translateText(word);
          setTranslation(result);
          
          // 设置tooltip位置
          const rect = e.target.getBoundingClientRect();
          setTooltipPosition({
            x: e.clientX - rect.left + 10,
            y: e.clientY - rect.top - 10
          });
          setShowTooltip(true);
          
          // 通知父组件单词被选中（用于背单词功能）
          if (onWordSelect) {
            onWordSelect(word, result);
          }
        } catch (error) {
          console.error('翻译失败:', error);
        }
      }
    } else {
      setShowTooltip(false);
    }
  };

  // 将文本分割成单词，以便可以单独选中
  const words = text.split(/(\s+)/);

  return (
    <div className="selectable-subtitle" onMouseUp={handleMouseUp}>
      {words.map((word, index) => (
        <span key={index} className="subtitle-word">
          {word}
        </span>
      ))}
      
      {showTooltip && translation && (
        <div 
          className="translation-tooltip"
          style={{
            position: 'absolute',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            maxWidth: '300px'
          }}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="tooltip-word"><strong>{translation.word}</strong></div>
          <div className="tooltip-translation">{translation.translation}</div>
          {translation.definition && (
            <div className="tooltip-definition">{translation.definition}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectableSubtitle;

