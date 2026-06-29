'use client'

declare const chrome: any

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const DAYS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]

export function RealtimeProductivityChart(){

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

  const weeklyData =
    useMemo(() => {

      const data =
        DAYS.map((day) => ({
          day,
          productive: 0,
          neutral: 0,
          distracting: 0,
        }))

      activities.forEach(
        (activity) => {

          const duration =
            Number(
              activity.durationInSeconds || 0
            )

          if (
            duration <= 1
          ) {
            return
          }

          const date =
  activity.date
    ? new Date(activity.date)
    : new Date()

const dayIndex =
  isNaN(date.getDay())
    ? new Date().getDay()
    : date.getDay()

if (!data[dayIndex]) {
  return
}

          if (
            activity.category ===
            'Productive'
          ) {

            data[
              dayIndex
            ].productive += Math.round(duration / 60)

          }

          else if (
            activity.category ===
            'Distracting'
          ) {

            data[
              dayIndex
            ].distracting += Math.round(duration / 60)

          }

          else {

            data[
              dayIndex
            ].neutral += Math.round(duration / 60)

          }

        }
      )

      return data

    }, [activities])

  return (

    <div className="h-[260px] w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart
          data={weeklyData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >

          <defs>

            <linearGradient
              id="productiveFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="var(--chart-1)"
                stopOpacity={0.45}
              />

              <stop
                offset="95%"
                stopColor="var(--chart-1)"
                stopOpacity={0}
              />

            </linearGradient>

            <linearGradient
              id="neutralFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="var(--chart-3)"
                stopOpacity={0.45}
              />

              <stop
                offset="95%"
                stopColor="var(--chart-3)"
                stopOpacity={0}
              />

            </linearGradient>

            <linearGradient
              id="distractingFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="var(--chart-4)"
                stopOpacity={0.45}
              />

              <stop
                offset="95%"
                stopColor="var(--chart-4)"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
          />

          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            domain={[0, (dataMax: number) => dataMax + 20]}
          />

          <Tooltip
            formatter={(value: any) =>
              `${Math.round(value)} mins`
            }
          />

          <Area
            type="linear"
            dataKey="productive"
            stroke="var(--chart-1)"
            fill="url(#productiveFill)"
            strokeWidth={4}
            dot={{
              r: 6,
            }}
          />

          <Area
            type="linear"
            dataKey="neutral"
            stroke="var(--chart-3)"
            fill="url(#neutralFill)"
            strokeWidth={4}
            dot={{
              r: 6,
            }}
          />

          <Area
            type="linear"
            dataKey="distracting"
            stroke="var(--chart-4)"
            fill="url(#distractingFill)"
            strokeWidth={4}
            dot={{
              r: 6,
            }}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  )

}