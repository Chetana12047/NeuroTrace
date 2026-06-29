'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Activity,
  Clock,
  Gauge,
  Target,
  Timer,
  TriangleAlert,
} from 'lucide-react'

import { FocusConsistencyChart } from '@/components/charts/focus-consistency-chart'
import { ProductivePieChart } from '@/components/charts/productive-pie-chart'
import { RealtimeProductivityChart } from '@/components/charts/realtime-productivity-chart'

import { PageHeader } from '@/components/dashboard/page-header'
import { StatCard } from '@/components/dashboard/stat-card'

import { SiteIcon } from '@/components/site-icon'

import { Badge } from '@/components/ui/badge'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const legend = [
  { label: 'Productive', color: 'var(--chart-1)' },
  { label: 'Neutral', color: 'var(--chart-3)' },
  { label: 'Distracting', color: 'var(--chart-4)' },
]

export default function OverviewPage() {

  const [activities, setActivities] =
    useState<any[]>([])

useEffect(() => {

  async function loadActivities() {

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

  const stats = useMemo(() => {

    const productive =
      activities.filter(
        (a) =>
          a.category === 'Productive'
      )

    const distracting =
      activities.filter(
        (a) =>
          a.category === 'Distracting'
      )

    const productiveSeconds =
      productive.reduce(
        (sum, a) =>
          sum + a.durationInSeconds,
        0
      )

    const distractingSeconds =
      distracting.reduce(
        (sum, a) =>
          sum + a.durationInSeconds,
        0
      )

    const totalSeconds =
      activities.reduce(
        (sum, a) =>
          sum + a.durationInSeconds,
        0
      )

    const formatTime = (
      seconds: number
    ) => {

      const hrs =
        Math.floor(seconds / 3600)

      const mins =
        Math.floor(
          (seconds % 3600) / 60
        )

      if (hrs <= 0) {

        if (mins <= 0) {

          return `${seconds}s`

          }

        return `${mins}m`

      }

      return `${hrs}h ${mins}m`
    }

    const domains: Record<
      string,
      number
    > = {}

    activities.forEach((a) => {

      domains[a.domain] =
        (domains[a.domain] || 0) +
        a.durationInSeconds

    })

    const topDomain =
      Object.entries(domains).sort(
        (a, b) => b[1] - a[1]
      )[0]

    const focusScore =
      totalSeconds === 0
        ? 0
        : Math.round(
            (productiveSeconds /
              totalSeconds) *
              100
          )

    return {

      focusScore,

      productiveTime:
        formatTime(
          productiveSeconds
        ),

      distractingTime:
        formatTime(
          distractingSeconds
        ),

      activeHours:
        formatTime(totalSeconds),

      deepWork:
        formatTime(
          productiveSeconds
        ),

      topSite:
        topDomain?.[0] ||
        'No data',

      topSiteTime:
        formatTime(
          topDomain?.[1] || 0
        ),

      recent:
        [...activities]
          .reverse()
          .slice(0, 6),

    }

  }, [activities])

  return (

    <div className="mx-auto max-w-7xl">

      <PageHeader
        title="Overview"
        description="A snapshot of your browsing behavior, focus quality, and how your time was distributed today."
      />

      {/* Top Stats */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">

        <StatCard
          label="Focus Score"
          value={`${stats.focusScore}`}
          delta={0}
          icon={Gauge}
          hint="out of 100"
        />

        <StatCard
          label="Productive Time"
          value={stats.productiveTime}
          delta={0}
          icon={Target}
        />

        <StatCard
          label="Distracting Time"
          value={stats.distractingTime}
          delta={0}
          icon={TriangleAlert}
        />

        <StatCard
          label="Deep Work"
          value={stats.deepWork}
          delta={0}
          icon={Timer}
        />

        <StatCard
          label="Active Hours"
          value={stats.activeHours}
          delta={0}
          icon={Clock}
        />

        <Card className="gap-0 p-5">

          <div className="flex items-center justify-between">

            <span className="text-sm font-medium text-muted-foreground">
              Top Website
            </span>

            <Activity className="size-4 text-muted-foreground" />

          </div>

          <div className="mt-3 flex items-center gap-2.5">

            <SiteIcon
              domain={stats.topSite}
              size={32}
            />

            <div className="min-w-0 leading-tight">

              <p className="truncate text-sm font-semibold">
                {stats.topSite}
              </p>

              <p className="text-xs text-muted-foreground tabular-nums">

                {stats.topSiteTime}

              </p>

            </div>

          </div>

        </Card>

      </div>

      {/* Charts */}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">

        <Card className="lg:col-span-2">

          <CardHeader>

            <CardTitle>
              Realtime Productivity Trend
            </CardTitle>

            <CardDescription>
              Live productive, neutral, and distracting activity tracking.
            </CardDescription>

          </CardHeader>

          <CardContent>

            <RealtimeProductivityChart />

          </CardContent>

        </Card>

        <Card>

          <CardHeader>

            <CardTitle>
              Productive vs Distracting
            </CardTitle>

            <CardDescription>
              Today's time distribution.
            </CardDescription>

          </CardHeader>

          <CardContent>

            <ProductivePieChart />

            <div className="mt-4 flex items-center justify-center gap-4">

              {legend.map((l) => (

                <div
                  key={l.label}
                  className="flex items-center gap-1.5"
                >

                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        l.color
                    }}
                  />

                  <span className="text-xs text-muted-foreground">

                    {l.label}

                  </span>

                </div>

              ))}

            </div>

          </CardContent>

        </Card>

      </div>

      {/* Bottom Section */}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">

        <Card className="lg:col-span-2">

          <CardHeader>

            <CardTitle>
              Focus Consistency
            </CardTitle>

            <CardDescription>
              How steadily you held attention throughout the day.
            </CardDescription>

          </CardHeader>

          <CardContent>

            <FocusConsistencyChart />

          </CardContent>

        </Card>

        <Card>

          <CardHeader className="flex-row items-center justify-between">

            <div>

              <CardTitle>
                Recent Activity
              </CardTitle>

              <CardDescription>
                Latest tracked sessions.
              </CardDescription>

            </div>

          </CardHeader>

          <CardContent className="space-y-1">

            {stats.recent.map(
              (entry: any, i) => (

                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent/60"
                >

                  <SiteIcon
                    domain={entry.domain}
                    size={32}
                  />

                  <div className="min-w-0 flex-1 leading-tight">

                    <p className="truncate text-sm font-medium">

                      {entry.domain}

                    </p>

                    <p className="truncate text-xs text-muted-foreground">

                      {entry.title}

                    </p>

                  </div>

                  <div className="flex flex-col items-end gap-1">

                    <span className="text-xs font-medium tabular-nums text-muted-foreground">

                      {entry.startTime}

                    </span>

                    <Badge
                      variant="secondary"
                      className="tabular-nums"
                    >

                      {entry.durationInSeconds}s

                    </Badge>

                  </div>

                </div>

              )
            )}

          </CardContent>

        </Card>

      </div>

    </div>

  )
}