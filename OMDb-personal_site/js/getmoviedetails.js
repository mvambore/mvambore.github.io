document.getElementById("movies_title_form").addEventListener("submit", function(event) {
  event.preventDefault();

  const movie_title = document.getElementById("movie_title").value;
  const apiKey = "5e3c5d9e";
  const searchUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movie_title)}`;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "<p>Searching...</p>";

  fetch(searchUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Search failed (${response.status})`);
      return response.json();
    })
    .then(data => {
      if (data.Response === "True" && Array.isArray(data.Search)) {
        renderResultsList(data.Search);
      } else {
        resultDiv.innerHTML = `<p style="color:red;">${data.Error}</p>`;
      }
    })
    .catch(error => {
      resultDiv.innerHTML = `<p style="color:red;">Error: ${error}</p>`;
    });
});

function renderResultsList(movies) {
  const resultDiv = document.getElementById("result");

  const items = movies.map(m => `
    <div class="search-result" data-imdbid="${m.imdbID}" style="display:flex; gap:10px; margin-bottom:10px; cursor:pointer; padding:6px; border-radius:6px;">
      <img src="${m.Poster !== "N/A" ? m.Poster : ""}" width="60" alt="${m.Title}">
      <div>
        <b>${m.Title}</b> (${m.Year})<br>
        <small>${m.Type}</small>
      </div>
    </div>
  `).join("");

  resultDiv.innerHTML = `<div id="searchResults">${items || "<p>No movies found.</p>"}</div>`;

  document.querySelectorAll(".search-result").forEach(el => {
    el.addEventListener("click", () => {
      fetchMovieDetail(el.dataset.imdbid);
    });
  });
}

function fetchMovieDetail(imdbID) {
  const apiKey = "5e3c5d9e";
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;

  const modal = document.getElementById("movieModal");
  const modalContent = document.getElementById("modalContent");

  modalContent.innerHTML = "<p>Loading details...</p>";
  modal.classList.add("active");

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`Details request failed (${response.status})`);
      return response.json();
    })
    .then(data => {
      if (data.Response !== "True") {
        modalContent.innerHTML = `<p style="color:red;">${data.Error}</p>`;
        return;
      }

      const rtRating = Array.isArray(data.Ratings)
        ? data.Ratings.find(r => r.Source === "Rotten Tomatoes")
        : null;
      const poster = data.Poster !== "N/A" ? data.Poster : "";
      const payload = {
        imdb_id: data.imdbID,
        title: data.Title,
        year: data.Year,
        genre: data.Genre,
        plot: data.Plot,
        poster,
        imdb_rating: data.imdbRating,
        rotten_tomatoes: rtRating ? rtRating.Value : null
      };

      modalContent.innerHTML = `
    <div class="detail-card">
      <img class="detail-poster" src="${poster}" alt="Poster of ${data.Title}">
      <div class="detail-info">
        <h3>${data.Title} (${data.Year})</h3>
        <div class="detail-row"><b>Genre:</b> ${data.Genre}</div>
        <div class="detail-plot">${data.Plot}</div>
        <div class="detail-row">
          <img src="https://cdn.brandfetch.io/idsm3ekCSb/w/35/h/35/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1667571542186" alt="IMDb logo">
          ${data.imdbRating}
        </div>
        <div class="detail-row">
          <img src="https://cdn.brandfetch.io/idPcBBhPP1/w/35/h/35/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1757813313002" alt="RT logo">
          ${rtRating ? rtRating.Value : "N/A"}
        </div>
        <button id="watchedBtn">Watched</button>
        <button id="saveBtn">Recommend</button>
      </div>
    </div>
  `;

      document.dispatchEvent(new CustomEvent("movieDetailRendered", { detail: payload }));
    })
    .catch(error => {
      modalContent.innerHTML = `<p style="color:red;">Error: ${error}</p>`;
    });
}

// Modal close handlers
document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("movieModal").classList.remove("active");
});

document.getElementById("movieModal").addEventListener("click", (e) => {
  if (e.target.id === "movieModal") {
    e.target.classList.remove("active");
  }
});