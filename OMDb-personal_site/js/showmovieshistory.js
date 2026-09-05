const HISTORY_SUPABASE_URL = "https://zxyhpeaabioaebbiudhq.supabase.co";
const HISTORY_SUPABASE_ANON_KEY = "sb_publishable_9fB9ratG6x-mW15fe4XB2g_eiYfPu7h";

async function loadWatchedMovies() {
  const tbody = document.querySelector("#moviesHistoryTable tbody");
  tbody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

  try {
    const res = await fetch(
      `${HISTORY_SUPABASE_URL}/rest/v1/movies-watched?select=poster,title,year,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: HISTORY_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${HISTORY_SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to load history (${res.status})`);
    }

    const movies = await res.json();

    if (!movies.length) {
      tbody.innerHTML = "<tr><td colspan='3'>No watch history yet.</td></tr>";
      return;
    }

    tbody.innerHTML = movies.map(movie => {
      const watchedDate = new Date(movie.created_at).toLocaleString();

      return `
        <tr>
          <td>
            <img class="history-poster"
                 src="${movie.poster || ""}"
                 alt="${movie.title}">
          </td>
          <td class="history-title">
            ${movie.title} (${movie.year})
          </td>
          <td class="history-date">
            ${watchedDate}
          </td>
        </tr>
      `;
    }).join("");
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="history-error">
          Error loading watch history: ${error.message}
        </td>
      </tr>
    `;
  }
}

loadWatchedMovies();