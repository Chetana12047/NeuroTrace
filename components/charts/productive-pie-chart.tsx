'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Cell,
  Label,
  Pie,
  PieChart,
} from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const config = {

  value: {
    label: 'Seconds',
  },

  Productive: {
    label: 'Productive',
    color: 'var(--chart-1)',
  },

  Neutral: {
    label: 'Neutral',
    color: 'var(--chart-3)',
  },

  Distracting: {
    label: 'Distracting',
    color: 'var(--chart-4)',
  },

} satisfies ChartConfig

export function ProductivePieChart() {

  const [activities, setActivities] =
    useState<any[]>([])

  useEffect(() => {

  const loadActivities = async () => {

    try {

      const response =
        await fetch('/activities.json')

      const data =
        await response.json()

      setActivities(data || [])

    } catch (error) {

      console.log(error)

    }

  }

  loadActivities()

  const interval =
    setInterval(loadActivities, 2000)

  return () =>
    clearInterval(interval)

}, [])

  const chartData = useMemo(() => {

    let productive = 0
    let neutral = 0
    let distracting = 0

    activities.forEach((a) => {

      const duration =
        Number(
          a.durationInSeconds || 0
        )

      if (
        duration <= 1
      ) {
        return
      }

      const category =
  String(
    a.category || ''
  ).toLowerCase()

if (
  category ===
  'productive'
) {

  productive += duration

}

else if (
  category ===
  'distracting'
) {

  distracting += duration

}

else {

  neutral += duration

}
    })

    return [

      {
        name: 'Productive',
        value: productive,
        fill: 'var(--chart-1)',
      },

      {
        name: 'Neutral',
        value: neutral,
        fill: 'var(--chart-3)',
      },

      {
        name: 'Distracting',
        value: distracting,
        fill: 'var(--chart-4)',
      },

    ]

  }, [activities])

  const total =
    chartData.reduce(
      (acc, d) =>
        acc + Number(d.value),
      0
    )

  const productivePct =
    total === 0
      ? 0
      : Math.round(
          (
            Number(
              chartData[0].value
            ) / total
          ) * 100
        )

  if (total === 0) {

    return (

      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">

        No activity data yet

      </div>

    )

  }

  return (

    <ChartContainer
      config={config}
      className="mx-auto aspect-square h-[240px]"
    >

      <PieChart>

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
            />
          }
        />

        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={92}
          strokeWidth={2}
          stroke="var(--card)"
        >

          {chartData.map(
            (entry) => (

              <Cell
                key={entry.name}
                fill={entry.fill}
              />

            )
          )}

          <Label
            content={({ viewBox }) => {

              if (
                viewBox &&
                'cx' in viewBox &&
                'cy' in viewBox
              ) {

                return (

                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                  >

                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-semibold"
                    >

                      {productivePct}%

                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={
                        (viewBox.cy ?? 0) + 22
                      }
                      className="fill-muted-foreground text-xs"
                    >

                      Productive

                    </tspan>

                  </text>

                )

              }

              return null

            }}
          />

        </Pie>

      </PieChart>

    </ChartContainer>

  )

}