import { getStylePaletteEntries, isStyleHexColor } from '../lib/stylePalette'

type StylePaletteLegendMode = 'card' | 'summary' | 'legend'

interface StylePaletteLegendProps {
  palette: readonly string[]
  mode?: StylePaletteLegendMode
  className?: string
}

export default function StylePaletteLegend({ palette, mode = 'card', className = '' }: StylePaletteLegendProps) {
  const entries = getStylePaletteEntries(palette)
  const gridClass = mode === 'card'
    ? 'grid grid-cols-2 gap-x-2 gap-y-1.5'
    : mode === 'summary'
      ? 'grid grid-cols-2 gap-2 sm:grid-cols-3'
      : 'grid grid-cols-2 gap-1.5'

  return (
    <div className={`${gridClass} ${className}`.trim()}>
      {entries.map((entry) => (
        <div
          key={entry.code}
          title={`${entry.code} · ${entry.roleLabel} · ${entry.colorName} · ${entry.color}\n${entry.roleDescription}`}
          aria-label={`${entry.code}，${entry.roleLabel}，${entry.colorName}，${entry.color}`}
          className={`min-w-0 rounded-md ${mode === 'summary' ? 'bg-white/70 px-2 py-1.5 dark:bg-white/[0.05]' : 'px-0.5 py-0.5'}`}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0 rounded-sm border border-black/10 dark:border-white/15"
              style={{ backgroundColor: isStyleHexColor(entry.color) ? entry.color : '#E5E7EB' }}
            />
            <span className="min-w-0 truncate text-[10px] font-semibold leading-tight text-gray-600 dark:text-gray-300">
              {entry.code} · {entry.roleLabel}
            </span>
          </div>
          <div className="mt-0.5 truncate pl-[18px] font-mono text-[10px] leading-tight text-gray-400 dark:text-gray-500">
            {entry.colorName} · {entry.color}
          </div>
          {mode === 'legend' && (
            <div className="mt-0.5 pl-[18px] text-[10px] leading-tight text-gray-400 dark:text-gray-500">
              {entry.roleDescription}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
