let activeTab = null

let activeTabId = null

let startTime = null

async function savePreviousTab() {

  if (
    !activeTab ||
    !startTime
  ) {
    return
  }

  const endTime =
    Date.now()

  const durationInSeconds =
    Math.floor(
      (
        endTime -
        startTime
      ) / 1000
    )

  if (
    durationInSeconds <= 1 ||
    activeTab.title ===
      'New Tab' ||
    activeTab.url?.includes(
      'newtab'
    )
  ) {
    return
  }

  const now =
    new Date()

  const activity = {

    title:
      activeTab.title,

    url:
      activeTab.url,

    favicon:
      activeTab.favicon,

    startTime:
      new Date(
        startTime
      ).toLocaleTimeString(),

    endTime:
      new Date(
        endTime
      ).toLocaleTimeString(),

    date:
      now.toISOString(),

    weekday:
      now.toLocaleDateString(
        'en-US',
        {
          weekday: 'short',
        }
      ),

    durationInSeconds,

    durationMin:
      Math.max(
        1,
        Math.floor(
          durationInSeconds / 60
        )
      ),

    domain:
      getDomain(
        activeTab.url
      ),

    category:
      categorizeWebsite(
        activeTab.url
      ),

  }

  const result =
    await chrome.storage.local.get(
      ['activities']
    )

  const activities =
    result.activities || []

  activities.push(
    activity
  )

  await chrome.storage.local.set({
    activities,
  })

  fetch(
    'http://localhost:3000/api/save-activities',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body:
        JSON.stringify(
          activities
        ),
    }
  ).catch((err) =>
    console.log(err)
  )

  console.log(
    'Saved:',
    activity
  )

}

function getDomain(url) {

  try {

    return new URL(url)
      .hostname

  } catch {

    return 'Unknown'

  }

}

function categorizeWebsite(url) {

  const hostname =
    new URL(url)
      .hostname
      .toLowerCase()

  const productiveSites = [
    'github.com',
    'leetcode.com',
    'chatgpt.com',
    'linkedin.com',
    'stackoverflow.com',
    'geeksforgeeks.org',
    'medium.com',
    'notion.so',
    'docs.google.com',
    'coursera.org',
    'udemy.com',
    'edx.org',
    'localhost',
    'docs.google.com',
    'drive.google.com',
    'classroom.google.com',
    'slides.google.com',
    'gemini.google.com',
    'perplexity.ai',
  ]

  const distractingSites = [
    'instagram.com',
    'facebook.com',
    'twitter.com',
    'x.com',
    'snapchat.com',
    'reddit.com',
  ]

  if (
    productiveSites.some(
      (site) =>
        hostname.includes(site)
    )
  ) {
    return 'Productive'
  }

  if (
    distractingSites.some(
      (site) =>
        hostname.includes(site)
    )
  ) {
    return 'Distracting'
  }

  return 'Neutral'

}

async function startNewSession(tab) {

  activeTabId =
    tab.id

  activeTab = {

    title:
      tab.title,

    url:
      tab.url,

    favicon:
      tab.favIconUrl,

  }

  startTime =
    Date.now()

}

// TAB SWITCH
chrome.tabs.onActivated.addListener(
  async (activeInfo) => {

    try {

      const tab =
        await chrome.tabs.get(
          activeInfo.tabId
        )

      if (
        !tab.url ||
        tab.url.startsWith(
          'chrome://'
        ) ||
        tab.url.startsWith(
          'chrome-extension://'
        ) ||
        tab.url.includes(
          'newtab'
        )
      ) {
        return
      }

      // FIRST SESSION
      if (!activeTab) {

        await startNewSession(
          tab
        )

        return

      }

      // SAME TAB
      if (
        activeTabId ===
        tab.id
      ) {
        return
      }

      // SAVE OLD
      await savePreviousTab()

      // START NEW
      await startNewSession(
        tab
      )

    } catch (error) {

      console.log(error)

    }

  }
)

// URL CHANGE
chrome.tabs.onUpdated.addListener(
  async (
    tabId,
    changeInfo,
    tab
  ) => {

    try {

      if (
        !tab.active ||
        changeInfo.status !==
          'complete'
      ) {
        return
      }

      if (
        !tab.url ||
        tab.url.startsWith(
          'chrome://'
        ) ||
        tab.url.startsWith(
          'chrome-extension://'
        ) ||
        tab.url.includes(
          'newtab'
        )
      ) {
        return
      }

      // FIRST SESSION
      if (!activeTab) {

        await startNewSession(
          tab
        )

        return

      }

      // SAME URL
      if (
        activeTab.url ===
        tab.url
      ) {

        activeTab.title =
          tab.title

        activeTab.favicon =
          tab.favIconUrl

        return

      }

      // URL CHANGED
      await savePreviousTab()

      await startNewSession(
        tab
      )

    } catch (error) {

      console.log(error)

    }

  }
)

// LIVE TAB UPDATE
setInterval(async () => {

  try {

    const tabs =
      await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

    const tab = tabs[0]

    if (
      !tab ||
      !tab.url
    ) {
      return
    }

    if (
      activeTab &&
      activeTab.url ===
        tab.url
    ) {

      activeTab.title =
        tab.title

      activeTab.favicon =
        tab.favIconUrl

    }

  } catch (error) {

    console.log(error)

  }

}, 1000)
chrome.runtime.onMessage.addListener(
  async (
    message
  ) => {

    if (
      message.type !==
      'URL_CHANGED'
    ) {
      return
    }

    try {

      const tabs =
        await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })

      const tab =
        tabs[0]

      if (
        !tab
      ) {
        return
      }

      // FIRST SESSION
      if (!activeTab) {

        await startNewSession({
          id:
            tab.id,

          title:
            message.title,

          url:
            message.url,

          favIconUrl:
            tab.favIconUrl,
        })

        return

      }

      // SAME URL
      if (
        activeTab.url ===
        message.url
      ) {
        return
      }

      // SAVE OLD
      await savePreviousTab()

      // START NEW
      await startNewSession({

        id:
          tab.id,

        title:
          message.title,

        url:
          message.url,

        favIconUrl:
          tab.favIconUrl,

      })

    } catch (error) {

      console.log(error)

    }

  }
)