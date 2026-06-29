'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { weeklyConsistency } from '@/lib/data'

const config = {
  consistency: { label: 'Consistency', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function WeeklyConsistencyChart() {
  return (
    <ChartContainer config={config} className="h-[240px] w-full">
      <AreaChart data={weeklyConsistency} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillConsistency" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-consistency)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-consistency)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} domain={[0, 100]} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="consistency"
          type="monotone"
          stroke="var(--color-consistency)"
          strokeWidth={2.5}
          fill="url(#fillConsistency)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
