'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { distractionSpikes } from '@/lib/data'

const config = {
  spikes: { label: 'Distraction spikes', color: 'var(--chart-4)' },
} satisfies ChartConfig

export function DistractionChart() {
  return (
    <ChartContainer config={config} className="h-[240px] w-full">
      <BarChart data={distractionSpikes} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="spikes" fill="var(--color-spikes)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
