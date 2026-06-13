const SUPPORTED_LANGUAGES = ['zh', 'en', 'es', 'fr', 'de', 'ja', 'ko', 'ru', 'ar', 'pt', 'it', 'hi', 'th', 'vi']

const messages = {
  en: {
    pageTitle: 'Global Radio - Connect Server',
    appTitle: 'Global Radio',
    subtitle: 'Enter your backend URL. After connecting, you will sign in on the web app. Use Server Settings in the menu to change the URL later.',
    serverUrlLabel: 'Backend URL',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'Supports https:// or http://, no trailing slash required',
    connect: 'Connect',
    clearSaved: 'Clear saved URL',
    invalidUrlError: 'Please enter a valid http or https URL',
    languageLabel: 'Language',
    useSavedServer: 'Use previous server',
    savedHint: 'A previous server is saved on this device.'
  },
  zh: {
    pageTitle: '全球电台 - 连接服务器',
    appTitle: '全球电台',
    subtitle: '请输入后台地址，连接后将进入登录页面。已连接时可通过菜单「服务器设置」更换地址。',
    serverUrlLabel: '后台 URL',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: '支持 https:// 或 http://，无需结尾斜杠',
    connect: '连接',
    clearSaved: '清除已保存地址',
    invalidUrlError: '请输入有效的 http 或 https 地址',
    languageLabel: '语言',
    useSavedServer: '使用上次的服务器',
    savedHint: '本机已保存上次连接的服务器。'
  },
  es: {
    pageTitle: 'Radio Global - Conectar servidor',
    appTitle: 'Radio Global',
    subtitle: 'Introduce la URL del backend. Después de conectar, iniciarás sesión en la web. Usa Configuración del servidor en el menú para cambiar la URL.',
    serverUrlLabel: 'URL del backend',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'Admite https:// o http://, sin barra final',
    connect: 'Conectar',
    clearSaved: 'Borrar URL guardada',
    invalidUrlError: 'Introduce una URL http o https válida',
    languageLabel: 'Idioma',
    useSavedServer: 'Usar servidor anterior',
    savedHint: 'Hay un servidor anterior guardado en este dispositivo.'
  },
  fr: {
    pageTitle: 'Radio Mondiale - Connexion au serveur',
    appTitle: 'Radio Mondiale',
    subtitle: 'Entrez l’URL du backend. Après connexion, vous vous connecterez sur le site. Utilisez Paramètres serveur dans le menu pour changer l’URL.',
    serverUrlLabel: 'URL du backend',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'Prend en charge https:// ou http://, sans slash final',
    connect: 'Se connecter',
    clearSaved: 'Effacer l’URL enregistrée',
    invalidUrlError: 'Veuillez entrer une URL http ou https valide',
    languageLabel: 'Langue',
    useSavedServer: 'Utiliser le serveur précédent',
    savedHint: 'Un serveur précédent est enregistré sur cet appareil.'
  },
  de: {
    pageTitle: 'Global Radio - Server verbinden',
    appTitle: 'Global Radio',
    subtitle: 'Geben Sie die Backend-URL ein. Nach der Verbindung melden Sie sich in der Web-App an. Nutzen Sie Servereinstellungen im Menü, um die URL zu ändern.',
    serverUrlLabel: 'Backend-URL',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'Unterstützt https:// oder http://, kein abschließender Schrägstrich',
    connect: 'Verbinden',
    clearSaved: 'Gespeicherte URL löschen',
    invalidUrlError: 'Bitte geben Sie eine gültige http- oder https-URL ein',
    languageLabel: 'Sprache',
    useSavedServer: 'Vorherigen Server verwenden',
    savedHint: 'Auf diesem Gerät ist ein vorheriger Server gespeichert.'
  },
  ja: {
    pageTitle: 'グローバルラジオ - サーバー接続',
    appTitle: 'グローバルラジオ',
    subtitle: 'バックエンド URL を入力してください。接続後、Web アプリでログインします。URL を変更するにはメニューの「サーバー設定」を使用します。',
    serverUrlLabel: 'バックエンド URL',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'https:// または http:// に対応。末尾スラッシュ不要',
    connect: '接続',
    clearSaved: '保存済み URL を削除',
    invalidUrlError: '有効な http または https の URL を入力してください',
    languageLabel: '言語',
    useSavedServer: '前回のサーバーに接続',
    savedHint: 'このデバイスに前回のサーバーが保存されています。'
  },
  ko: {
    pageTitle: '글로벌 라디오 - 서버 연결',
    appTitle: '글로벌 라디오',
    subtitle: '백엔드 URL을 입력하세요. 연결 후 웹 앱에서 로그인합니다. URL 변경은 메뉴의 서버 설정을 사용하세요.',
    serverUrlLabel: '백엔드 URL',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'https:// 또는 http:// 지원, 끝 슬래시 불필요',
    connect: '연결',
    clearSaved: '저장된 URL 삭제',
    invalidUrlError: '유효한 http 또는 https URL을 입력하세요',
    languageLabel: '언어',
    useSavedServer: '이전 서버 사용',
    savedHint: '이 기기에 이전 서버가 저장되어 있습니다.'
  },
  ru: {
    pageTitle: 'Мировое радио - Подключение к серверу',
    appTitle: 'Мировое радио',
    subtitle: 'Введите URL бэкенда. После подключения выполните вход в веб-приложении. Используйте пункт меню «Настройки сервера», чтобы изменить URL.',
    serverUrlLabel: 'URL бэкенда',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'Поддерживаются https:// и http://, без завершающего слэша',
    connect: 'Подключить',
    clearSaved: 'Очистить сохранённый URL',
    invalidUrlError: 'Введите корректный http или https URL',
    languageLabel: 'Язык',
    useSavedServer: 'Использовать предыдущий сервер',
    savedHint: 'На этом устройстве сохранён предыдущий сервер.'
  },
  ar: {
    pageTitle: 'راديو عالمي - الاتصال بالخادم',
    appTitle: 'راديو عالمي',
    subtitle: 'أدخل عنوان URL للخادم. بعد الاتصال ستسجل الدخول في التطبيق. استخدم إعدادات الخادم من القائمة لتغيير العنوان.',
    serverUrlLabel: 'عنوان URL للخادم',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'يدعم https:// أو http:// بدون شرطة مائلة في النهاية',
    connect: 'اتصال',
    clearSaved: 'مسح العنوان المحفوظ',
    invalidUrlError: 'يرجى إدخال عنوان http أو https صالح',
    languageLabel: 'اللغة',
    useSavedServer: 'استخدام الخادم السابق',
    savedHint: 'تم حفظ خادم سابق على هذا الجهاز.'
  },
  pt: {
    pageTitle: 'Rádio Global - Conectar servidor',
    appTitle: 'Rádio Global',
    subtitle: 'Digite a URL do backend. Após conectar, você fará login no site. Use Configurações do servidor no menu para alterar a URL.',
    serverUrlLabel: 'URL do backend',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'Suporta https:// ou http://, sem barra final',
    connect: 'Conectar',
    clearSaved: 'Limpar URL salva',
    invalidUrlError: 'Digite uma URL http ou https válida',
    languageLabel: 'Idioma',
    useSavedServer: 'Usar servidor anterior',
    savedHint: 'Um servidor anterior está salvo neste dispositivo.'
  },
  it: {
    pageTitle: 'Radio Globale - Connetti server',
    appTitle: 'Radio Globale',
    subtitle: 'Inserisci l’URL del backend. Dopo la connessione accederai dal web. Usa Impostazioni server nel menu per cambiare URL.',
    serverUrlLabel: 'URL backend',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'Supporta https:// o http://, senza slash finale',
    connect: 'Connetti',
    clearSaved: 'Cancella URL salvato',
    invalidUrlError: 'Inserisci un URL http o https valido',
    languageLabel: 'Lingua',
    useSavedServer: 'Usa server precedente',
    savedHint: 'Su questo dispositivo è salvato un server precedente.'
  },
  hi: {
    pageTitle: 'वैश्विक रेडियो - सर्वर कनेक्ट करें',
    appTitle: 'वैश्विक रेडियो',
    subtitle: 'बैकएंड URL दर्ज करें। कनेक्ट होने के बाद वेब ऐप में लॉगिन करें। URL बदलने के लिए मेनू में सर्वर सेटिंग्स का उपयोग करें।',
    serverUrlLabel: 'बैकएंड URL',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'https:// या http:// समर्थित, अंत में / नहीं',
    connect: 'कनेक्ट करें',
    clearSaved: 'सहेजा गया URL हटाएँ',
    invalidUrlError: 'कृपया मान्य http या https URL दर्ज करें',
    languageLabel: 'भाषा',
    useSavedServer: 'पिछले सर्वर का उपयोग करें',
    savedHint: 'इस डिवाइस पर पिछला सर्वर सहेजा गया है।'
  },
  th: {
    pageTitle: 'วิทยุโลก - เชื่อมต่อเซิร์ฟเวอร์',
    appTitle: 'วิทยุโลก',
    subtitle: 'กรอก URL ของ backend หลังเชื่อมต่อแล้วให้เข้าสู่ระบบบนเว็บ ใช้การตั้งค่าเซิร์ฟเวอร์ในเมนูเพื่อเปลี่ยน URL',
    serverUrlLabel: 'URL ของ backend',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'รองรับ https:// หรือ http:// ไม่ต้องใส่ / ท้าย URL',
    connect: 'เชื่อมต่อ',
    clearSaved: 'ล้าง URL ที่บันทึกไว้',
    invalidUrlError: 'กรุณากรอก URL แบบ http หรือ https ที่ถูกต้อง',
    languageLabel: 'ภาษา',
    useSavedServer: 'ใช้เซิร์ฟเวอร์ก่อนหน้า',
    savedHint: 'มีเซิร์ฟเวอร์ก่อนหน้าบันทึกไว้บนเครื่องนี้'
  },
  vi: {
    pageTitle: 'Radio Toàn Cầu - Kết nối máy chủ',
    appTitle: 'Radio Toàn Cầu',
    subtitle: 'Nhập URL backend. Sau khi kết nối, bạn sẽ đăng nhập trên web. Dùng Cài đặt máy chủ trong menu để đổi URL.',
    serverUrlLabel: 'URL backend',
    serverUrlPlaceholder: 'https://your-server.example.com',
    hint: 'Hỗ trợ https:// hoặc http://, không cần dấu / ở cuối',
    connect: 'Kết nối',
    clearSaved: 'Xóa URL đã lưu',
    invalidUrlError: 'Vui lòng nhập URL http hoặc https hợp lệ',
    languageLabel: 'Ngôn ngữ',
    useSavedServer: 'Dùng máy chủ trước',
    savedHint: 'Một máy chủ trước đã được lưu trên thiết bị này.'
  }
}

