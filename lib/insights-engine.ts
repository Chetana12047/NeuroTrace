export function generateInsights(
  activities: any[]
) {

  if (!activities || activities.length === 0) {

    return {

      summary:
        'No activity data available yet.',

      peakHour:
        'No peak hours detected.',

      distraction:
        'No distractions detected.',

      deepWork:
        'No deep work sessions yet.',

      recommendation:
        'Start a focused work session to generate insights.',

    }

  }

  // PRODUCTIVE ONLY

  const productive =
    activities.filter(
      (a) =>
        a.category?.toLowerCase() ===
        'productive'
    )

  // DISTRACTING ONLY

  const distracting =
    activities.filter(
      (a) =>
        a.category?.toLowerCase() ===
        'distracting'
    )

  // TOTAL PRODUCTIVE TIME

  const totalProductiveSeconds =
    productive.reduce(
      (acc, item) =>
        acc +
        Number(
          item.durationInSeconds || 0
        ),
      0
    )

  // DEEP WORK SESSIONS

  const deepSessions =
    productive.filter(
      (item) =>
        Number(
          item.durationInSeconds
        ) >= 1200
    )

  // PEAK HOURS

  const hourMap:
    Record<string, number> = {}

  productive.forEach((item) => {

    if (!item.date) return

    const hour =
      new Date(
        item.date
      ).getHours()

    hourMap[hour] =
      (hourMap[hour] || 0) +
      Number(
        item.durationInSeconds || 0
      )

  })

  let peakHour = 'Unknown'

  let peakValue = 0

  Object.entries(hourMap)
    .forEach(([hour, value]) => {

      if (value > peakValue) {

        peakValue = value

        peakHour = `${hour}:00`

      }

    })

  // DISTRACTION COUNT

  const distractionCount =
    distracting.length

  // SUMMARY

  const productiveHours =
    (
      totalProductiveSeconds / 3600
    ).toFixed(1)

  const summary =
    `You completed ${productiveHours} productive hours today with ${deepSessions.length} deep work sessions.`

  // PEAK MESSAGE

  const peakHourMessage =
    `Your strongest focus period was around ${peakHour}.`

  // DISTRACTION MESSAGE

  const distractionMessage =
    distractionCount > 0

      ? `Detected ${distractionCount} distracting sessions affecting focus rhythm.`

      : 'Minimal distractions detected today.'

  // DEEP WORK MESSAGE

  const deepWorkMessage =
    deepSessions.length > 0

      ? `You completed ${deepSessions.length} uninterrupted deep work sessions.`

      : 'No deep work sessions detected yet.'

  // RECOMMENDATION

  const recommendation =
    distractionCount > 10

      ? 'Reduce frequent tab switching and social media visits during focus blocks.'

      : 'Your focus consistency looks stable today.'

  return {

    summary,

    peakHour:
      peakHourMessage,

    distraction:
      distractionMessage,

    deepWork:
      deepWorkMessage,

    recommendation,

  }

}