'use client'

import { useEffect, useState } from 'react'

import {
  Clock,
  MousePointerClick,
  Repeat,
} from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-header'
import { ActivityTimeline } from '@/components/timeline/activity-timeline'
import { Card } from '@/components/ui/card'

export default function TimelinePage() {

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

  const todayDate =
  new Date().toLocaleDateString()

const todayActivities =
  activities.filter((activity) => {

    if (!activity.startTime) {
      return false
    }

    const activityDate =
      new Date().toLocaleDateString()

    return activityDate === todayDate
  })

const firstActive =
  todayActivities.length > 0
    ? todayActivities[0].startTime
    : '--'

  const sitesVisited =
    new Set(
      activities.map(
        (a) => a.domain
      )
    ).size

  const tabSwitches =
    activities.length

  const quick = [
    {
      icon: Clock,
      label: 'First active',
      value: firstActive,
    },
    {
      icon: MousePointerClick,
      label: 'Sites visited',
      value: sitesVisited,
    },
    {
      icon: Repeat,
      label: 'Tab switches',
      value: tabSwitches,
    },
  ]

  return (

    <div className="mx-auto max-w-5xl">

      <PageHeader
        title="Activity Timeline"
        description="A chronological history of your browsing sessions with exact timestamps, active duration, and productivity category."
      />

      <div className="mb-6 grid grid-cols-3 gap-4">

        {quick.map((q) => (

          <Card
            key={q.label}
            className="gap-0 p-4 sm:p-5"
          >

            <div className="flex items-center gap-2 text-muted-foreground">

              <q.icon className="size-4" />

              <span className="text-xs font-medium">
                {q.label}
              </span>

            </div>

            <span className="mt-2 text-xl font-semibold tabular-nums">

              {q.value}

            </span>

          </Card>

        ))}

      </div>

      <ActivityTimeline />

    </div>
  )
}