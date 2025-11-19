import { useState } from 'react'
import { translateWord } from '../../services/translation/translationService'

const SelectableSubtitle = ({ text }) => {
  const [selectedWord, setSelectedWord] = useState(null)
  const [translation, setTranslation] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const handleMouseUp = async (e) => {
    const selection = window.getSelection()
    if (selection && selection.toString()) {
      const word = selection.toString().trim()
      setSelectedWord(word)
      
      try {
        const result = await translateWord(word)
        setTranslation(result)
        
        // 设置tooltip位置
        const rect = e.target.getBoundingClientRect()
        setTooltipPosition({
          x: e.clientX - rect.left + 10,
          y: e.clientY - rect.top - 10
        })
        setShowTooltip(true)
      } catch (error) {
        console.error('Failed to translate:', error)
      }
    } else {
      setShowTooltip(false)
    }
  }

  // 将文本分割成单词，以便可以单独选中
  const words = text.split(/\s+/)

  return (
    <div className="selectable-subtitle" onMouseUp={handleMouseUp}>
      {words.map((word, index) => (
        <span key={index} className="subtitle-word">
          {word}{index < words.length - 1 ? ' ' : ''}
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
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="tooltip-word">{translation.word}</div>
          <div className="tooltip-translation">{translation.translation}</div>
          <div className="tooltip-definitions">
            {translation.definitions.map((def, i) => (
              <div key={i} className="tooltip-definition">• {def}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectableSubtitle