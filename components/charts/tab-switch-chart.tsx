'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { tabSwitches } from '@/lib/data'

const config = {
  switches: { label: 'Tab switches', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function TabSwitchChart() {
  return (
    <ChartContainer config={config} className="h-[240px] w-full">
      <BarChart data={tabSwitches} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="switches" fill="var(--color-switches)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
