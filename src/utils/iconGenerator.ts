// 电台图标生成器工具
export interface GeneratedIcon {
  letter: string
  backgroundColor: string
  textColor: string
}

// 预定义的颜色组合
const colorCombinations = [
  { bg: '#FF6B6B', text: '#FFFFFF' }, // 红色
  { bg: '#4ECDC4', text: '#FFFFFF' }, // 青色
  { bg: '#45B7D1', text: '#FFFFFF' }, // 蓝色
  { bg: '#96CEB4', text: '#FFFFFF' }, // 绿色
  { bg: '#FFEAA7', text: '#2D3436' }, // 黄色
  { bg: '#DDA0DD', text: '#FFFFFF' }, // 紫色
  { bg: '#98D8C8', text: '#2D3436' }, // 薄荷绿
  { bg: '#F7DC6F', text: '#2D3436' }, // 金色
  { bg: '#BB8FCE', text: '#FFFFFF' }, // 淡紫色
  { bg: '#85C1E9', text: '#FFFFFF' }, // 天蓝色
  { bg: '#F8C471', text: '#2D3436' }, // 橙色
  { bg: '#82E0AA', text: '#2D3436' }, // 浅绿色
  { bg: '#F1948A', text: '#FFFFFF' }, // 粉红色
  { bg: '#85C1E9', text: '#FFFFFF' }, // 浅蓝色
  { bg: '#D2B4DE', text: '#FFFFFF' }, // 薰衣草色
  { bg: '#A3E4D7', text: '#2D3436' }, // 水绿色
  { bg: '#FAD7A0', text: '#2D3436' }, // 桃色
  { bg: '#AED6F1', text: '#2D3436' }, // 浅蓝色
  { bg: '#A9DFBF', text: '#2D3436' }, // 浅绿色
  { bg: '#F9E79F', text: '#2D3436' }  // 浅黄色
]

// 获取字符串的哈希值
function getStringHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  return Math.abs(hash)
}

// 获取电台名称的首字母
function getFirstLetter(name: string): string {
  if (!name) return '?'
  
  // 移除特殊字符和空格，获取第一个字符
  const cleanName = name.trim().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')
  if (!cleanName) return '?'
  
  const firstChar = cleanName.charAt(0).toUpperCase()
  
  // 如果是中文字符，直接返回
  if (/[\u4e00-\u9fa5]/.test(firstChar)) {
    return firstChar
  }
  
  // 如果是英文字符或数字，返回大写
  return firstChar
}

// 根据电台名称生成图标
export function generateStationIcon(stationName: string): GeneratedIcon {
  const hash = getStringHash(stationName)
  const colorIndex = hash % colorCombinations.length
  const colorCombo = colorCombinations[colorIndex]
  
  return {
    letter: getFirstLetter(stationName),
    backgroundColor: colorCombo.bg,
    textColor: colorCombo.text
  }
}

// 生成SVG数据URL
export function generateIconDataUrl(stationName: string): string {
  const icon = generateStationIcon(stationName)
  
  const svg = `
    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="${icon.backgroundColor}" rx="12"/>
      <text x="32" y="42" font-family="system-ui, -apple-system, sans-serif" 
            font-size="28" font-weight="600" text-anchor="middle" 
            fill="${icon.textColor}">${icon.letter}</text>
    </svg>
  `
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
} 