const languageLabels = {
  zh: '中文',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  ko: '한국어',
  ru: 'Русский',
  ar: 'العربية',
  pt: 'Português',
  it: 'Italiano',
  hi: 'हिन्दी',
  th: 'ไทย',
  vi: 'Tiếng Việt'
}

export const SHELL_LANGUAGE_KEY = 'shell-language'

export function detectShellLanguage() {
  const saved = localStorage.getItem(SHELL_LANGUAGE_KEY)
  if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
    return saved
  }

  const browserLanguage = navigator.language.toLowerCase()
  if (browserLanguage.startsWith('zh')) return 'zh'
  if (browserLanguage.startsWith('es')) return 'es'
  if (browserLanguage.startsWith('fr')) return 'fr'
  if (browserLanguage.startsWith('de')) return 'de'
  if (browserLanguage.startsWith('ja')) return 'ja'
  if (browserLanguage.startsWith('ko')) return 'ko'
  if (browserLanguage.startsWith('ru')) return 'ru'
  if (browserLanguage.startsWith('ar')) return 'ar'
  if (browserLanguage.startsWith('pt')) return 'pt'
  if (browserLanguage.startsWith('it')) return 'it'
  if (browserLanguage.startsWith('hi')) return 'hi'
  if (browserLanguage.startsWith('th')) return 'th'
  if (browserLanguage.startsWith('vi')) return 'vi'
  return 'en'
}

export function saveShellLanguage(language) {
  if (SUPPORTED_LANGUAGES.includes(language)) {
    localStorage.setItem(SHELL_LANGUAGE_KEY, language)
  }
}

export function getShellMessages(language = detectShellLanguage()) {
  return messages[language] || messages.en
}

export function getShellLanguageOptions(currentLanguage) {
  return SUPPORTED_LANGUAGES.map((code) => ({
    code,
    label: languageLabels[code] || code,
    selected: code === currentLanguage
  }))
}
