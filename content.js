let lastUrl =
  location.href

setInterval(() => {

  const currentUrl =
    location.href

  if (
    currentUrl !==
    lastUrl
  ) {

    chrome.runtime.sendMessage({

      type:
        'URL_CHANGED',

      url:
        currentUrl,

      title:
        document.title,

    })

    lastUrl =
      currentUrl

  }

}, 1000)