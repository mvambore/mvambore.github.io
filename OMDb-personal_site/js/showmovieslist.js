const SUPABASE_URL = "https://zxyhpeaabioaebbiudhq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9fB9ratG6x-mW15fe4XB2g_eiYfPu7h";

async function loadRecommendedMovies() {
  const tbody = document.querySelector("#moviesTable tbody");
  tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/movies-recommended?select=*&order=id.desc`,
      {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    const movies = await res.json();

    if (!movies.length) {
      tbody.innerHTML = "<tr><td colspan='4'>No recommendations yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";

    const PER_ROW = 4;
    for (let i = 0; i < movies.length; i += PER_ROW) {
      const rowMovies = movies.slice(i, i + PER_ROW);
      const row = document.createElement("tr");

      row.innerHTML = rowMovies.map(m => `
        <td>
          <div class="movie-card">
            <img class="movie-poster" src="${m.poster}" alt="${m.title}">
            <div class="movie-title">${m.title} (${m.year})</div>
            <div class="movie-info"><b>Genre:</b> ${m.genre}</div>
            <div class="movie-info movie-plot">${m.plot}</div>
            <div class="movie-info">
              IMDb: ${m.imdb_rating} &nbsp;|&nbsp; RT: ${m.rotten_tomatoes || "N/A"}
            </div>
          </div>
        </td>
      `).join("");

      // Pad the row with empty cells if fewer than 4 movies remain
      const missing = PER_ROW - rowMovies.length;
      for (let j = 0; j < missing; j++) {
        row.innerHTML += "<td></td>";
      }

      tbody.appendChild(row);
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan='4' style="color:red;">Error loading: ${err}</td></tr>`;
  }
}

loadRecommendedMovies();