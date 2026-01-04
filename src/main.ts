import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useLanguageStore } from './stores/language'
import './style.css'
import { Keyboard } from '@capacitor/keyboard'
import { Capacitor } from '@capacitor/core'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化语言系统并等待完成
const initApp = async () => {
  const languageStore = useLanguageStore()
  await languageStore.initLanguage()
  app.mount('#app')

  // 安卓平台下监听键盘事件，提升输入兼容性
  if (Capacitor.getPlatform() === 'android') {
    Keyboard.addListener('keyboardWillShow', () => {})
    Keyboard.addListener('keyboardDidShow', () => {})
    Keyboard.addListener('keyboardWillHide', () => {})
    Keyboard.addListener('keyboardDidHide', () => {})
  }
}

initApp()
