const menuLabels = {
  en: {
    app: 'App',
    serverSettings: 'Server Settings',
    quit: 'Quit',
    view: 'View',
    reload: 'Reload',
    forceReload: 'Force Reload',
    resetZoom: 'Reset Zoom',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fullscreen: 'Toggle Fullscreen',
    appTitle: 'Global Radio'
  },
  zh: {
    app: '应用',
    serverSettings: '服务器设置',
    quit: '退出',
    view: '视图',
    reload: '刷新',
    forceReload: '强制刷新',
    resetZoom: '重置缩放',
    zoomIn: '放大',
    zoomOut: '缩小',
    fullscreen: '全屏',
    appTitle: '全球电台'
  },
  es: {
    app: 'Aplicación',
    serverSettings: 'Configuración del servidor',
    quit: 'Salir',
    view: 'Ver',
    reload: 'Recargar',
    forceReload: 'Forzar recarga',
    resetZoom: 'Restablecer zoom',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    fullscreen: 'Pantalla completa',
    appTitle: 'Radio Global'
  },
  fr: {
    app: 'Application',
    serverSettings: 'Paramètres serveur',
    quit: 'Quitter',
    view: 'Affichage',
    reload: 'Actualiser',
    forceReload: 'Actualisation forcée',
    resetZoom: 'Réinitialiser le zoom',
    zoomIn: 'Zoom avant',
    zoomOut: 'Zoom arrière',
    fullscreen: 'Plein écran',
    appTitle: 'Radio Mondiale'
  },
  de: {
    app: 'App',
    serverSettings: 'Servereinstellungen',
    quit: 'Beenden',
    view: 'Ansicht',
    reload: 'Neu laden',
    forceReload: 'Erneut laden',
    resetZoom: 'Zoom zurücksetzen',
    zoomIn: 'Vergrößern',
    zoomOut: 'Verkleinern',
    fullscreen: 'Vollbild',
    appTitle: 'Global Radio'
  },
  ja: {
    app: 'アプリ',
    serverSettings: 'サーバー設定',
    quit: '終了',
    view: '表示',
    reload: '再読み込み',
    forceReload: '強制再読み込み',
    resetZoom: 'ズームをリセット',
    zoomIn: '拡大',
    zoomOut: '縮小',
    fullscreen: '全画面',
    appTitle: 'グローバルラジオ'
  },
  ko: {
    app: '앱',
    serverSettings: '서버 설정',
    quit: '종료',
    view: '보기',
    reload: '새로고침',
    forceReload: '강제 새로고침',
    resetZoom: '확대/축소 초기화',
    zoomIn: '확대',
    zoomOut: '축소',
    fullscreen: '전체 화면',
    appTitle: '글로벌 라디오'
  },
  ru: {
    app: 'Приложение',
    serverSettings: 'Настройки сервера',
    quit: 'Выход',
    view: 'Вид',
    reload: 'Обновить',
    forceReload: 'Принудительно обновить',
    resetZoom: 'Сбросить масштаб',
    zoomIn: 'Увеличить',
    zoomOut: 'Уменьшить',
    fullscreen: 'Полный экран',
    appTitle: 'Мировое радио'
  },
  ar: {
    app: 'التطبيق',
    serverSettings: 'إعدادات الخادم',
    quit: 'إنهاء',
    view: 'عرض',
    reload: 'إعادة تحميل',
    forceReload: 'إعادة تحميل قسرية',
    resetZoom: 'إعادة تعيين التكبير',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    fullscreen: 'ملء الشاشة',
    appTitle: 'راديو عالمي'
  },
  pt: {
    app: 'Aplicativo',
    serverSettings: 'Configurações do servidor',
    quit: 'Sair',
    view: 'Visualizar',
    reload: 'Recarregar',
    forceReload: 'Recarregar forçado',
    resetZoom: 'Redefinir zoom',
    zoomIn: 'Ampliar',
    zoomOut: 'Reduzir',
    fullscreen: 'Tela cheia',
    appTitle: 'Rádio Global'
  },
  it: {
    app: 'App',
    serverSettings: 'Impostazioni server',
    quit: 'Esci',
    view: 'Visualizza',
    reload: 'Ricarica',
    forceReload: 'Ricarica forzata',
    resetZoom: 'Reimposta zoom',
    zoomIn: 'Ingrandisci',
    zoomOut: 'Riduci',
    fullscreen: 'Schermo intero',
    appTitle: 'Radio Globale'
  },
  hi: {
    app: 'ऐप',
    serverSettings: 'सर्वर सेटिंग्स',
    quit: 'बाहर निकलें',
    view: 'दृश्य',
    reload: 'रीलोड',
    forceReload: 'फ़ोर्स रीलोड',
    resetZoom: 'ज़ूम रीसेट',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    fullscreen: 'पूर्ण स्क्रीन',
    appTitle: 'वैश्विक रेडियो'
  },
  th: {
    app: 'แอป',
    serverSettings: 'การตั้งค่าเซิร์ฟเวอร์',
    quit: 'ออก',
    view: 'มุมมอง',
    reload: 'รีโหลด',
    forceReload: 'บังคับรีโหลด',
    resetZoom: 'รีเซ็ตการซูม',
    zoomIn: 'ซูมเข้า',
    zoomOut: 'ซูมออก',
    fullscreen: 'เต็มจอ',
    appTitle: 'วิทยุโลก'
  },
  vi: {
    app: 'Ứng dụng',
    serverSettings: 'Cài đặt máy chủ',
    quit: 'Thoát',
    view: 'Xem',
    reload: 'Tải lại',
    forceReload: 'Tải lại cưỡng bức',
    resetZoom: 'Đặt lại thu phóng',
    zoomIn: 'Phóng to',
    zoomOut: 'Thu nhỏ',
    fullscreen: 'Toàn màn hình',
    appTitle: 'Radio Toàn Cầu'
  }
}

export function resolveDesktopLanguage(locale = 'en') {
  const normalized = locale.toLowerCase()
  if (normalized.startsWith('zh')) return 'zh'
  if (normalized.startsWith('es')) return 'es'
  if (normalized.startsWith('fr')) return 'fr'
  if (normalized.startsWith('de')) return 'de'
  if (normalized.startsWith('ja')) return 'ja'
  if (normalized.startsWith('ko')) return 'ko'
  if (normalized.startsWith('ru')) return 'ru'
  if (normalized.startsWith('ar')) return 'ar'
  if (normalized.startsWith('pt')) return 'pt'
  if (normalized.startsWith('it')) return 'it'
  if (normalized.startsWith('hi')) return 'hi'
  if (normalized.startsWith('th')) return 'th'
  if (normalized.startsWith('vi')) return 'vi'
  return 'en'
}

export function getDesktopMenuLabels(locale = 'en') {
  const language = resolveDesktopLanguage(locale)
  return menuLabels[language] || menuLabels.en
}
