// 设备优化工具
export class DeviceOptimization {
  private wakeLock: any = null
  private currentAudio: HTMLAudioElement | null = null
  private isInBackground: boolean = false

  constructor() {
    this.setupVisibilityChangeHandler()
    this.setupAudioFocusHandlers()
  }

  // 请求屏幕唤醒锁，防止设备休眠
  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen')
        console.log('屏幕唤醒锁已激活')
        
        this.wakeLock.addEventListener('release', () => {
          console.log('屏幕唤醒锁已释放')
        })
      }
    } catch (err) {
      console.log('无法获取屏幕唤醒锁:', err)
    }
  }

  // 释放屏幕唤醒锁
  releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release()
      this.wakeLock = null
    }
  }

  // 设置页面可见性变化处理
  private setupVisibilityChangeHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.onPageHidden()
      } else {
        this.onPageVisible()
      }
    })
  }

  // 设置音频焦点处理
  private setupAudioFocusHandlers() {
    // 监听页面失去焦点
    window.addEventListener('blur', () => {
      this.handleAudioFocusLoss()
    })

    // 监听页面获得焦点
    window.addEventListener('focus', () => {
      this.handleAudioFocusGain()
    })

    // 监听audio焦点变化（如果支持）
    if ('audioSession' in navigator) {
      try {
        (navigator as any).audioSession.addEventListener('statechange', (event: any) => {
          console.log('音频会话状态变化:', event.state)
        })
      } catch (e) {
        console.log('音频会话API不可用')
      }
    }
  }

  private onPageHidden() {
    console.log('页面已隐藏，优化后台播放')
    this.isInBackground = true
    // 页面隐藏时不调整音量，保持用户设置的音量
  }

  private onPageVisible() {
    console.log('页面重新可见，恢复播放设置')
    this.isInBackground = false
    // 重新请求唤醒锁
    this.requestWakeLock()
    // 页面重新可见时不调整音量，保持用户设置的音量
  }

  // 处理音频焦点丢失
  private handleAudioFocusLoss() {
    if (this.currentAudio && !this.currentAudio.paused) {
      console.log('音频焦点丢失，保持当前音量')
      // 不调整音量，保持用户设置
    }
  }

  // 处理音频焦点获得
  private handleAudioFocusGain() {
    if (this.currentAudio && !this.currentAudio.paused) {
      console.log('音频焦点恢复，保持当前音量')
      // 不调整音量，保持用户设置
    }
  }

  // 优化音频元素的设置
  optimizeAudioElement(audio: HTMLAudioElement) {
    this.currentAudio = audio
    
    // 设置音频元素属性以改善移动端体验
    audio.setAttribute('playsinline', 'true')
    audio.setAttribute('webkit-playsinline', 'true')
    audio.setAttribute('controls', 'false')
    
    // 设置音频预加载策略
    audio.preload = 'metadata'
    
    // 对于iOS Safari，这些设置很重要
    if (this.isIOS()) {
      audio.muted = false
      audio.volume = 1.0
      // iOS特定优化
      audio.setAttribute('x-webkit-airplay', 'allow')
      // 设置音频会话类别为播放
      if ('webkitAudioContext' in window) {
        try {
          const audioContext = new (window as any).webkitAudioContext()
          this.activateAudioContext(audioContext)
        } catch (e) {
          console.log('无法创建iOS音频上下文')
        }
      }
    }
    
    // Android特定优化
    if (this.isAndroid()) {
      // 设置音频焦点类型
      audio.setAttribute('preload', 'metadata')
      // 设置音频属性以获得更好的后台播放支持
      audio.setAttribute('autoplay', 'false')
    }
    
    // 通用移动设备优化
    if (this.isMobile()) {
      // 防止自动暂停
      audio.setAttribute('autoplay', 'false')
      
      // 添加音频事件监听器以处理中断
      audio.addEventListener('pause', () => {
        if (!this.isInBackground && !document.hidden) {
          console.log('意外暂停，可能是音频焦点丢失')
        }
      })

      audio.addEventListener('play', () => {
      })

      // 处理音频中断恢复
      audio.addEventListener('canplaythrough', () => {
        if (this.isInBackground && !audio.paused) {
          console.log('后台音频缓冲完成')
        }
      })
    }
  }

  // 检测是否为iOS设备
  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  // 检测是否为Android设备
  isAndroid(): boolean {
    return /Android/.test(navigator.userAgent)
  }

  // 检测是否为移动设备
  isMobile(): boolean {
    return this.isIOS() || this.isAndroid()
  }

  // 处理用户交互激活音频
  async activateAudioContext(audioContext?: AudioContext) {
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume()
        console.log('音频上下文已激活')
      } catch (err) {
        console.log('无法激活音频上下文:', err)
      }
    }
  }

  // 设置后台播放提示
  showBackgroundPlayTip() {
    // 对于PWA应用，显示如何启用后台播放的提示
    if (this.isPWA()) {
      console.log('PWA模式：后台播放应该已启用')
    } else if (this.isAndroid()) {
      // Android用户提示
      setTimeout(() => {
        console.log('提示：为了更好的后台播放体验，请在系统设置中允许此应用在后台运行')
      }, 2000)
    } else {
      console.log('建议将应用添加到主屏幕以获得更好的后台播放体验')
    }
  }

  // 检测是否运行在PWA模式
  isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true
  }

  // 电池优化提示
  suggestBatteryOptimization() {
    if (this.isAndroid()) {
      console.log('Android用户：为了防止播放中断，请在系统设置中关闭此应用的电池优化')
    }
  }

  // 获取当前播放状态
  isPlayingInBackground(): boolean {
    return this.isInBackground && !!this.currentAudio && !this.currentAudio.paused
  }

  // 清理资源
  cleanup() {
    this.releaseWakeLock()
    this.currentAudio = null
  }
}

// 单例模式
export const deviceOptimization = new DeviceOptimization()
