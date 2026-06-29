export async function getChromeActivities() {
  try {
    const response = await fetch("/activities.json");

    const data = await response.json();

    return data.reverse();
  } catch (error) {
    return [];
  }
}