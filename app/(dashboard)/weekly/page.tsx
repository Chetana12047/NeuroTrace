'use client'

import {
  Activity,
  Gauge,
  Timer,
  Waypoints,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { WeeklyFocusChart } from '@/components/charts/weekly-focus-chart'

import { PageHeader } from '@/components/dashboard/page-header'
import { StatCard } from '@/components/dashboard/stat-card'

import { SiteIcon } from '@/components/site-icon'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Progress } from '@/components/ui/progress'

export default function WeeklyPage() {

  const [activities, setActivities] =
    useState<any[]>([])

  // LOAD REALTIME ACTIVITIES

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

  // FORMAT TIME

  const formatDuration = (
    seconds: number
  ) => {

    const hrs =
      Math.floor(
        seconds / 3600
      )

    const mins =
      Math.floor(
        (seconds % 3600) / 60
      )

    if (hrs > 0) {

      return `${hrs}h ${mins}m`

    }

    return `${mins}m`

  }

  // CURRENT WEEK FILTER

  const isCurrentWeek = (
    dateString: string
  ) => {

    if (!dateString) {
      return false
    }

    const today =
      new Date()

    const currentDay =
      today.getDay()

    const monday =
      new Date(today)

    monday.setDate(
      today.getDate() -
      (
        currentDay === 0
          ? 6
          : currentDay - 1
      )
    )

    monday.setHours(
      0,
      0,
      0,
      0
    )

    const sunday =
      new Date(monday)

    sunday.setDate(
      monday.getDate() + 6
    )

    sunday.setHours(
      23,
      59,
      59,
      999
    )

    const activityDate =
      new Date(dateString)

    return (
      activityDate >= monday &&
      activityDate <= sunday
    )

  }

  // NORMALIZE DOMAIN

  const normalizeDomain = (
    activity: any
  ) => {

    const combined =
      `
        ${activity.domain || ''}
        ${activity.url || ''}
        ${activity.title || ''}
        ${activity.app || ''}
        ${activity.appName || ''}
      `
        .toLowerCase()

    if (
      combined.includes('chatgpt') ||
      combined.includes('openai')
    ) {

      return 'ChatGPT'

    }

    if (
      combined.includes('visual studio') ||
      combined.includes('vs code') ||
      combined.includes('vscode')
    ) {

      return 'VS Code'

    }

    if (
      combined.includes('github')
    ) {

      return 'GitHub'

    }

    if (
      combined.includes('youtube')
    ) {

      return 'YouTube'

    }

    if (
      combined.includes('localhost') ||
      combined.includes('127.0.0.1')
    ) {

      return 'Localhost'

    }

    return (

      activity.domain ||

      activity.app ||

      activity.appName ||

      'Other'

    )

      .replace('www.', '')
      .replace('.com', '')
      .replace('.org', '')
      .replace('.in', '')

  }

  // WEEKLY DATA

  const weeklyData =
    useMemo(() => {

      const weeklyActivities =
        activities.filter(
          (activity) =>

            isCurrentWeek(
              activity.date
            )
        )

      // TOTAL ACTIVE

      const totalSeconds =
        weeklyActivities.reduce(
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

      // PRODUCTIVE

      const productive =
        weeklyActivities.filter(
          (activity) =>

            activity.category
              ?.toLowerCase() ===
            'productive'
        )

      // DISTRACTING

      const distracting =
        weeklyActivities.filter(
          (activity) =>

            activity.category
              ?.toLowerCase() ===
            'distracting'
        )

      // DEEP WORK

      const deepWork =
        productive.filter(
          (activity) =>

            Number(
              activity.durationInSeconds || 0
            ) >= 1200
        )

      // FOCUS SCORE

      const productiveSeconds =
        productive.reduce(
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

      // CONSISTENCY

      const consistency =

        productive.length > 0

          ? Math.min(
              100,
              Math.round(
                (
                  productive.length /
                  (
                    productive.length +
                    distracting.length +
                    1
                  )
                ) * 100
              )
            )

          : 0

      // TOP SITES

      const grouped:
        Record<
          string,
          {
            domain: string
            seconds: number
          }
        > = {}

      productive.forEach(
        (activity) => {

          const domain =
            normalizeDomain(
              activity
            )

          const seconds =
            Number(
              activity.durationInSeconds || 0
            )

          if (
            !grouped[domain]
          ) {

            grouped[
              domain
            ] = {

              domain,

              seconds: 0,

            }

          }

          grouped[
            domain
          ].seconds +=
            seconds

        }
      )

      const topSites =
        Object.values(
          grouped
        )

          .sort(
            (a, b) =>

              b.seconds -
              a.seconds
          )

          .slice(0, 6)

      return {

        totalSeconds,

        deepWorkCount:
          deepWork.length,

        focusScore,

        consistency,

        totalActivities:
          weeklyActivities.length,

        topSites,

      }

    }, [activities])

  // MAX PROGRESS

  const maxSeconds =

    weeklyData.topSites.length > 0

      ? Math.max(
          ...weeklyData.topSites.map(
            (site) =>

              site.seconds
          )
        )

      : 1

  return (

    <div className="mx-auto max-w-7xl">

      <PageHeader
        title="Weekly Analytics"
        description="Your productivity trends across the week — total active time, deep work, focus scores, and consistency."
      >

        <span className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-muted-foreground">

          Current Week

        </span>

      </PageHeader>

      {/* TOP CARDS */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <StatCard
          label="Total Active"
          value={
            formatDuration(
              weeklyData.totalSeconds
            )
          }
          icon={Activity}
        />

        <StatCard
          label="Deep Work"
          value={`${weeklyData.deepWorkCount}`}
          icon={Timer}
          hint="20+ minute sessions"
        />

        <StatCard
          label="Avg. Focus"
          value={`${weeklyData.focusScore}`}
          icon={Gauge}
          hint="out of 100"
        />

        <StatCard
          label="Consistency"
          value={`${weeklyData.consistency}%`}
          icon={Waypoints}
        />

      </div>

      {/* MAIN SECTION */}

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* TOP SITES */}

        <Card className="lg:col-span-2">

          <CardHeader>

            <CardTitle>
              Top Sites This Week
            </CardTitle>

            <CardDescription>
              Productive platforms ranked by weekly usage.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4">

            {weeklyData.topSites.length > 0 ? (

              weeklyData.topSites.map(
                (
                  site,
                  index
                ) => (

                  <div
                    key={index}
                    className="space-y-2"
                  >

                    <div className="flex items-center gap-3">

                      <SiteIcon
                        domain={
                          site.domain
                        }
                        size={30}
                      />

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium">

                          {
                            site.domain
                          }

                        </p>

                      </div>

                      <span className="text-xs font-medium tabular-nums text-muted-foreground">

                        {formatDuration(
                          site.seconds
                        )}

                      </span>

                    </div>

                    <Progress
                      value={
                        (
                          site.seconds /
                          maxSeconds
                        ) * 100
                      }
                      className="h-2"
                    />

                  </div>

                )
              )

            ) : (

              <div className="flex h-[250px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">

                No weekly activity yet

              </div>

            )}

          </CardContent>

        </Card>

        {/* DAILY FOCUS */}

        <Card>

          <CardHeader>

            <CardTitle>
              Daily Focus Score
            </CardTitle>

            <CardDescription>
              Focus quality per day.
            </CardDescription>

          </CardHeader>

          <CardContent>

            <WeeklyFocusChart />

          </CardContent>

        </Card>

      </div>
      {/* REFLECTION SECTION */}

<Card className="mt-5 border-primary/20 bg-primary/[0.03]">

  <CardContent className="py-8">

    <div className="mx-auto max-w-3xl text-center">

      <p className="text-lg font-semibold leading-relaxed text-balance">

        Productivity is not about working endlessly —
        it is about understanding where your attention goes.

      </p>

      <p className="mt-4 text-sm leading-7 text-muted-foreground text-pretty">

        Small distractions repeated daily slowly shape habits.
        By tracking focus patterns, interruptions, and deep work sessions,
        you become more aware of how you spend your energy and time.

        Consistent self-observation helps build stronger routines,
        healthier digital behavior, and more intentional work sessions.

      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">

        <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
          Focus Awareness
        </span>

        <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
          Digital Discipline
        </span>

        <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
          Deep Work
        </span>

        <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
          Behavioral Analytics
        </span>

      </div>

    </div>

  </CardContent>

</Card>

    </div>

  )

}