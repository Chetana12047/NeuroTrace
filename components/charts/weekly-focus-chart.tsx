'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const config = {
  focus: {
    label: 'Focus score',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function WeeklyFocusChart() {

  const [activities, setActivities] =
    useState<any[]>([])

  // LOAD REALTIME DATA

  useEffect(() => {

    const loadActivities =
      async () => {

        try {

          const response =
            await fetch(
              '/activities.json'
            )

          const data =
            await response.json()

          setActivities(
            data || []
          )

        } catch (error) {

          console.log(error)

        }

      }

    loadActivities()

    const interval =
      setInterval(
        loadActivities,
        3000
      )

    return () =>
      clearInterval(
        interval
      )

  }, [])

  // WEEKLY LOGIC

  const weeklyTrend =
    useMemo(() => {

      if (
        activities.length === 0
      ) {

        return []

      }

      const days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ]

      // CURRENT WEEK START

      const today =
        new Date()

      const currentWeekStart =
        new Date(today)

      currentWeekStart.setDate(
        today.getDate() -
        today.getDay()
      )

      currentWeekStart.setHours(
        0,
        0,
        0,
        0
      )

      // CURRENT WEEK END

      const currentWeekEnd =
        new Date(
          currentWeekStart
        )

      currentWeekEnd.setDate(
        currentWeekStart.getDate() + 6
      )

      // FILTER CURRENT WEEK DATA

      const currentWeekActivities =
        activities.filter(
          (activity) => {

            if (
              !activity.date
            ) {

              return false

            }

            const activityDate =
              new Date(
                activity.date
              )

            return (

              activityDate >=
                currentWeekStart &&

              activityDate <=
                currentWeekEnd

            )

          }
        )

      // GROUP DAYWISE

      return days.map(
        (day, index) => {

          const dayActivities =
            currentWeekActivities.filter(
              (activity) => {

                const activityDate =
                  new Date(
                    activity.date
                  )

                return (
                  activityDate.getDay() ===
                  index
                )

              }
            )

          // NO DATA

          if (
            dayActivities.length === 0
          ) {

            return {

              day,

              focus: null,

            }

          }

          const totalSeconds =
            dayActivities.reduce(
              (
                acc,
                activity
              ) =>

                acc +
                Number(
                  activity.durationInSeconds || 0
                ),

              0
            )

          const productiveSeconds =
            dayActivities

              .filter(
                (activity) =>

                  activity.category
                    ?.toLowerCase() ===
                  'productive'
              )

              .reduce(
                (
                  acc,
                  activity
                ) =>

                  acc +
                  Number(
                    activity.durationInSeconds || 0
                  ),

                0
              )

          const focusScore =

            totalSeconds > 0

              ? Math.round(
                  (
                    productiveSeconds /
                    totalSeconds
                  ) * 100
                )

              : 0

          return {

            day,

            focus: focusScore,

          }

        }
      )

    }, [activities])

  return (

    <ChartContainer
      config={config}
      className="h-[240px] w-full"
    >

      <BarChart
        data={weeklyTrend}
        margin={{
          left: -16,
          right: 8,
          top: 8,
        }}
      >

        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="var(--border)"
        />

        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={32}
          domain={[0, 100]}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />

        <Bar
          dataKey="focus"
          fill="var(--color-focus)"
          radius={[6, 6, 0, 0]}
        />

      </BarChart>

    </ChartContainer>

  )

}