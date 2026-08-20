export const STYLE_PALETTE_ROLES = [
  {
    key: 'background',
    label: '背景底色',
    description: '页面底色与整体氛围',
  },
  {
    key: 'soft',
    label: '柔和辅助色',
    description: '辅助背景、浅色区域与缓冲层次',
  },
  {
    key: 'accent',
    label: '主强调色',
    description: '重点信息、按钮或视觉焦点',
  },
  {
    key: 'ink',
    label: '深色文字 / 对比色',
    description: '标题、正文和清晰对比',
  },
  {
    key: 'muted',
    label: '中性色',
    description: '次要信息、边界与低对比区域',
  },
  {
    key: 'highlight',
    label: '高亮点缀色',
    description: '小面积装饰、局部高光与活力点缀',
  },
] as const

export type StylePaletteRoleKey = typeof STYLE_PALETTE_ROLES[number]['key']

interface RgbColor {
  r: number
  g: number
  b: number
}

interface ColorNameReference {
  name: string
  hex: string
}

const COLOR_NAME_REFERENCES: ColorNameReference[] = [
  { name: '纯白', hex: '#FFFFFF' },
  { name: '奶油白', hex: '#FFF8ED' },
  { name: '浅杏色', hex: '#F4D6A6' },
  { name: '浅灰', hex: '#E5E7EB' },
  { name: '暖灰', hex: '#A8A29E' },
  { name: '墨黑', hex: '#111827' },
  { name: '深棕', hex: '#7C2D12' },
  { name: '焦糖棕', hex: '#C58A45' },
  { name: '珊瑚橙', hex: '#E76F51' },
  { name: '亮橙', hex: '#F97316' },
  { name: '明黄', hex: '#FACC15' },
  { name: '金色', hex: '#C8A24A' },
  { name: '柔粉', hex: '#F4A3C1' },
  { name: '珊瑚粉', hex: '#FE819A' },
  { name: '玫瑰红', hex: '#F43F5E' },
  { name: '橄榄绿', hex: '#8FA478' },
  { name: '鲜绿', hex: '#16A34A' },
  { name: '湖水青', hex: '#14B8A6' },
  { name: '天蓝', hex: '#38BDF8' },
  { name: '雾蓝', hex: '#94A3B8' },
  { name: '灰蓝', hex: '#7981A4' },
  { name: '亮蓝', hex: '#676CFE' },
  { name: '靛蓝', hex: '#6366F1' },
  { name: '柔和紫', hex: '#7C3AED' },
  { name: '深紫', hex: '#571D91' },
]

function parseHexColor(value: string): RgbColor | null {
  const normalized = value.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

const COLOR_NAME_REFERENCE_RGB = COLOR_NAME_REFERENCES.map((reference) => ({
  ...reference,
  rgb: parseHexColor(reference.hex)!,
}))

export function isStyleHexColor(value: string | undefined): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value.trim())
}

/**
 * Returns a readable Chinese approximation for a six-digit HEX color.
 * HEX remains the source of truth; this label is only for the UI.
 */
export function getApproximateChineseColorName(value: string | undefined): string {
  const rgb = value ? parseHexColor(value) : null
  if (!rgb) return '自定义颜色'

  const closest = COLOR_NAME_REFERENCE_RGB.reduce((best, current) => {
    const distance = (rgb.r - current.rgb.r) ** 2 + (rgb.g - current.rgb.g) ** 2 + (rgb.b - current.rgb.b) ** 2
    return distance < best.distance ? { reference: current, distance } : best
  }, { reference: COLOR_NAME_REFERENCE_RGB[0], distance: Number.POSITIVE_INFINITY })

  return closest.reference.name
}

export interface StylePaletteEntry {
  index: number
  code: string
  roleKey: StylePaletteRoleKey
  roleLabel: string
  roleDescription: string
  color: string
  colorName: string
}

export function getStylePaletteEntries(palette: readonly string[]): StylePaletteEntry[] {
  return STYLE_PALETTE_ROLES.map((role, index) => {
    const rawColor = typeof palette[index] === 'string' ? palette[index]!.trim() : ''
    const color = isStyleHexColor(rawColor) ? rawColor.toUpperCase() : rawColor || '#FFFFFF'
    return {
      index,
      code: `C${index + 1}`,
      roleKey: role.key,
      roleLabel: role.label,
      roleDescription: role.description,
      color,
      colorName: getApproximateChineseColorName(rawColor),
    }
  })
}

export function normalizeStylePaletteColor(value: string | undefined, fallback = '#FFFFFF'): string {
  if (isStyleHexColor(value)) return value.trim().toUpperCase()
  return isStyleHexColor(fallback) ? fallback.toUpperCase() : '#FFFFFF'
}
