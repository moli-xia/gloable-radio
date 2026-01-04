import type { SupportedLanguage } from '@/stores/language'
import { extendedTranslations } from './translations-extended'

// 翻译类型定义
export interface TranslationContent {
  nav: {
    home: string
    search: string
    history: string
    favorites: string
    settings: string
    language: string
  }
  home: {
    title: string
    subtitle: string
    randomDiscover: string
    exploreNew: string
    findFavorites: string
    browseByCategory: string
    savedStations: string
    musicStations: string
    latestStations: string
    popularCountries: string
    popularTags: string
    viewAll: string
    refresh: string
    popularStations: string
    localStations: string
    localRecommendations: string
    more: string
    recentlyPlayed: string
    loadMore: string
    loading: string
    noStations: string
    playAll: string
  }
  search: {
    title: string
    placeholder: string
    filters: string
    country: string
    language: string
    tags: string
    allCountries: string
    allLanguages: string
    allTags: string
    searchButton: string
    reset: string
    popularSearches: string
    results: string
    noResults: string
    noResultsHint: string
    history: string
    clear: string
    loadMore: string
    stations: string
  }
  browse: {
    title: string
    quickFilter: string
    browseByCountry: string
    popularTags: string
    stationList: string
    stations: string
    noStations: string
    tryAdjustFilters: string
    randomDiscover: string
    clearFilters: string
    clearAll: string
    loading: string
    sortByPopularity: string
    sortByName: string
    sortByCountry: string
    sortByLatest: string
    sortByVotes: string
    sortByRandom: string
  }
  favorites: {
    title: string
    empty: string
    emptyHint: string
    clearAll: string
    browseStations: string
    searchStations: string
    clearConfirmTitle: string
    clearConfirmMessage: string
    cancel: string
    clear: string
  }
  history: {
    title: string
    removed: string
    empty: string
    emptyHint: string
    clearAll: string
    exploreStations: string
    searchStations: string
    clearConfirmTitle: string
    clearConfirmMessage: string
    totalVisits: string
    totalVisited: string
    uniqueStations: string
    today: string
    yesterday: string
  }
  settings: {
    title: string
    appSettings: string
    themeMode: string
    switchTheme: string
    audioSettings: string
    volume: string
    mute: string
    max: string
    aboutApp: string
    version: string
    dataSource: string
    deviceType: string
    desktop: string
    tablet: string
    mobile: string
    unknown: string
  }
  player: {
    play: string
    pause: string
    stop: string
    volume: string
    mute: string
    unmute: string
    favorite: string
    unfavorite: string
    favorited: string
    addToFavorite: string
    close: string
    loading: string
    error: string
    retry: string
  }
  common: {
    loading: string
    error: string
    retry: string
    cancel: string
    confirm: string
    save: string
    delete: string
    edit: string
    close: string
    back: string
    next: string
    previous: string
    unknown: string
  },
  fr: {
    nav: {
      home: 'Accueil',
      search: 'Rechercher',
      history: 'Historique',
      favorites: 'Favoris',
      settings: 'Paramètres',
      language: 'Langue'
    },
    home: {
      title: 'Radio Mondiale',
      subtitle: 'Écoutez le monde, musique sans frontières',
      randomDiscover: 'Découverte Aléatoire',
      exploreNew: 'Explorer Nouvelles Stations',
      findFavorites: 'Trouvez vos Favoris',
      browseByCategory: 'Parcourir par Catégorie',
      savedStations: 'Stations Sauvegardées',
      musicStations: 'Stations de Musique',
      latestStations: 'Dernières Stations',
      popularCountries: 'Pays Populaires',
      popularTags: 'Tags Populaires',
      viewAll: 'Voir Tout',
      refresh: 'Actualiser',
      popularStations: 'Stations Populaires',
      localStations: 'Stations Locales',
      localRecommendations: 'Recommandations Locales',
      more: 'Plus',
      recentlyPlayed: 'Récemment Jouées',
      loadMore: 'Charger Plus',
      loading: 'Chargement...',
      noStations: 'Aucune station',
      playAll: 'Tout Jouer'
    },
    search: {
      title: 'Rechercher Stations',
      placeholder: 'Rechercher nom de station, pays ou tags...',
      filters: 'Filtres',
      country: 'Pays',
      language: 'Langue',
      tags: 'Tags',
      allCountries: 'Tous les Pays',
      allLanguages: 'Toutes les Langues',
      allTags: 'Tous les Tags',
      searchButton: 'Rechercher',
      reset: 'Réinitialiser',
      popularSearches: 'Recherches Populaires',
      results: 'Résultats de Recherche',
      noResults: 'Aucune station trouvée',
      noResultsHint: 'Essayez d\'ajuster vos termes de recherche ou filtres',
      history: 'Historique de Recherche',
      clear: 'Effacer',
      loadMore: 'Charger Plus',
      stations: ' stations'
    },
    browse: {
      title: 'Parcourir Stations',
      quickFilter: 'Filtre Rapide',
      browseByCountry: 'Parcourir par Pays',
      popularTags: 'Tags Populaires',
      stationList: 'Liste des Stations',
      stations: ' stations',
      noStations: 'Aucune donnée de station',
      tryAdjustFilters: 'Essayez d\'ajuster les filtres ou actualiser la page',
      randomDiscover: 'Découverte Aléatoire',
      clearFilters: 'Effacer les Filtres',
      clearAll: 'Tout Effacer',
      loading: 'Chargement...',
      sortByPopularity: 'Trier par Popularité',
      sortByName: 'Trier par Nom',
      sortByCountry: 'Trier par Pays',
      sortByLatest: 'Trier par Plus Récent',
      sortByVotes: 'Trier par Votes',
      sortByRandom: 'Ordre Aléatoire'
    },
    favorites: {
      title: 'Mes Favoris',
      empty: 'Aucune station favorite',
      emptyHint: 'Découvrez des stations que vous aimez et marquez-les comme favorites',
      clearAll: 'Tout Effacer',
      browseStations: 'Parcourir Stations Populaires',
      searchStations: 'Rechercher Stations',
      clearConfirmTitle: 'Effacer les Favoris',
      clearConfirmMessage: 'Êtes-vous sûr de vouloir effacer toutes les stations favorites? Cette action ne peut pas être annulée.',
      cancel: 'Annuler',
      clear: 'Effacer'
    },
    history: {
      title: 'Historique',
      removed: 'Supprimé de l\'historique',
      empty: 'Aucun historique d\'écoute',
      emptyHint: 'Commencez à écouter des stations, votre historique sera enregistré ici',
      clearAll: 'Effacer l\'Historique',
      exploreStations: 'Explorer les Stations',
      searchStations: 'Rechercher Stations',
      clearConfirmTitle: 'Effacer l\'Historique',
      clearConfirmMessage: 'Êtes-vous sûr de vouloir effacer tout l\'historique d\'écoute? Cette action ne peut pas être annulée.',
      totalVisits: 'Visites Totales',
      totalVisited: 'Total Visité',
      uniqueStations: 'Stations Uniques',
      today: 'Aujourd\'hui',
      yesterday: 'Hier'
    },
    settings: {
      title: 'Paramètres',
      appSettings: 'Paramètres de l\'App',
      themeMode: 'Mode Thème',
      switchTheme: 'Changer le thème d\'apparence de l\'app',
      audioSettings: 'Paramètres Audio',
      volume: 'Volume',
      mute: 'Muet',
      max: 'Maximum',
      aboutApp: 'À Propos de l\'App',
      version: 'Version',
      dataSource: 'Source de Données',
      deviceType: 'Type d\'Appareil',
      desktop: 'Bureau',
      tablet: 'Tablette',
      mobile: 'Mobile',
      unknown: 'Inconnu'
    },
    player: {
      play: 'Jouer',
      pause: 'Pause',
      stop: 'Arrêter',
      volume: 'Volume',
      mute: 'Muet',
      unmute: 'Activer le Son',
      favorite: 'Favori',
      unfavorite: 'Non Favori',
      favorited: 'Ajouté aux favoris',
      addToFavorite: 'Ajouter aux favoris',
      close: 'Fermer',
      loading: 'Chargement...',
      error: 'Erreur de lecture',
      retry: 'Réessayer'
    },
    common: {
      loading: 'Chargement...',
      error: 'Une erreur s\'est produite',
      retry: 'Réessayer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Sauvegarder',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      unknown: 'Inconnu'
    }
   }
 }

