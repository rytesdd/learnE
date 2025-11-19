import { useState } from 'react'
import VideoLinkInput from './components/Player/VideoLinkInput'
import './App.css'

function App() {
  const [subtitles, setSubtitles] = useState([]);

  const handleSubtitlesLoaded = (loadedSubtitles) => {
    setSubtitles(loadedSubtitles);
    console.log('字幕已加载:', loadedSubtitles);
  };

  return (
    <div className="app">
      <header className="app-header">
      </header>
      <main className="app-main">
        <VideoLinkInput onSubtitlesLoaded={handleSubtitlesLoaded} />
      </main>
    </div>
  )
}

export default App
