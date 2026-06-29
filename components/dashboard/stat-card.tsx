import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
  invertDelta = false,
}: {
  label: string
  value: string
  delta?: number
  icon: LucideIcon
  hint?: string
  /** when true, a negative delta is "good" (e.g. distracting time) */
  invertDelta?: boolean
}) {
  const positive = delta !== undefined && delta >= 0
  const good = invertDelta ? !positive : positive

  return (
    <Card className="gap-0 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-muted-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium tabular-nums',
              good ? 'text-[var(--success)]' : 'text-destructive',
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </Card>
  )
}
