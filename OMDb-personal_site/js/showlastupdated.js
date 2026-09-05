const LAST_UPDATED_URL = "https://zxyhpeaabioaebbiudhq.supabase.co";
const LAST_UPDATED_KEY = "sb_publishable_9fB9ratG6x-mW15fe4XB2g_eiYfPu7h";

async function updateLastUpdated() {
  const timestampElement = document.getElementById("lastUpdated");
  if (!timestampElement) return;

  const tableName = window.location.pathname.endsWith("watch_history.html")
    ? "movies-watched"
    : "movies-recommended";

  try {
    const response = await fetch(
      `${LAST_UPDATED_URL}/rest/v1/${tableName}?select=created_at&order=created_at.desc&limit=1`,
      {
        headers: {
          apikey: LAST_UPDATED_KEY,
          Authorization: `Bearer ${LAST_UPDATED_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to load timestamp (${response.status})`);
    }

    const rows = await response.json();
    timestampElement.textContent = rows.length
      ? `Last updated ${new Date(rows[0].created_at).toLocaleString()}`
      : "Last updated: No movies yet";
  } catch (error) {
    timestampElement.textContent = "Last updated: unavailable";
    console.error(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateLastUpdated);
} else {
  updateLastUpdated();
}
