import { describe, expect, it } from 'vitest'
import {
  getApproximateChineseColorName,
  getStylePaletteEntries,
  isStyleHexColor,
  normalizeStylePaletteColor,
  STYLE_PALETTE_ROLES,
} from './stylePalette'

describe('style palette metadata', () => {
  it('keeps the six palette roles aligned with the reference image order', () => {
    const entries = getStylePaletteEntries(['#fff8ed', '#f4d6a6', '#e76f51', '#111827', '#94a3b8', '#38bdf8'])

    expect(STYLE_PALETTE_ROLES).toHaveLength(6)
    expect(entries.map((entry) => entry.code)).toEqual(['C1', 'C2', 'C3', 'C4', 'C5', 'C6'])
    expect(entries.map((entry) => entry.roleLabel)).toEqual([
      '背景底色',
      '柔和辅助色',
      '主强调色',
      '深色文字 / 对比色',
      '中性色',
      '高亮点缀色',
    ])
    expect(entries[0]).toMatchObject({ color: '#FFF8ED', colorName: '奶油白' })
    expect(entries[2]).toMatchObject({ color: '#E76F51', colorName: '珊瑚橙' })
  })

  it('provides stable Chinese approximations for known colors and a safe fallback for custom values', () => {
    expect(getApproximateChineseColorName('#111827')).toBe('墨黑')
    expect(getApproximateChineseColorName('#676CFE')).toBe('亮蓝')
    expect(getApproximateChineseColorName('not-a-hex')).toBe('自定义颜色')
    expect(getApproximateChineseColorName(undefined)).toBe('自定义颜色')
  })

  it('normalizes valid colors without allowing invalid values into color inputs', () => {
    expect(isStyleHexColor('#abc123')).toBe(true)
    expect(isStyleHexColor('abc123')).toBe(false)
    expect(normalizeStylePaletteColor('#abc123')).toBe('#ABC123')
    expect(normalizeStylePaletteColor('bad')).toBe('#FFFFFF')
    expect(getStylePaletteEntries(['bad'])[0]).toMatchObject({ color: 'bad', colorName: '自定义颜色' })
  })
})
