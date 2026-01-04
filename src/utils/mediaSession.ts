import type { RadioStation } from '@/types/radio'

export class MediaSessionManager {
  constructor() {
    this.setupMediaSession()
  }

  private setupMediaSession() {
    if ('mediaSession' in navigator) {
      // 设置默认的媒体处理程序
      navigator.mediaSession.setActionHandler('play', () => {
        this.handlePlay()
      })

      navigator.mediaSession.setActionHandler('pause', () => {
        this.handlePause()
      })

      navigator.mediaSession.setActionHandler('stop', () => {
        this.handleStop()
      })

      // 如果支持，还可以添加其他控制
      try {
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          this.handlePreviousTrack()
        })

        navigator.mediaSession.setActionHandler('nexttrack', () => {
          this.handleNextTrack()
        })
      } catch (error) {
        console.log('某些媒体会话功能不受支持')
      }
    }
  }

  updateMetadata(station: RadioStation) {
    if ('mediaSession' in navigator) {
      try {
        // 准备艺术作品数组
        const defaultArtwork = '/favicon.svg'
        const artworkSrc = station.favicon || defaultArtwork
        
        // 确保artwork URL是完整的
        const fullArtworkUrl = artworkSrc.startsWith('http') ? artworkSrc : 
                              artworkSrc.startsWith('/') ? window.location.origin + artworkSrc :
                              window.location.origin + '/' + artworkSrc
        
        navigator.mediaSession.metadata = new MediaMetadata({
          title: station.name || '未知电台',
          artist: station.country || '全球电台',
          album: '在线广播',
          artwork: [
            {
              src: fullArtworkUrl,
              sizes: '96x96',
              type: 'image/svg+xml'
            },
            {
              src: fullArtworkUrl,
              sizes: '128x128',
              type: 'image/svg+xml'
            },
            {
              src: fullArtworkUrl,
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: fullArtworkUrl,
              sizes: '256x256',
              type: 'image/svg+xml'
            },
            {
              src: fullArtworkUrl,
              sizes: '384x384',
              type: 'image/svg+xml'
            },
            {
              src: fullArtworkUrl,
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        })
        
        console.log('媒体会话元数据已更新:', station.name)
      } catch (error) {
        console.error('更新媒体会话元数据失败:', error)
      }
    }
  }

  updatePlaybackState(isPlaying: boolean) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
    }
  }

  // 这些方法需要与您的播放器 store 连接
  private handlePlay() {
    // 这里应该调用您的播放器的播放方法
    window.dispatchEvent(new CustomEvent('mediaSession:play'))
  }

  private handlePause() {
    // 这里应该调用您的播放器的暂停方法
    window.dispatchEvent(new CustomEvent('mediaSession:pause'))
  }

  private handleStop() {
    // 这里应该调用您的播放器的停止方法
    window.dispatchEvent(new CustomEvent('mediaSession:stop'))
  }

  private handlePreviousTrack() {
    // 可选：实现上一个电台的功能
    window.dispatchEvent(new CustomEvent('mediaSession:previoustrack'))
  }

  private handleNextTrack() {
    // 可选：实现下一个电台的功能
    window.dispatchEvent(new CustomEvent('mediaSession:nexttrack'))
  }

  // 清理媒体会话
  clear() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null
      navigator.mediaSession.playbackState = 'none'
    }
  }
}

// 单例模式
export const mediaSessionManager = new MediaSessionManager()
