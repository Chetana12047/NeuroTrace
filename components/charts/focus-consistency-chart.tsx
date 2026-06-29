'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function FocusConsistencyChart() {

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

  const chartData =
    useMemo(() => {

      // ONLY PRODUCTIVE
      const productiveActivities =
        activities.filter(
          (activity) =>

            activity.category ===
              'Productive' &&

            activity.durationInSeconds > 1
        )

      // LAST 12 PRODUCTIVE SESSIONS
      const recentActivities =
        productiveActivities.slice(-12)

      let cumulativeFocus = 0

      return recentActivities.map(
        (activity, index) => {

          // ADD PRODUCTIVE TIME
          cumulativeFocus +=
            Math.max(
              1,
              Math.round(
                activity.durationInSeconds / 60
              )
            )

          // LIMIT GRAPH SCALE
          const focusScore =
            Math.min(
              cumulativeFocus,
              100
            )

          return {

            time:
              activity.startTime
                ?.split(':')
                .slice(0, 2)
                .join(':') || '--',

            focus:
              focusScore,

          }

        }
      )

    }, [activities])

  if (chartData.length === 0) {

    return (

      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">

        No productive activity yet

      </div>

    )

  }

  return (

    <div className="h-[260px] w-full mt-6">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: -10,
            bottom: 0,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
          />

          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />

          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            fontSize={11}
            width={30}
          />

          <Tooltip
            formatter={(value: any) => [
              `${value}% Focus`,
              'Consistency',
            ]}
          />

          <Line
            type="monotone"
            dataKey="focus"
            stroke="var(--chart-2)"
            strokeWidth={3.5}
            dot={{
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  )

}