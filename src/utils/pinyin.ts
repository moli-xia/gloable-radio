// 常用中文字符拼音首字母映射表
const pinyinMap: Record<string, string> = {
  // A
  '阿': 'A', '啊': 'A', '爱': 'A', '安': 'A', '案': 'A',
  // B
  '八': 'B', '巴': 'B', '白': 'B', '百': 'B', '班': 'B', '包': 'B', '宝': 'B', '保': 'B', '北': 'B', '本': 'B', '比': 'B', '播': 'B', '不': 'B', '部': 'B',
  // C
  '草': 'C', '长': 'C', '常': 'C', '场': 'C', '车': 'C', '成': 'C', '城': 'C', '出': 'C', '传': 'C', '春': 'C', '从': 'C',
  // D
  '大': 'D', '当': 'D', '道': 'D', '的': 'D', '地': 'D', '点': 'D', '电': 'D', '东': 'D', '动': 'D', '都': 'D', '多': 'D',
  // E
  '二': 'E', '儿': 'E',
  // F
  '发': 'F', '法': 'F', '方': 'F', '放': 'F', '分': 'F', '风': 'F', '福': 'F', '服': 'F', '府': 'F', '富': 'F',
  // G
  '高': 'G', '个': 'G', '工': 'G', '公': 'G', '国': 'G', '过': 'G', '广': 'G', '光': 'G', '贵': 'G', '桂': 'G',
  // H
  '海': 'H', '汉': 'H', '好': 'H', '和': 'H', '河': 'H', '红': 'H', '华': 'H', '化': 'H', '欢': 'H', '环': 'H', '黄': 'H', '会': 'H', '活': 'H', '火': 'H', '湖': 'H', '花': 'H',
  // J
  '基': 'J', '机': 'J', '家': 'J', '加': 'J', '建': 'J', '江': 'J', '将': 'J', '交': 'J', '今': 'J', '进': 'J', '京': 'J', '经': 'J', '九': 'J', '就': 'J', '军': 'J',
  // K
  '开': 'K', '看': 'K', '可': 'K', '科': 'K', '空': 'K', '快': 'K',
  // L
  '来': 'L', '老': 'L', '了': 'L', '乐': 'L', '里': 'L', '理': 'L', '力': 'L', '立': 'L', '连': 'L', '两': 'L', '流': 'L', '六': 'L', '龙': 'L', '路': 'L',
  // M
  '马': 'M', '买': 'M', '满': 'M', '美': 'M', '没': 'M', '每': 'M', '门': 'M', '民': 'M', '名': 'M', '明': 'M', '目': 'M', '母': 'M',
  // N
  '那': 'N', '南': 'N', '内': 'N', '能': 'N', '你': 'N', '年': 'N', '农': 'N', '女': 'N',
  // O
  '欧': 'O',
  // P
  '排': 'P', '片': 'P', '平': 'P', '普': 'P',
  // Q
  '七': 'Q', '其': 'Q', '起': 'Q', '前': 'Q', '强': 'Q', '青': 'Q', '清': 'Q', '全': 'Q', '群': 'Q',
  // R
  '人': 'R', '日': 'R', '如': 'R', '入': 'R',
  // S
  '三': 'S', '山': 'S', '商': 'S', '上': 'S', '少': 'S', '深': 'S', '生': 'S', '声': 'S', '省': 'S', '师': 'S', '十': 'S', '时': 'S', '市': 'S', '事': 'S', '手': 'S', '首': 'S', '书': 'S', '水': 'S', '四': 'S', '苏': 'S', '所': 'S',
  // T
  '他': 'T', '她': 'T', '它': 'T', '台': 'T', '太': 'T', '天': 'T', '田': 'T', '听': 'T', '通': 'T', '同': 'T', '头': 'T', '土': 'T', '团': 'T', '图': 'T',
  // U
  // V
  // W
  '万': 'W', '王': 'W', '网': 'W', '为': 'W', '位': 'W', '文': 'W', '我': 'W', '无': 'W', '五': 'W', '武': 'W', '务': 'W', '外': 'W', '晚': 'W', '问': 'W',
  // X
  '西': 'X', '下': 'X', '先': 'X', '现': 'X', '想': 'X', '小': 'X', '校': 'X', '新': 'X', '信': 'X', '行': 'X', '学': 'X', '需': 'X',
  // Y
  '一': 'Y', '已': 'Y', '以': 'Y', '也': 'Y', '要': 'Y', '阳': 'Y', '业': 'Y', '用': 'Y', '有': 'Y', '又': 'Y', '于': 'Y', '语': 'Y', '雨': 'Y', '园': 'Y', '远': 'Y', '院': 'Y', '月': 'Y', '云': 'Y', '运': 'Y', '音': 'Y', '英': 'Y', '应': 'Y', '原': 'Y',
  // Z
  '在': 'Z', '再': 'Z', '展': 'Z', '站': 'Z', '张': 'Z', '找': 'Z', '这': 'Z', '着': 'Z', '真': 'Z', '正': 'Z', '政': 'Z', '之': 'Z', '知': 'Z', '支': 'Z', '只': 'Z', '直': 'Z', '中': 'Z', '种': 'Z', '重': 'Z', '州': 'Z', '主': 'Z', '住': 'Z', '注': 'Z', '专': 'Z', '转': 'Z', '资': 'Z', '子': 'Z', '自': 'Z', '总': 'Z', '组': 'Z', '作': 'Z', '做': 'Z', '坐': 'Z', '最': 'Z', '左': 'Z'
}

/**
 * 获取中文字符的拼音首字母
 * @param char 中文字符
 * @returns 对应的英文字母，如果不是中文字符则返回原字符
 */
export function getPinyinFirstLetter(char: string): string {
  if (pinyinMap[char]) {
    return pinyinMap[char]
  }
  
  // 如果是英文字母，直接返回大写
  if (/[a-zA-Z]/.test(char)) {
    return char.toUpperCase()
  }
  
  // 如果是数字，返回'#'
  if (/[0-9]/.test(char)) {
    return '#'
  }
  
  // 其他字符返回'#'
  return '#'
}

/**
 * 获取电台名称的首字母
 * @param name 电台名称
 * @returns 首字母（A-Z或#）
 */
export function getStationFirstLetter(name: string): string {
  if (!name || name.length === 0) {
    return '#'
  }
  
  const firstChar = name.charAt(0)
  const letter = getPinyinFirstLetter(firstChar)
  
  return /[A-Z]/.test(letter) ? letter : '#'
}

/**
 * 按首字母对电台进行分组
 * @param stations 电台列表
 * @returns 按首字母分组的电台对象
 */
export function groupStationsByLetter<T extends { name: string }>(stations: T[]): Record<string, T[]> {
  const grouped: Record<string, T[]> = {}
  
  stations.forEach(station => {
    const letter = getStationFirstLetter(station.name)
    
    if (!grouped[letter]) {
      grouped[letter] = []
    }
    grouped[letter].push(station)
  })
  
  // 对每组内的电台按名称排序
  Object.keys(grouped).forEach(letter => {
    grouped[letter].sort((a, b) => a.name.localeCompare(b.name))
  })
  
  return grouped
}

/**
 * 获取排序后的字母键列表
 * @param groupedStations 分组后的电台
 * @returns 排序后的字母数组
 */
export function getSortedLetters(groupedStations: Record<string, any[]>): string[] {
  return Object.keys(groupedStations).sort((a, b) => {
    if (a === '#') return 1
    if (b === '#') return -1
    return a.localeCompare(b)
  })
} 