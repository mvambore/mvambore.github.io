fetch('movies.json')
    .then(response => response.json())
    .then(data => {
    const tbody = document.querySelector('#moviesTable tbody');
    let row;

    data.forEach((movie, index) => {
    // Start a new row every 4 movies
    if (index % 3 === 0) {
        row = document.createElement('tr');
        tbody.appendChild(row);
    }

    const cell = document.createElement('td');
    const rtRating = movie.Ratings?.find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";

    cell.innerHTML = `
        <div class="movie">
            <img src="${movie.Poster}" alt="${movie.Title} poster" class="movie-poster">
            <center><div class="movie-title">${movie.Title} (${movie.Year})</div></center>
            <div class="movie-info">${movie.Genre}</div>
            <br><div class="movie-info">${movie.Plot}</div>
            <br><div class="movie-info">IMDB: ${movie.imdbRating} (${movie.imdbVotes})</div>
            <div class="movie-info">Rotten Tmt: ${rtRating}</div>
        </div>
        `;
        row.appendChild(cell);
        });
    })
    .catch(error => {
    console.error('Error loading movies:', error);
});