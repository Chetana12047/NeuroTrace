'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { heatmap, heatmapDays, heatmapHours } from '@/lib/data'

function cellStyle(value: number) {
  // value 0-100 mapped to opacity of the primary/success accent
  const opacity = 0.08 + (value / 100) * 0.92
  return {
    backgroundColor: `color-mix(in oklch, var(--chart-2) ${Math.round(opacity * 100)}%, transparent)`,
  }
}

export function ProductivityHeatmap() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="flex">
          <div className="w-10" />
          <div className="grid flex-1 grid-cols-10 gap-1.5">
            {heatmapHours.map((h) => (
              <div key={h} className="text-center text-[11px] text-muted-foreground">
                {h}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-1.5 space-y-1.5">
          {heatmap.map((row, r) => (
            <div key={heatmapDays[r]} className="flex items-center">
              <div className="w-10 text-xs font-medium text-muted-foreground">
                {heatmapDays[r]}
              </div>
              <div className="grid flex-1 grid-cols-10 gap-1.5">
                {row.map((value, c) => (
                  <Tooltip key={c}>
                    <TooltipTrigger>
                      <div
                        className="aspect-square rounded-md ring-1 ring-inset ring-border/50 transition-transform hover:scale-110"
                        style={cellStyle(value)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {heatmapDays[r]} · {heatmapHours[c]}
                      {Number(heatmapHours[c]) < 8 ? ' PM' : ' · '}
                      {value}% focus
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
          <span>Less</span>
          {[12, 35, 58, 80, 100].map((v) => (
            <span
              key={v}
              className="size-3 rounded-sm ring-1 ring-inset ring-border/50"
              style={cellStyle(v)}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