// 默认英文翻译模板（用于缺失的语言）
const defaultEnglishTranslation: TranslationContent = baseTranslations.en

// 合并所有翻译
export const translations: Record<SupportedLanguage, TranslationContent> = {
  ...baseTranslations,
  ...extendedTranslations,
  // 为缺失的语言提供英文默认翻译
  ja: defaultEnglishTranslation, // Japanese
  ko: defaultEnglishTranslation, // Korean  
  ru: defaultEnglishTranslation, // Russian
  ar: defaultEnglishTranslation, // Arabic
  pt: defaultEnglishTranslation, // Portuguese
  it: defaultEnglishTranslation, // Italian
  hi: defaultEnglishTranslation, // Hindi
  th: defaultEnglishTranslation, // Thai
  vi: defaultEnglishTranslation  // Vietnamese
}

// 所有语言的翻译内容
// 基础翻译定义
const baseTranslations = {
  zh: {
    nav: {
      home: '首页',
      search: '搜索',
      history: '足迹',
      favorites: '收藏',
      settings: '设置',
      language: '语言'
    },
    home: {
      title: '全球电台',
      subtitle: '聆听世界，音乐无界',
      randomDiscover: '随机发现',
      exploreNew: '探索新电台',
      findFavorites: '找到喜欢的',
      browseByCategory: '分类查看',
      savedStations: '收藏的电台',
      musicStations: '音乐电台',
      latestStations: '最新电台',
      popularCountries: '热门国家',
      popularTags: '热门标签',
      viewAll: '查看全部',
      refresh: '刷新',
      popularStations: '热门电台',
      localStations: '本地电台',
      localRecommendations: '本地推荐',
      more: '更多',
      recentlyPlayed: '最近播放',
      loadMore: '加载更多',
      loading: 'Loading...',
      noStations: '暂无电台',
      playAll: '播放全部'
    },
    search: {
      title: '搜索电台',
      placeholder: '搜索电台名称、国家或标签...',
      filters: '筛选条件',
      country: '国家',
      language: '语言',
      tags: '标签',
      allCountries: '所有国家',
      allLanguages: '所有语言',
      allTags: '所有标签',
      searchButton: '搜索',
      reset: '重置',
      popularSearches: '热门搜索',
      results: '搜索结果',
      noResults: '未找到相关电台',
      noResultsHint: '尝试调整搜索关键词或筛选条件',
      history: '搜索历史',
      clear: '清空',
      loadMore: '加载更多',
      stations: '个电台'
    },
    browse: {
      title: '浏览电台',
      quickFilter: '快速筛选',
      browseByCountry: '按国家浏览',
      popularTags: '热门标签',
      stationList: '电台列表',
      stations: '个电台',
      noStations: '暂无电台数据',
      tryAdjustFilters: '尝试调整筛选条件或刷新页面',
      randomDiscover: '随机发现',
      clearFilters: '清除筛选',
      clearAll: '清除全部',
      loading: 'Loading...',
      sortByPopularity: '按热度排序',
      sortByName: '按名称排序',
      sortByCountry: '按国家排序',
      sortByLatest: '按最新排序',
      sortByVotes: '按投票排序',
      sortByRandom: '随机排序'
    },
    favorites: {
      title: '我的收藏',
      empty: '暂无收藏电台',
      emptyHint: '发现喜欢的电台，点击爱心收藏吧',
      clearAll: '清空收藏',
      browseStations: '浏览热门电台',
      searchStations: '搜索电台',
      clearConfirmTitle: '清空收藏夹',
      clearConfirmMessage: '确定要清空所有收藏的电台吗？此操作无法撤销。',
      cancel: '取消',
      clear: '清空'
    },
    history: {
      title: '足迹',
      removed: 'Removed from history',
      empty: '暂无访问记录',
      emptyHint: '开始聆听电台，这里会记录您的足迹',
      clearAll: '清空足迹',
      exploreStations: '发现电台',
      searchStations: '搜索电台',
      clearConfirmTitle: '清空足迹',
      clearConfirmMessage: '确定要清空所有访问记录吗？此操作无法撤销。',
      totalVisits: '总访问次数',
      totalVisited: '总访问',
      uniqueStations: '不同电台',
      today: '今天',
      yesterday: '昨天'
    },
    settings: {
      title: '设置',
      appSettings: '应用设置',
      themeMode: '主题模式',
      switchTheme: '切换应用的外观主题',
      audioSettings: '音频设置',
      volume: '音量',
      mute: '静音',
      max: '最大',
      sleepTimer: '睡眠定时器',
      timerActive: '定时器已启动',
      remaining: '剩余',
      minutes: '分钟',
      afterAutoStop: '后自动停止',
      cancel: '取消',
      hours: '小时',
      hour: '小时',
      minute: '分钟',
      customTime: '自定义时间',
      enterMinutes: '输入分钟数',
      setTimer: '设置',
      timerSetSuccess: '睡眠定时器已设置：{time}后停止播放',
      timerCancelled: '睡眠定时器已取消',
      permissionManagement: '权限管理',
      permissionInfo: '应用需要一些权限来提供完整功能',
      permissionHint: '您可以在系统设置中管理应用权限',
      aboutApp: '关于应用',
      version: '版本',
      dataSource: '数据来源',
      deviceType: '设备类型',
      desktop: '桌面端',
      tablet: '平板端',
      mobile: '移动端',
      unknown: '未知'
    },
    player: {
      play: '播放',
      pause: '暂停',
      stop: '停止',
      volume: '音量',
      mute: '静音',
      unmute: '取消静音',
      favorite: '收藏',
      unfavorite: '取消收藏',
      favorited: '已收藏',
      addToFavorite: '添加收藏',
      close: '关闭',
      loading: 'Loading...',
      error: '播放错误',
      retry: '重试'
    },
    common: {
      loading: 'Loading...',
      error: '出错了',
      retry: '重试',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      close: '关闭',
      back: '返回',
      next: '下一个',
      previous: '上一个',
      unknown: '未知'
    }
  },
  en: {
    nav: {
      home: 'Home',
      search: 'Search',
      history: 'History',
      favorites: 'Favorites',
      settings: 'Settings',
      language: 'Language'
    },
    home: {
      title: 'Global Radio',
      subtitle: 'Listen to the world, music without borders',
      randomDiscover: 'Random Discover',
      exploreNew: 'Explore New Stations',
      findFavorites: 'Find Your Favorites',
      browseByCategory: 'Browse by Category',
      savedStations: 'Saved Stations',
      musicStations: 'Music Stations',
      latestStations: 'Latest Stations',
      popularCountries: 'Popular Countries',
      popularTags: 'Popular Tags',
      viewAll: 'View All',
      refresh: 'Refresh',
      popularStations: 'Popular Stations',
      localStations: 'Local Stations',
      localRecommendations: 'Local Recommendations',
      more: 'More',
      recentlyPlayed: 'Recently Played',
      loadMore: 'Load More',
      loading: 'Loading...',
      noStations: 'No stations',
      playAll: 'Play All'
    },
    search: {
      title: 'Search Stations',
      placeholder: 'Search station name, country or tags...',
      filters: 'Filters',
      country: 'Country',
      language: 'Language',
      tags: 'Tags',
      allCountries: 'All Countries',
      allLanguages: 'All Languages',
      allTags: 'All Tags',
      searchButton: 'Search',
      reset: 'Reset',
      popularSearches: 'Popular Searches',
      results: 'Search Results',
      noResults: 'No stations found',
      noResultsHint: 'Try adjusting your search terms or filters',
      history: 'Search History',
      clear: 'Clear',
      loadMore: 'Load More',
      stations: ' stations'
    },
    browse: {
      title: 'Browse Stations',
      quickFilter: 'Quick Filter',
      browseByCountry: 'Browse by Country',
      popularTags: 'Popular Tags',
      stationList: 'Station List',
      stations: ' stations',
      noStations: 'No station data',
      tryAdjustFilters: 'Try adjusting filters or refresh the page',
      randomDiscover: 'Random Discover',
      clearFilters: 'Clear Filters',
      clearAll: 'Clear All',
      loading: 'Loading...',
      sortByPopularity: 'Sort by Popularity',
      sortByName: 'Sort by Name',
      sortByCountry: 'Sort by Country',
      sortByLatest: 'Sort by Latest',
      sortByVotes: 'Sort by Votes',
      sortByRandom: 'Random Sort'
    },
    favorites: {
      title: 'My Favorites',
      empty: 'No favorite stations',
      emptyHint: 'Discover stations you like and favorite them',
      clearAll: 'Clear All',
      browseStations: 'Browse Popular Stations',
      searchStations: 'Search Stations',
      clearConfirmTitle: 'Clear Favorites',
      clearConfirmMessage: 'Are you sure you want to clear all favorite stations? This action cannot be undone.',
      cancel: 'Cancel',
      clear: 'Clear'
    },
    history: {
      title: 'History',
      removed: 'Removed from history',
      empty: 'No listening history',
      emptyHint: 'Start listening to stations, your history will be recorded here',
      clearAll: 'Clear History',
      exploreStations: 'Explore Stations',
      searchStations: 'Search Stations',
      clearConfirmTitle: 'Clear History',
      clearConfirmMessage: 'Are you sure you want to clear all listening history? This action cannot be undone.',
      totalVisits: 'Total Visits',
      totalVisited: 'Total Visited',
      uniqueStations: 'Unique Stations',
      today: 'Today',
      yesterday: 'Yesterday'
    },
    settings: {
      title: 'Settings',
      appSettings: 'App Settings',
      themeMode: 'Theme Mode',
      switchTheme: 'Switch app appearance theme',
      audioSettings: 'Audio Settings',
      volume: 'Volume',
      mute: 'Mute',
      max: 'Max',
      sleepTimer: 'Sleep Timer',
      timerActive: 'Timer Active',
      remaining: 'Remaining',
      minutes: 'minutes',
      afterAutoStop: ' then auto stop',
      cancel: 'Cancel',
      hours: 'hours',
      hour: 'hour',
      minute: 'minute',
      customTime: 'Custom Time',
      enterMinutes: 'Enter minutes',
      setTimer: 'Set Timer',
      timerSetSuccess: 'Sleep timer set: {time} automatically stop playing',
      timerCancelled: 'Sleep timer cancelled',
      permissionManagement: 'Permission Management',
      permissionInfo: 'The app requires some permissions to provide full functionality',
      permissionHint: 'You can manage app permissions in system settings',
      aboutApp: 'About App',
      version: 'Version',
      dataSource: 'Data Source',
      deviceType: 'Device Type',
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobile: 'Mobile',
      unknown: 'Unknown'
    },
    player: {
      play: 'Play',
      pause: 'Pause',
      stop: 'Stop',
      volume: 'Volume',
      mute: 'Mute',
      unmute: 'Unmute',
      favorite: 'Favorite',
      unfavorite: 'Unfavorite',
      favorited: 'Favorited',
      addToFavorite: 'Add to Favorite',
      close: 'Close',
      loading: 'Loading...',
      error: 'Playback failed',
      retry: 'Retry'
    },
    common: {
      loading: 'Loading...',
      error: 'Error occurred',
      retry: 'Retry',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      unknown: 'Unknown'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      search: 'Buscar',
      history: 'Historial',
      favorites: 'Favoritos',
      settings: 'Configuración',
      language: 'Idioma'
    },
    home: {
      title: 'Radio Global',
      subtitle: 'Escucha el mundo, música sin fronteras',
      randomDiscover: 'Descubrir al Azar',
      exploreNew: 'Explorar Nuevas Estaciones',
      findFavorites: 'Encuentra tus Favoritas',
      browseByCategory: 'Navegar por Categoría',
      savedStations: 'Estaciones Guardadas',
      musicStations: 'Estaciones de Música',
      latestStations: 'Últimas Estaciones',
      popularCountries: 'Países Populares',
      popularTags: 'Etiquetas Populares',
      viewAll: 'Ver Todo',
      refresh: 'Actualizar',
      popularStations: 'Estaciones Populares',
      localStations: 'Estaciones Locales',
      localRecommendations: 'Recomendaciones Locales',
      more: 'Más',
      recentlyPlayed: 'Reproducidas Recientemente',
      loadMore: 'Cargar Más',
      loading: 'Cargando...',
      noStations: 'Sin estaciones',
      playAll: 'Reproducir Todo'
    },
    search: {
      title: 'Buscar Estaciones',
      placeholder: 'Buscar nombre de estación, país o etiquetas...',
      filters: 'Filtros',
      country: 'País',
      language: 'Idioma',
      tags: 'Etiquetas',
      allCountries: 'Todos los Países',
      allLanguages: 'Todos los Idiomas',
      allTags: 'Todas las Etiquetas',
      searchButton: 'Buscar',
      reset: 'Restablecer',
      popularSearches: 'Búsquedas Populares',
      results: 'Resultados de Búsqueda',
      noResults: 'No se encontraron estaciones',
      noResultsHint: 'Intenta ajustar tus términos de búsqueda o filtros',
      history: 'Historial de Búsqueda',
      clear: 'Limpiar',
      loadMore: 'Cargar Más',
      stations: ' estaciones'
    },
    browse: {
      title: 'Explorar Estaciones',
      quickFilter: 'Filtro Rápido',
      browseByCountry: 'Explorar por País',
      popularTags: 'Etiquetas Populares',
      stationList: 'Lista de Estaciones',
      stations: ' estaciones',
      noStations: 'Sin datos de estaciones',
      tryAdjustFilters: 'Intenta ajustar los filtros o actualizar la página',
      randomDiscover: 'Descubrir al Azar',
      clearFilters: 'Limpiar Filtros',
      clearAll: 'Limpiar Todo',
      loading: 'Cargando...',
      sortByPopularity: 'Ordenar por Popularidad',
      sortByName: 'Ordenar por Nombre',
      sortByCountry: 'Ordenar por País',
      sortByLatest: 'Ordenar por Más Reciente',
      sortByVotes: 'Ordenar por Votos',
      sortByRandom: 'Orden Aleatorio'
    },
    favorites: {
      title: 'Mis Favoritos',
      empty: 'Sin estaciones favoritas',
      emptyHint: 'Descubre estaciones que te gusten y márcalas como favoritas',
      clearAll: 'Limpiar Todo',
      browseStations: 'Explorar Estaciones Populares',
      searchStations: 'Buscar Estaciones',
      clearConfirmTitle: 'Limpiar Favoritos',
      clearConfirmMessage: '¿Estás seguro de que quieres limpiar todas las estaciones favoritas? Esta acción no se puede deshacer.',
      cancel: 'Cancelar',
      clear: 'Limpiar'
    },
    history: {
      title: 'Historial',
      removed: 'Eliminado del historial',
      empty: 'Sin historial de escucha',
      emptyHint: 'Comienza a escuchar estaciones, tu historial se registrará aquí',
      clearAll: 'Limpiar Historial',
      exploreStations: 'Explorar Estaciones',
      searchStations: 'Buscar Estaciones',
      clearConfirmTitle: 'Limpiar Historial',
      clearConfirmMessage: '¿Estás seguro de que quieres limpiar todo el historial de escucha? Esta acción no se puede deshacer.',
      totalVisits: 'Visitas Totales',
      totalVisited: 'Total Visitado',
      uniqueStations: 'Estaciones Únicas',
      today: 'Hoy',
      yesterday: 'Ayer'
    },
    settings: {
      title: 'Configuración',
      appSettings: 'Configuración de la App',
      themeMode: 'Modo de Tema',
      switchTheme: 'Cambiar tema de apariencia de la app',
      audioSettings: 'Configuración de Audio',
      volume: 'Volumen',
      mute: 'Silenciar',
      max: 'Máximo',
      aboutApp: 'Acerca de la App',
      version: 'Versión',
      dataSource: 'Fuente de Datos',
      deviceType: 'Tipo de Dispositivo',
      desktop: 'Escritorio',
      tablet: 'Tableta',
      mobile: 'Móvil',
      unknown: 'Desconocido'
    },
    player: {
      play: 'Reproducir',
      pause: 'Pausar',
      stop: 'Detener',
      volume: 'Volumen',
      mute: 'Silenciar',
      unmute: 'Activar Sonido',
      favorite: 'Favorito',
      unfavorite: 'No Favorito',
      favorited: 'Añadido a Favoritos',
      addToFavorite: 'Añadir a Favoritos',
      close: 'Cerrar',
      loading: 'Cargando...',
      error: 'Error de reproducción',
      retry: 'Reintentar'
    },
    common: {
      loading: 'Cargando...',
      error: 'Ocurrió un error',
      retry: 'Reintentar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      unknown: 'Desconocido'
    }
  }
}