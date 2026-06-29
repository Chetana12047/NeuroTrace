import { ArrowUpRight, Repeat, Target, Timer, TriangleAlert, Waypoints } from 'lucide-react'
import Link from 'next/link'
import { SiteIcon } from '@/components/site-icon'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { getSite, popupStats } from '@/lib/data'

function FocusRing({ score }: { score: number }) {
  return (
    <div className="relative grid size-28 place-items-center">
      <div
        className="size-28 rounded-full"
        style={{
          background: `conic-gradient(var(--primary) ${score * 3.6}deg, var(--secondary) 0deg)`,
        }}
      />
      <div className="absolute grid size-[88px] place-items-center rounded-full bg-card">
        <span className="text-3xl font-semibold tabular-nums leading-none">{score}</span>
        <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
          Focus
        </span>
      </div>
    </div>
  )
}

export default function PopupPage() {
  const current = getSite(popupStats.currentSite)

  return (
    <div className="grid min-h-svh place-items-center bg-muted/40 p-4 sm:p-8">
      <div className="flex flex-col items-center gap-5">
        {/* The popup itself */}
        <div className="w-[360px] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {/* header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Waypoints className="size-4" />
              </span>
              <span className="text-sm font-semibold tracking-tight">NeuroTrace</span>
            </div>
            <ThemeToggle />
          </div>

          {/* focus score */}
          <div className="flex flex-col items-center gap-3 px-4 pt-6 pb-4">
            <FocusRing score={popupStats.focusScore} />
            <div className="flex items-center gap-1 text-xs font-medium text-[var(--success)]">
              <ArrowUpRight className="size-3.5" />
              6% better than yesterday
            </div>
          </div>

          {/* productive / distracting */}
          <div className="grid grid-cols-2 gap-2 px-4">
            <div className="rounded-xl bg-[var(--success)]/10 p-3">
              <div className="flex items-center gap-1.5 text-[var(--success)]">
                <Target className="size-4" />
                <span className="text-xs font-medium">Productive</span>
              </div>
              <p className="mt-1.5 text-lg font-semibold tabular-nums">
                {popupStats.productiveTime}
              </p>
            </div>
            <div className="rounded-xl bg-destructive/10 p-3">
              <div className="flex items-center gap-1.5 text-destructive">
                <TriangleAlert className="size-4" />
                <span className="text-xs font-medium">Distracting</span>
              </div>
              <p className="mt-1.5 text-lg font-semibold tabular-nums">
                {popupStats.distractingTime}
              </p>
            </div>
          </div>

          {/* current site */}
          <div className="px-4 pt-3">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Currently active
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-border p-3">
              <SiteIcon domain={current.domain} size={36} />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-medium">{current.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {popupStats.currentTitle}
                </p>
              </div>
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--success)]/60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[var(--success)]" />
              </span>
            </div>
          </div>

          {/* quick stats */}
          <div className="grid grid-cols-2 gap-2 px-4 pt-3">
            <div className="flex items-center gap-2 rounded-xl bg-accent/60 p-3">
              <Timer className="size-4 text-muted-foreground" />
              <div className="leading-tight">
                <p className="text-sm font-semibold tabular-nums">{popupStats.deepWork}</p>
                <p className="text-[11px] text-muted-foreground">Deep work</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-accent/60 p-3">
              <Repeat className="size-4 text-muted-foreground" />
              <div className="leading-tight">
                <p className="text-sm font-semibold tabular-nums">
                  {popupStats.tabSwitches}
                </p>
                <p className="text-[11px] text-muted-foreground">Tab switches</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="p-4">
            <Link href="/">
              <Button className="w-full">
                Open Dashboard
                <ArrowUpRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>

        <p className="max-w-[360px] text-center text-xs text-muted-foreground text-pretty">
          Compact extension popup — a lightweight snapshot of today&apos;s focus,
          surfaced from the browser toolbar.
        </p>
        <Link href="/" className="text-xs font-medium text-primary hover:underline">
          ← Back to full dashboard
        </Link>
      </div>
    </div>
  )
}
