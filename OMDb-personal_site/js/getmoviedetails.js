document.getElementById("movies_title_form").addEventListener("submit", function(event) {
  event.preventDefault(); // prevent normal form submission

  const movie_title = document.getElementById("movie_title").value;
  const apiKey = "5e3c5d9e";
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movie_title)}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const resultDiv = document.getElementById("result");
      const rtRating = data.Ratings.find(r => r.Source === "Rotten Tomatoes");
      if (data.Response === "True") {
        resultDiv.innerHTML = `
          <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td rowspan="6">
                <img src="${data.Poster}" alt="Poster of ${data.Title}" width="120">
              </td>
              <td><h3>${data.Title} (${data.Year})</h3></td>
            </tr>
            <tr><td><b>Genre:</b> ${data.Genre}</td></tr>
            <tr><td><b>Plot:</b> ${data.Plot}</td></tr>
            <tr><td><img src="https://cdn.brandfetch.io/idsm3ekCSb/w/35/h/35/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1667571542186" alt="IMDb logo"> ${data.imdbRating}</td></tr>
            <tr><td><img src="https://cdn.brandfetch.io/idPcBBhPP1/w/35/h/35/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1757813313002" alt="RT logo"> ${rtRating ? rtRating.Value : "N/A"}</td></tr>
          </table>
          <br><br>
          <button id="saveBtn">Recomend</button></td>
        `;

        // Add save functionality
        document.getElementById("saveBtn").addEventListener("click", function() {
          const content = `{
"Poster": "${data.Poster}",
"Title": "${data.Title} (${data.Year})",
"Genre": "${data.Genre}",
"Plot": "${data.Plot}",
"IMDb": "${data.imdbRating}",
"RT": "${rtRating ? rtRating.Value : "N/A"}"
}`;
          const blob = new Blob([content], { type: "text/json" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${data.Title.replace(/\s+/g, "_")}.json`;
          link.click();
        });
        
      } else {
        resultDiv.innerHTML = `<p style="color:red;">${data.Error}</p>`;
      }
    })
    .catch(error => {
      document.getElementById("result").innerHTML =
        `<p style="color:red;">Error: ${error}</p>`;
    });
});