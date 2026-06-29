import { type Category, categoryMeta } from '@/lib/data'
import { cn } from '@/lib/utils'

const styles: Record<Category, string> = {
  productive:
    'bg-[var(--success)]/12 text-[var(--success)] ring-[var(--success)]/25',
  distracting:
    'bg-destructive/12 text-destructive ring-destructive/25',
  neutral: 'bg-[var(--warning)]/12 text-[var(--warning)] ring-[var(--warning)]/25',
}

export function CategoryBadge({
  category,
  className,
}: {
  category: Category
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        styles[category],
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: categoryMeta[category].color }}
      />
      {categoryMeta[category].label}
    </span>
  )
}
