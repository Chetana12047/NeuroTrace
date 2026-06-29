'use client'

import {
  CircleAlert,
  Eye,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import { PageHeader } from '@/components/dashboard/page-header'

import { Badge } from '@/components/ui/badge'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { cn } from '@/lib/utils'

import { generateInsights }
from '@/lib/insights-engine'

const kindMeta = {

  observation: {
    label: 'Observation',
    icon: Eye,
    tone:
      'text-primary bg-primary/12 ring-primary/20',
  },

  recommendation: {
    label: 'Recommendation',
    icon: TrendingUp,
    tone:
      'text-[var(--success)] bg-[var(--success)]/12 ring-[var(--success)]/20',
  },

  tip: {
    label: 'Tip',
    icon: Lightbulb,
    tone:
      'text-[var(--warning)] bg-[var(--warning)]/12 ring-[var(--warning)]/20',
  },

  distraction: {
    label: 'Distraction',
    icon: CircleAlert,
    tone:
      'text-destructive bg-destructive/12 ring-destructive/20',
  },

}

export default function InsightsPage() {

  const [activities, setActivities] =
    useState<any[]>([])

  const [aiInsights, setAiInsights] =
    useState<any>(null)

  // LOAD REALTIME DATA

  useEffect(() => {

    const loadData =
      async () => {

        try {

          const response =
            await fetch(
              '/activities.json'
            )

          const data =
            await response.json()

          setActivities(data)

          const generated =
            generateInsights(data)

          setAiInsights(generated)

        } catch (error) {

          console.log(error)

        }

      }

    loadData()

    const interval =
      setInterval(
        loadData,
        3000
      )

    return () =>
      clearInterval(interval)

  }, [])

  // WAITING STATE

  if (!aiInsights) {

    return (

      <div className="mx-auto max-w-6xl">

        <PageHeader
          title="AI Insights"
          description="Analyzing behavior patterns..."
        />

      </div>

    )

  }

  // DYNAMIC INSIGHT CARDS

  const insightCards = [

    {

      kind: 'observation',

      title:
        'Peak Productivity Window',

      body:
        aiInsights.peakHour,

    },

    {

      kind: 'distraction',

      title:
        'Distraction Analysis',

      body:
        aiInsights.distraction,

    },

    {

      kind: 'observation',

      title:
        'Deep Work Detection',

      body:
        aiInsights.deepWork,

    },

    {

      kind: 'tip',

      title:
        'Focus Recommendation',

      body:
        aiInsights.recommendation,

    },

  ]

  return (

    <div className="mx-auto max-w-6xl">

      <PageHeader
        title="AI Insights"
        description="Behavioral summaries generated from your activity patterns."
      />

      {/* SUMMARY */}

      <Card className="mb-4 border-primary/30 bg-primary/[0.04]">

        <CardContent className="flex items-start gap-4 py-5">

          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">

            <Sparkles className="size-5" />

          </span>

          <div className="space-y-1">

            <p className="text-sm font-semibold">

              Today's summary

            </p>

            <p className="text-sm text-muted-foreground text-pretty">

              {aiInsights.summary}

            </p>

          </div>

        </CardContent>

      </Card>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* LEFT CARDS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">

          {insightCards.map(
            (
              insight,
              i
            ) => {

              const meta =
                kindMeta[
                  insight.kind as keyof typeof kindMeta
                ]

              const Icon =
                meta.icon

              return (

                <Card
                  key={i}
                  className="gap-3"
                >

                  <CardHeader className="gap-0">

                    <div className="flex items-center justify-between">

                      <span
                        className={cn(
                          'flex size-9 items-center justify-center rounded-lg ring-1 ring-inset',
                          meta.tone,
                        )}
                      >

                        <Icon className="size-[18px]" />

                      </span>

                      <Badge variant="outline">

                        {meta.label}

                      </Badge>

                    </div>

                    <CardTitle className="mt-3 text-base leading-snug text-balance">

                      {insight.title}

                    </CardTitle>

                  </CardHeader>

                  <CardContent>

                    <p className="text-sm text-muted-foreground text-pretty">

                      {insight.body}

                    </p>

                  </CardContent>

                </Card>

              )

            }
          )}

        </div>

        {/* RIGHT SIDE */}

        <Card className="h-fit">

          <CardHeader>

            <CardTitle>

              Live Behavior Stats

            </CardTitle>

            <CardDescription>

              Real-time behavioral overview from tracked activities.

            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4">

            <div className="rounded-xl border bg-muted/30 p-4">

              <p className="text-xs text-muted-foreground">

                Total Activities

              </p>

              <p className="mt-1 text-2xl font-semibold">

                {activities.length}

              </p>

            </div>

            <div className="rounded-xl border bg-muted/30 p-4">

              <p className="text-xs text-muted-foreground">

                Productive Sessions

              </p>

              <p className="mt-1 text-2xl font-semibold">

                {
                  activities.filter(
                    (a) =>
                      a.category?.toLowerCase() ===
                      'productive'
                  ).length
                }

              </p>

            </div>

            <div className="rounded-xl border bg-muted/30 p-4">

              <p className="text-xs text-muted-foreground">

                Distracting Sessions

              </p>

              <p className="mt-1 text-2xl font-semibold">

                {
                  activities.filter(
                    (a) =>
                      a.category?.toLowerCase() ===
                      'distracting'
                  ).length
                }

              </p>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  )

}