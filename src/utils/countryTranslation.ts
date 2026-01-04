import { useLanguageStore } from '@/stores/language'

// 国家代码到中文名称的映射
const countryNamesCN: Record<string, string> = {
  'CN': '中国',
  'US': '美国',
  'GB': '英国',
  'DE': '德国',
  'FR': '法国',
  'JP': '日本',
  'KR': '韩国',
  'RU': '俄罗斯',
  'CA': '加拿大',
  'AU': '澳大利亚',
  'IT': '意大利',
  'ES': '西班牙',
  'BR': '巴西',
  'IN': '印度',
  'MX': '墨西哥',
  'NL': '荷兰',
  'SE': '瑞典',
  'NO': '挪威',
  'DK': '丹麦',
  'FI': '芬兰',
  'AT': '奥地利',
  'BE': '比利时',
  'CH': '瑞士',
  'CZ': '捷克',
  'PL': '波兰',
  'PT': '葡萄牙',
  'GR': '希腊',
  'HU': '匈牙利',
  'IE': '爱尔兰',
  'IL': '以色列',
  'TR': '土耳其',
  'ZA': '南非',
  'EG': '埃及',
  'TH': '泰国',
  'VN': '越南',
  'SG': '新加坡',
  'MY': '马来西亚',
  'ID': '印度尼西亚',
  'PH': '菲律宾',
  'AR': '阿根廷',
  'CL': '智利',
  'CO': '哥伦比亚',
  'PE': '秘鲁',
  'VE': '委内瑞拉',
  'UA': '乌克兰',
  'BY': '白俄罗斯',
  'LT': '立陶宛',
  'LV': '拉脱维亚',
  'EE': '爱沙尼亚',
  'SK': '斯洛伐克',
  'SI': '斯洛文尼亚',
  'HR': '克罗地亚',
  'RS': '塞尔维亚',
  'BG': '保加利亚',
  'RO': '罗马尼亚',
  'LU': '卢森堡',
  'MT': '马耳他',
  'CY': '塞浦路斯',
  'IS': '冰岛',
  'TW': '台湾',
  'HK': '香港',
  'MO': '澳门'
}

// 国家代码到英文名称的映射
const countryNamesEN: Record<string, string> = {
  'CN': 'China',
  'US': 'United States',
  'GB': 'United Kingdom',
  'DE': 'Germany',
  'FR': 'France',
  'JP': 'Japan',
  'KR': 'South Korea',
  'RU': 'Russia',
  'CA': 'Canada',
  'AU': 'Australia',
  'IT': 'Italy',
  'ES': 'Spain',
  'BR': 'Brazil',
  'IN': 'India',
  'MX': 'Mexico',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'AT': 'Austria',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'CZ': 'Czech Republic',
  'PL': 'Poland',
  'PT': 'Portugal',
  'GR': 'Greece',
  'HU': 'Hungary',
  'IE': 'Ireland',
  'IL': 'Israel',
  'TR': 'Turkey',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'UA': 'Ukraine',
  'BY': 'Belarus',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'HR': 'Croatia',
  'RS': 'Serbia',
  'BG': 'Bulgaria',
  'RO': 'Romania',
  'LU': 'Luxembourg',
  'MT': 'Malta',
  'CY': 'Cyprus',
  'IS': 'Iceland',
  'TW': 'Taiwan',
  'HK': 'Hong Kong',
  'MO': 'Macau'
}

