'use client'

import {
  Flame,
  Layers,
  Timer,
  Zap,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { FocusConsistencyChart } from '@/components/charts/focus-consistency-chart'
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

export default function FocusPage() {

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
        2000
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

  // NORMALIZE DOMAINS + APPS

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

  // CHATGPT

  if (
    combined.includes('chatgpt') ||
    combined.includes('chat.openai') ||
    combined.includes('openai')
  ) {

    return 'ChatGPT'

  }

  // VS CODE

  if (
    combined.includes('visual studio') ||
    combined.includes('vs code') ||
    combined.includes('vscode')
  ) {

    return 'VS Code'

  }

  // GITHUB

  if (
    combined.includes('github')
  ) {

    return 'GitHub'

  }

  // LOCALHOST

  if (
    combined.includes('localhost') ||
    combined.includes('127.0.0.1')
  ) {

    return 'Localhost'

  }

  // YOUTUBE

  if (
    combined.includes('youtube')
  ) {

    return 'YouTube'

  }

  // LINKEDIN

  if (
    combined.includes('linkedin')
  ) {

    return 'LinkedIn'

  }

  // GOOGLE DOCS

  if (
    combined.includes('docs.google') ||
    combined.includes('drive.google')
  ) {

    return 'Google Docs'

  }

  // FIGMA

  if (
    combined.includes('figma')
  ) {

    return 'Figma'

  }

  // GEMINI

  if (
    combined.includes('gemini')
  ) {

    return 'Gemini'

  }

  // PERPLEXITY

  if (
    combined.includes('perplexity')
  ) {

    return 'Perplexity'

  }

  // STACKOVERFLOW

  if (
    combined.includes('stackoverflow')
  ) {

    return 'StackOverflow'

  }

  // DEFAULT

  const fallback =

    activity.domain ||
    activity.app ||
    activity.appName ||
    activity.url ||
    'Other'

  return fallback

    .replace('www.', '')
    .replace('.com', '')
    .replace('.org', '')
    .replace('.in', '')

}

  // TODAY FILTER

  const isToday = (
    dateString: string
  ) => {

    if (!dateString) {
      return false
    }

    const activityDate =
      new Date(dateString)

    const today =
      new Date()

    return (
      activityDate.toDateString() ===
      today.toDateString()
    )

  }

  // REAL GROUPING

// REALTIME SESSION ENGINE

const groupedSessions =
  useMemo(() => {

    if (
      !activities ||
      activities.length === 0
    ) {

      return []

    }

    const grouped:
      Record<
        string,
        {
          domain: string
          totalSeconds: number
          lastSeen: number
        }
      > = {}

    activities.forEach(
      
      (activity) => {
        console.log(
  activity.title,
  activity.domain,
  activity.app,
  activity.durationInSeconds,
  activity.category
)

        // TODAY ONLY

        if (
          !isToday(
            activity.date
          )
        ) {

          return

        }

        // PRODUCTIVE ONLY

        if (
          activity.category
            ?.toLowerCase() !==
          'productive'
        ) {

          return

        }

        // NORMALIZED NAME

        const domain =
          normalizeDomain(
            activity
          )

        // SKIP INVALID

        if (
          !domain ||
          domain === 'Other'
        ) {

          return

        }

        // TIMESTAMP

        const timestamp =
          new Date(
            activity.date ||
            activity.timestamp ||
            Date.now()
          ).getTime()

        // SESSION DURATION

        let seconds =
          Number(
            activity.durationInSeconds || 0
          )

        // FALLBACK REALTIME LOGIC

        // IF EXTENSION SENDS 0
        // USE LIVE SESSION ESTIMATE

        if (
          seconds <= 0
        ) {

          seconds = 5

        }

        // CREATE GROUP

        if (
          !grouped[domain]
        ) {

          grouped[
            domain
          ] = {

            domain,

            totalSeconds: 0,

            lastSeen:
              timestamp,

          }

        }

        // TIME GAP

        const gap =
          Math.abs(
            timestamp -
            grouped[
              domain
            ].lastSeen
          ) / 1000

        // CONTINUOUS SESSION

        // IF SAME APP CONTINUES
        // WITHIN 2 MINUTES
        // ADD TIME

        if (
          gap <= 120
        ) {

          grouped[
            domain
          ].totalSeconds +=
            seconds

        }

        // NEW SESSION

        else {

          grouped[
            domain
          ].totalSeconds +=
            seconds

        }

        // UPDATE LAST SEEN

        grouped[
          domain
        ].lastSeen =
          timestamp

      }
    )

    // CONVERT ARRAY

    const finalData =
      Object.values(
        grouped
      )

        // REMOVE VERY SMALL

        .filter(
          (item) =>
            item.totalSeconds > 5
        )

        // DESCENDING

        .sort(
          (a, b) =>

            b.totalSeconds -
            a.totalSeconds
        )

    return finalData

  }, [activities])

  // TOP CARDS

  const longestSession =
    groupedSessions[0]

  const avgSession =

    groupedSessions.length > 0

      ? groupedSessions.reduce(
          (acc, item) =>

            acc +
            item.totalSeconds,

          0
        ) /
        groupedSessions.length

      : 0

  const deepSessions =
    groupedSessions.filter(
      (item) =>

        item.totalSeconds >= 1200
    ).length

  const fragmentation =

    groupedSessions.length <= 3

      ? 'Low'

      : groupedSessions.length <= 5

      ? 'Medium'

      : 'High'

  return (

    <div className="mx-auto max-w-7xl">

      <PageHeader
        title="Focus Analytics"
        description="A deeper look at attention quality, uninterrupted work sessions, and sustained focus patterns."
      />

      {/* TOP CARDS */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <StatCard
          label="Longest Session"
          value={
            longestSession

              ? formatDuration(
                  longestSession.totalSeconds
                )

              : '0m'
          }
          icon={Flame}
          hint={
            longestSession?.domain ||
            'No data'
          }
        />

        <StatCard
          label="Avg. Session"
          value={
            formatDuration(
              avgSession
            )
          }
          icon={Timer}
        />

        <StatCard
          label="Fragmentation"
          value={fragmentation}
          icon={Layers}
          hint="productive distribution"
        />

        <StatCard
          label="Deep Sessions"
          value={`${deepSessions}`}
          icon={Zap}
          hint="over 20 mins"
        />

      </div>

      {/* MAIN SECTION */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-5">

        {/* CONTINUOUS WORK */}

        <Card className="xl:col-span-3 min-h-[480px]">

          <CardHeader>

            <CardTitle>
              Continuous Work Sessions
            </CardTitle>

            <CardDescription>
              Productive apps and tabs ranked by total focus time.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-3">

            {groupedSessions.length > 0 ? (

              groupedSessions.map(
                (
                  session,
                  index
                ) => (

                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-4 transition-colors hover:bg-accent/40"
                  >

                    <SiteIcon
                      domain={
                        session.domain
                      }
                      size={38}
                    />

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-medium">

                        {
                          session.domain
                        }

                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">

                        Combined productive sessions

                      </p>

                    </div>

                    <Badge
                      variant="secondary"
                      className="tabular-nums"
                    >

                      {formatDuration(
                        session.totalSeconds
                      )}

                    </Badge>

                  </div>

                )
              )

            ) : (

              <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">

                No productive sessions yet

              </div>

            )}

          </CardContent>

        </Card>

        {/* RIGHT SIDE */}

        <Card className="xl:col-span-2 min-h-[450px]">

          <CardHeader>

            <CardTitle>
              Focus Fragmentation
            </CardTitle>

            <CardDescription>
              Continuous attention stability throughout the day.
            </CardDescription>

          </CardHeader>

          <CardContent>

            <FocusConsistencyChart />

          </CardContent>

          <div className="mx-2 mb-2 mt-2 rounded-xl border bg-muted/30 px-4 py-3">

            <p className="text-sm leading-5 text-muted-foreground">

              Consistent focus is built gradually through work patterns,
              short breaks, and sustained attention over time.

            </p>

          </div>

          <div className="mx-2 mb-2 rounded-xl border bg-muted/30 px-4 py-3">

            <p className="text-sm leading-5 text-muted-foreground">

              Productive work often includes concentration,
              switching, reflection, and gradual rhythm building.

            </p>

          </div>

          <div className="mx-2 mb-2 rounded-xl border bg-muted/30 px-4 py-3">

            <p className="text-sm leading-5 text-muted-foreground">

              Work patterns become clearer through repeated sessions,
              steady engagement, and evolving focus habits.

            </p>

          </div>

        </Card>

      </div>

    </div>

  )

}