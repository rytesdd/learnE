import { useState } from 'react'
import YouTube from 'react-youtube'

const YouTubePlayer = ({ videoId, onPlayerReady, onTimeUpdate }) => {
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0,
      cc_load_policy: 1, // 自动显示字幕
    },
  }

  return (
    <div className="youtube-player">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={(event) => {
          if (event.data === 1) { // 播放状态
            setInterval(() => {
              if (onTimeUpdate) {
                onTimeUpdate(event.target.getCurrentTime())
              }
            }, 1000)
          }
        }}
      />
    </div>
  )
}

export default YouTubePlayer