// 国家代码到西班牙语名称的映射
const countryNamesES: Record<string, string> = {
  'CN': 'China',
  'US': 'Estados Unidos',
  'GB': 'Reino Unido',
  'DE': 'Alemania',
  'FR': 'Francia',
  'JP': 'Japón',
  'KR': 'Corea del Sur',
  'RU': 'Rusia',
  'CA': 'Canadá',
  'AU': 'Australia',
  'IT': 'Italia',
  'ES': 'España',
  'BR': 'Brasil',
  'IN': 'India',
  'MX': 'México',
  'NL': 'Países Bajos',
  'SE': 'Suecia',
  'NO': 'Noruega',
  'DK': 'Dinamarca',
  'FI': 'Finlandia',
  'AT': 'Austria',
  'BE': 'Bélgica',
  'CH': 'Suiza',
  'CZ': 'República Checa',
  'PL': 'Polonia',
  'PT': 'Portugal',
  'GR': 'Grecia',
  'HU': 'Hungría',
  'IE': 'Irlanda',
  'IL': 'Israel',
  'TR': 'Turquía',
  'ZA': 'Sudáfrica',
  'EG': 'Egipto',
  'TH': 'Tailandia',
  'VN': 'Vietnam',
  'SG': 'Singapur',
  'MY': 'Malasia',
  'ID': 'Indonesia',
  'PH': 'Filipinas',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'PE': 'Perú',
  'VE': 'Venezuela',
  'UA': 'Ucrania',
  'BY': 'Bielorrusia',
  'LT': 'Lituania',
  'LV': 'Letonia',
  'EE': 'Estonia',
  'SK': 'Eslovaquia',
  'SI': 'Eslovenia',
  'HR': 'Croacia',
  'RS': 'Serbia',
  'BG': 'Bulgaria',
  'RO': 'Rumania',
  'LU': 'Luxemburgo',
  'MT': 'Malta',
  'CY': 'Chipre',
  'IS': 'Islandia',
  'TW': 'Taiwán',
  'HK': 'Hong Kong',
  'MO': 'Macao'
}

// 国家代码到法语名称的映射
const countryNamesFR: Record<string, string> = {
  'CN': 'Chine',
  'US': 'États-Unis',
  'GB': 'Royaume-Uni',
  'DE': 'Allemagne',
  'FR': 'France',
  'JP': 'Japon',
  'KR': 'Corée du Sud',
  'RU': 'Russie',
  'CA': 'Canada',
  'AU': 'Australie',
  'IT': 'Italie',
  'ES': 'Espagne',
  'BR': 'Brésil',
  'IN': 'Inde',
  'MX': 'Mexique',
  'NL': 'Pays-Bas',
  'SE': 'Suède',
  'NO': 'Norvège',
  'DK': 'Danemark',
  'FI': 'Finlande',
  'AT': 'Autriche',
  'BE': 'Belgique',
  'CH': 'Suisse',
  'CZ': 'République tchèque',
  'PL': 'Pologne',
  'PT': 'Portugal',
  'GR': 'Grèce',
  'HU': 'Hongrie',
  'IE': 'Irlande',
  'IL': 'Israël',
  'TR': 'Turquie',
  'ZA': 'Afrique du Sud',
  'EG': 'Égypte',
  'TH': 'Thaïlande',
  'VN': 'Vietnam',
  'SG': 'Singapour',
  'MY': 'Malaisie',
  'ID': 'Indonésie',
  'PH': 'Philippines',
  'AR': 'Argentine',
  'CL': 'Chili',
  'CO': 'Colombie',
  'PE': 'Pérou',
  'VE': 'Venezuela',
  'UA': 'Ukraine',
  'BY': 'Biélorussie',
  'LT': 'Lituanie',
  'LV': 'Lettonie',
  'EE': 'Estonie',
  'SK': 'Slovaquie',
  'SI': 'Slovénie',
  'HR': 'Croatie',
  'RS': 'Serbie',
  'BG': 'Bulgarie',
  'RO': 'Roumanie',
  'LU': 'Luxembourg',
  'MT': 'Malte',
  'CY': 'Chypre',
  'IS': 'Islande',
  'TW': 'Taïwan',
  'HK': 'Hong Kong',
  'MO': 'Macao'
}

