import activeWin from 'active-win'

let lastApp = null

let startTime = Date.now()

function categorizeApp(appName) {

  const productiveApps = [
    'Code',
    'ChatGPT',
    'Cursor',
    'Terminal',
    'Google Chrome',
    'Chrome',
    'localhost',
  ]

  const distractingApps = [
    'Spotify',
    'Discord',
    'YouTube',
  ]

  const lowerName =
    appName
      ?.toLowerCase() || ''

  if (

    productiveApps.some(
      (app) =>

        lowerName.includes(
          app.toLowerCase()
        )
    )

  ) {

    return 'Productive'

  }

  if (

    distractingApps.some(
      (app) =>

        lowerName.includes(
          app.toLowerCase()
        )
    )

  ) {

    return 'Distracting'

  }

  return 'Neutral'

}

async function saveActivity(current) {

  try {

    const now = Date.now()

    const durationInSeconds =
      Math.floor(
        (now - startTime) / 1000
      )

    if (
      durationInSeconds <= 1
    ) {
      return
    }

    const appName =
      current.owner?.name ||
      'Unknown'
      if (

  appName ===
  'Google Chrome'

) {
  return
}

    const category =
      categorizeApp(appName)

    const activity = {

      title:
        current.title ||
        appName,

      app: appName,

      category,

      durationInSeconds,

      durationMin:
        Math.max(
          1,
          Math.floor(
            durationInSeconds / 60
          )
        ),

      domain: appName,

      favicon:
        'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',

      startTime:
        new Date(
          startTime
        ).toLocaleTimeString(),

      endTime:
        new Date(
          now
        ).toLocaleTimeString(),

      date:
        new Date()
          .toISOString(),

    }

    console.log(activity)

    const response =
      await fetch(
        'http://localhost:3000/api/save-desktop-activities',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            activity
          ),
        }
      )

    const data =
      await response.json()

    console.log(
      'API RESPONSE:',
      data
    )

  } catch (error) {

    console.log(error)

  }

}

async function trackApps() {

  try {

    const current =
      await activeWin()

    if (!current) {
      return
    }

    const appName =
      current.owner?.name ||
      'Unknown'

    if (!lastApp) {

      lastApp = current

      startTime = Date.now()

      return

    }

    if (

      lastApp.owner?.name !==
      appName

    ) {

      await saveActivity(
        lastApp
      )

      lastApp = current

      startTime = Date.now()

    }

  } catch (error) {

    console.log(error)

  }

}

setInterval(
  trackApps,
  2000
)