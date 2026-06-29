'use client'

import { useEffect, useMemo, useState } from 'react'

import { CategoryBadge } from '@/components/category-badge'
import { SiteIcon } from '@/components/site-icon'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import {
  type Category,
  getSite,
} from '@/lib/data'

import { cn } from '@/lib/utils'

type Filter = 'all' | Category

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All activity' },
  { value: 'productive', label: 'Productive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'distracting', label: 'Distracting' },
]
function formatDuration(
  totalSeconds
) {

  const hours =
    Math.floor(
      totalSeconds / 3600
    )

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    )

  const seconds =
    totalSeconds % 60

  if (hours > 0) {

    return `${hours}h ${minutes}m ${seconds}s`

  }

  if (minutes > 0) {

    return `${minutes}m ${seconds}s`

  }

  return `${seconds}s`

}

export function ActivityTimeline() {

  const [filter, setFilter] =
    useState<Filter>('all')

  const [activities, setActivities] =
    useState<any[]>([])

  useEffect(() => {

    async function loadActivities() {

      try {

        const response =
          await fetch('/activities.json')

        const data =
          await response.json()

        setActivities(data)

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

  const entries = useMemo(() => {

    return activities
      .map((activity) => {

        const domain =
          activity.domain
            ?.replace('www.', '') || ''

        const site =
          getSite(domain)

        return {
          ...activity,
          site,
          time:
            activity.startTime,
          duration:
  formatDuration(
    activity.durationInSeconds
  ),
          durationMin:
            Math.floor(
              activity.durationInSeconds / 60
            ),
        }
      })
      .filter((entry) => {

        if (filter === 'all') {
          return true
        }

        return (
          entry.site.category
            .toLowerCase() === filter
        )
      })
      .reverse()

  }, [activities, filter])

  return (
    <div className="space-y-5">

      <div className="flex flex-wrap items-center gap-2">

        {filters.map((f) => (

          <Button
            key={f.value}
            size="sm"
            variant={
              filter === f.value
                ? 'default'
                : 'outline'
            }
            onClick={() =>
              setFilter(f.value)
            }
          >
            {f.label}
          </Button>

        ))}

        <span className="ml-auto text-sm text-muted-foreground tabular-nums">
          {entries.length} sessions
        </span>

      </div>

      <Card className="p-5 sm:p-6">

        <ol className="relative">

          {entries.map((entry, i) => {

            const last =
              i === entries.length - 1

            return (

              <li
                key={`${entry.time}-${i}`}
                className="flex gap-4"
              >

                <div className="flex w-16 shrink-0 flex-col items-end pt-1">

                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {entry.time}
                  </span>

                </div>

                <div className="relative flex flex-col items-center">

                  {entry.favicon ? (

                <img
                src={entry.favicon}
                alt=""
                className="size-9 rounded-lg"
                />

                ) : (

                <div className="size-9 rounded-lg bg-muted" />

                )}

                  {!last && (
                    <span
                      className="mt-1 w-px flex-1 bg-border"
                    />
                  )}

                </div>

                <div
                  className={cn(
                    'flex-1',
                    last ? 'pb-0' : 'pb-6'
                  )}
                >

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                    <span className="font-medium">
                      {entry.app || entry.site.name}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {entry.domain}
                    </span>

                  </div>

                  <p className="mt-0.5 text-sm text-muted-foreground text-pretty">

                    {entry.title}

                  </p>

                  <div className="mt-2 flex items-center gap-2">

                    <CategoryBadge
                      category={
                        entry.category

                        ?.toLowerCase()
                      }
                    />

                    <span
                      className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground"
                    >

                      {entry.duration} active

                    </span>

                  </div>

                </div>

              </li>
            )
          })}

        </ol>

      </Card>

    </div>
  )
}