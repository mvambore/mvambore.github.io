const UPDATE_SUPABASE_URL = "https://zxyhpeaabioaebbiudhq.supabase.co";
const UPDATE_SUPABASE_ANON_KEY = "sb_publishable_9fB9ratG6x-mW15fe4XB2g_eiYfPu7h";

async function insertInto(tableName, payload) {
  const res = await fetch(`${UPDATE_SUPABASE_URL}/rest/v1/${tableName}`, {
    method: "POST",
    headers: {
      "apikey": UPDATE_SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${UPDATE_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed (${res.status}) inserting into ${tableName}`);
  }
}

// Wire up button clicks whenever getmoviedetails.js renders a new movie card
document.addEventListener("movieDetailRendered", function(event) {
  const payload = event.detail;
  const watchedButton = document.getElementById("watchedBtn");

  if (!payload || !watchedButton || !saveButton) return;

  watchedButton.addEventListener("click", async function() {
    try {
      watchedButton.disabled = true;
      await insertInto("movies-watched", payload);
      document.getElementById("movieModal").classList.remove("active");
      if (typeof loadWatchedMovies === "function") loadWatchedMovies();
    } catch (err) {
      alert("Error: " + err.message);
      watchedButton.disabled = false;
    }
  });

  saveButton.addEventListener("click", async function() {
    try {
      saveButton.disabled = true;
      await insertInto("movies-recommended", payload);
      await insertInto("movies-watched", payload);
      document.getElementById("movieModal").classList.remove("active");
      if (typeof loadRecommendedMovies === "function") loadRecommendedMovies();
      if (typeof loadWatchedMovies === "function") loadWatchedMovies();
    } catch (err) {
      alert("Error: " + err.message);
      saveButton.disabled = false;
    }
  });
});