// 国家代码到德语名称的映射
const countryNamesDE: Record<string, string> = {
  'CN': 'China',
  'US': 'Vereinigte Staaten',
  'GB': 'Vereinigtes Königreich',
  'DE': 'Deutschland',
  'FR': 'Frankreich',
  'JP': 'Japan',
  'KR': 'Südkorea',
  'RU': 'Russland',
  'CA': 'Kanada',
  'AU': 'Australien',
  'IT': 'Italien',
  'ES': 'Spanien',
  'BR': 'Brasilien',
  'IN': 'Indien',
  'MX': 'Mexiko',
  'NL': 'Niederlande',
  'SE': 'Schweden',
  'NO': 'Norwegen',
  'DK': 'Dänemark',
  'FI': 'Finnland',
  'AT': 'Österreich',
  'BE': 'Belgien',
  'CH': 'Schweiz',
  'CZ': 'Tschechische Republik',
  'PL': 'Polen',
  'PT': 'Portugal',
  'GR': 'Griechenland',
  'HU': 'Ungarn',
  'IE': 'Irland',
  'IL': 'Israel',
  'TR': 'Türkei',
  'ZA': 'Südafrika',
  'EG': 'Ägypten',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'SG': 'Singapur',
  'MY': 'Malaysia',
  'ID': 'Indonesien',
  'PH': 'Philippinen',
  'AR': 'Argentinien',
  'CL': 'Chile',
  'CO': 'Kolumbien',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'UA': 'Ukraine',
  'BY': 'Belarus',
  'LT': 'Litauen',
  'LV': 'Lettland',
  'EE': 'Estland',
  'SK': 'Slowakei',
  'SI': 'Slowenien',
  'HR': 'Kroatien',
  'RS': 'Serbien',
  'BG': 'Bulgarien',
  'RO': 'Rumänien',
  'LU': 'Luxemburg',
  'MT': 'Malta',
  'CY': 'Zypern',
  'IS': 'Island',
  'TW': 'Taiwan',
  'HK': 'Hongkong',
  'MO': 'Macao'
}

/**
 * 获取当前语言下的国家名称
 * @param countryCodeOrName 国家代码（如'CN'）或英文国家名称（如'China'）
 * @returns 当前语言下的国家名称
 */
export function getLocalizedCountryName(countryCodeOrName: string): string {
  if (!countryCodeOrName) return ''
  
  const languageStore = useLanguageStore()
  const currentLang = languageStore.currentLanguage
  
  // 尝试将输入标准化为国家代码
  let countryCode = countryCodeOrName.toUpperCase()
  
  // 如果不是2位国家代码，尝试从英文名称查找代码
  if (countryCode.length !== 2) {
    // 查找英文名称对应的国家代码
    const foundCode = Object.entries(countryNamesEN).find(([_, name]) => 
      name.toLowerCase() === countryCodeOrName.toLowerCase()
    )?.[0]
    
    if (foundCode) {
      countryCode = foundCode
    } else {
      // 如果找不到，直接返回原名称
      return countryCodeOrName
    }
  }
  
  // 根据当前语言返回对应的国家名称
  switch (currentLang) {
    case 'zh':
      return countryNamesCN[countryCode] || countryCodeOrName
    case 'es':
      return countryNamesES[countryCode] || countryNamesEN[countryCode] || countryCodeOrName
    case 'fr':
      return countryNamesFR[countryCode] || countryNamesEN[countryCode] || countryCodeOrName
    case 'de':
      return countryNamesDE[countryCode] || countryNamesEN[countryCode] || countryCodeOrName
    case 'en':
    default:
      return countryNamesEN[countryCode] || countryCodeOrName
  }
}

/**
 * 获取中文国家名称（向后兼容）
 */
export function getChineseCountryName(countryCodeOrName: string): string {
  if (!countryCodeOrName) return ''
  
  let countryCode = countryCodeOrName.toUpperCase()
  
  // 如果不是2位国家代码，尝试从英文名称查找代码
  if (countryCode.length !== 2) {
    const foundCode = Object.entries(countryNamesEN).find(([_, name]) => 
      name.toLowerCase() === countryCodeOrName.toLowerCase()
    )?.[0]
    
    if (foundCode) {
      countryCode = foundCode
    } else {
      return countryCodeOrName
    }
  }
  
  return countryNamesCN[countryCode] || countryCodeOrName
} 