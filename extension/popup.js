const activityList =
  document.getElementById("activity-list");

chrome.storage.local.get(
  ["activities"],
  (result) => {

    const activities =
      result.activities || [];

    const recentActivities =
      activities.slice(-5).reverse();

    activityList.innerHTML = "";

    recentActivities.forEach((activity) => {

      const div =
        document.createElement("div");

      div.className = "activity";

      div.innerHTML = `
        <div class="top">

          <img
            src="${activity.favicon}"
            class="favicon"
          />

          <div>

            <div class="title">
              ${activity.title}
            </div>

            <div class="domain">
              ${activity.domain}
            </div>

          </div>

        </div>

        <div class="meta">

          <span>
            ${activity.startTime}
          </span>

          <span>
            ${activity.durationInSeconds}s
          </span>

        </div>

        <div class="category ${activity.category}">
          ${activity.category}
        </div>
      `;

      activityList.appendChild(div);
    });
  }
);
document
  .getElementById("open-dashboard")
  .addEventListener("click", () => {
    chrome.tabs.create({
      url: "http://localhost:3000"
    });
  });