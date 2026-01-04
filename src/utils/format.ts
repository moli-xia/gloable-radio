/**
 * 格式化比特率显示
 */
export function formatBitrate(bitrate: number): string {
  if (!bitrate || bitrate === 0) {
    return '未知'
  }
  return `${bitrate} kbps`
}

/**
 * 格式化编码格式显示
 */
export function formatCodec(codec: string): string {
  if (!codec) {
    return '未知'
  }
  return codec.toUpperCase()
}

/**
 * 格式化标签显示（限制显示数量）
 */
export function formatTags(tags: string, maxTags: number = 3): string[] {
  if (!tags) {
    return []
  }
  
  const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag)
  return tagList.slice(0, maxTags)
}

/**
 * 格式化国家名称
 */
export function formatCountry(country: string): string {
  if (!country) {
    return '未知'
  }
  
  // 国家名称映射
  const countryMap: Record<string, string> = {
    'China': '中国',
    'United States': '美国',
    'United Kingdom': '英国',
    'Germany': '德国',
    'France': '法国',
    'Japan': '日本',
    'South Korea': '韩国',
    'Russia': '俄罗斯',
    'Canada': '加拿大',
    'Australia': '澳大利亚',
    'Brazil': '巴西',
    'India': '印度',
    'Italy': '意大利',
    'Spain': '西班牙',
    'Netherlands': '荷兰',
    'Sweden': '瑞典',
    'Norway': '挪威',
    'Denmark': '丹麦',
    'Finland': '芬兰',
    'Poland': '波兰',
    'Czech Republic': '捷克',
    'Austria': '奥地利',
    'Switzerland': '瑞士',
    'Belgium': '比利时',
    'Portugal': '葡萄牙',
    'Greece': '希腊',
    'Turkey': '土耳其',
    'Mexico': '墨西哥',
    'Argentina': '阿根廷',
    'Chile': '智利',
    'Colombia': '哥伦比亚',
    'Peru': '秘鲁',
    'Venezuela': '委内瑞拉',
    'Egypt': '埃及',
    'South Africa': '南非',
    'Nigeria': '尼日利亚',
    'Kenya': '肯尼亚',
    'Morocco': '摩洛哥',
    'Algeria': '阿尔及利亚',
    'Tunisia': '突尼斯',
    'Thailand': '泰国',
    'Vietnam': '越南',
    'Malaysia': '马来西亚',
    'Singapore': '新加坡',
    'Indonesia': '印度尼西亚',
    'Philippines': '菲律宾',
    'Taiwan': '台湾',
    'Hong Kong': '香港',
    'Macau': '澳门'
  }
  
  return countryMap[country] || country
}

/**
 * 格式化语言名称
 */
export function formatLanguage(language: string): string {
  if (!language) {
    return '未知'
  }
  
  // 语言名称映射
  const languageMap: Record<string, string> = {
    'chinese': '中文',
    'english': '英语',
    'japanese': '日语',
    'korean': '韩语',
    'french': '法语',
    'german': '德语',
    'spanish': '西班牙语',
    'italian': '意大利语',
    'portuguese': '葡萄牙语',
    'russian': '俄语',
    'arabic': '阿拉伯语',
    'hindi': '印地语',
    'thai': '泰语',
    'vietnamese': '越南语',
    'malay': '马来语',
    'indonesian': '印尼语',
    'tagalog': '菲律宾语',
    'dutch': '荷兰语',
    'swedish': '瑞典语',
    'norwegian': '挪威语',
    'danish': '丹麦语',
    'finnish': '芬兰语',
    'polish': '波兰语',
    'czech': '捷克语',
    'hungarian': '匈牙利语',
    'romanian': '罗马尼亚语',
    'bulgarian': '保加利亚语',
    'croatian': '克罗地亚语',
    'serbian': '塞尔维亚语',
    'slovenian': '斯洛文尼亚语',
    'slovak': '斯洛伐克语',
    'lithuanian': '立陶宛语',
    'latvian': '拉脱维亚语',
    'estonian': '爱沙尼亚语',
    'greek': '希腊语',
    'turkish': '土耳其语',
    'hebrew': '希伯来语',
    'persian': '波斯语',
    'urdu': '乌尔都语',
    'bengali': '孟加拉语',
    'tamil': '泰米尔语',
    'telugu': '泰卢固语',
    'marathi': '马拉地语',
    'gujarati': '古吉拉特语',
    'punjabi': '旁遮普语',
    'kannada': '卡纳达语',
    'malayalam': '马拉雅拉姆语',
    'oriya': '奥里亚语',
    'assamese': '阿萨姆语'
  }
  
  return languageMap[language.toLowerCase()] || language
}

/**
 * 截断文本并添加省略号
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

/**
 * 格式化数字（添加千分位分隔符）
 */
export function formatNumber(num: number): string {
  if (!num) {
    return '0'
  }
  return num.toLocaleString()
}