import activeWin from 'active-win'

export async function getActiveApp() {

  try {

    const result = await activeWin()

    if (!result) {
      return null
    }

    return {

      app:
        result.owner.name,

      title:
        result.title,

      url:
        result.url || '',

    }

  } catch (error) {

    console.log(error)

    return null

  }

}