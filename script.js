// JavaScript by Jairo Velasquez.
// Keep this storage key so saved movies and ratings carry over.

const STORAGE_KEY = "movieWatchlistV2";

const defaultMovies = [
  { id: 1, title: "Chainsaw Man - The Movie: Reze Arc",         genre: "Action", poster: "", watched: false, rating: 0 },
  { id: 2, title: "The Fast and the Furious: Tokyo Drift",         genre: "Action", poster: "", watched: false, rating: 0 },
  { id: 3, title: "The Batman",           genre: "Crime",  poster: "", watched: false, rating: 0 },
  { id: 4, title: "Pokemon Detective Pikachu",    genre: "Sci-Fi", poster: "", watched: false, rating: 0 },
  { id: 5, title: "Resident Evil (2026)", genre: "Horror", poster: "", watched: false, rating: 0 }
];

// Preview information for the five starter movies, keyed by movie ID.
const moviePreviews = {
  1: {
    year: 2025,
    runtime: "1h 40m",
    director: "Tatsuya Yoshihara",
    cast: "Kikunosuke Toya, Reina Ueda, Shiori Izawa",
    synopsis: "Devil hunter Denji meets Reze, a mysterious girl who offers him a glimpse of an ordinary life. Their connection pulls him deeper into a war between devils and hunters.",
    trailerId: "tAzAhDNdehs",
    reviews: "https://www.rottentomatoes.com/m/chainsaw_man_the_movie_reze_arc"
  },
  2: {
    year: 2006,
    runtime: "1h 50m",
    director: "Justin Lin",
    cast: "Lucas Black, Sung Kang, Bow Wow",
    synopsis: "After moving to Tokyo, American teenager Sean Boswell finds his way into the underground drift-racing scene. Learning to handle the city's tight turns puts him on a collision course with its reigning racer.",
    trailerId: "GEa2GtCNolU",
    reviews: "https://www.rottentomatoes.com/m/fast_and_the_furious_tokyo_drift"
  },
  3: {
    year: 2022,
    runtime: "2h 56m",
    director: "Matt Reeves",
    cast: "Robert Pattinson, Zoë Kravitz, Jeffrey Wright",
    synopsis: "A killer leaves a trail of riddles across Gotham. As Batman follows the clues, he uncovers a network of corruption that reaches into his own family's past.",
    trailerId: "mqqft2x_Aa4",
    reviews: "https://www.rottentomatoes.com/m/the_batman"
  },
  4: {
    year: 2019,
    runtime: "1h 44m",
    director: "Rob Letterman",
    cast: "Ryan Reynolds, Justice Smith, Kathryn Newton",
    synopsis: "Searching for his missing father in Ryme City, Tim Goodman teams up with a wisecracking Pikachu he can somehow understand. Their investigation uncovers a threat to humans and Pokémon alike.",
    trailerId: "1roy4o4tqQM",
    reviews: "https://www.rottentomatoes.com/m/pokemon_detective_pikachu"
  },
  5: {
    year: 2026,
    runtime: "1h 34m",
    director: "Zach Cregger",
    cast: "Austin Abrams, Zach Cherry, Kali Reis",
    synopsis: "A medical delivery sends courier Bryan into a night of escalating horror. As the city descends into chaos, finishing the job gives way to staying alive.",
    trailerId: "mNd1gb19A-c",
    reviews: "https://www.rottentomatoes.com/m/resident_evil_2026"
  }
};

let movies = loadMovies();
let currentFilter = "all";

function saveMovies() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

function loadMovies() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return defaultMovies;
}

const grid = document.getElementById("movie-grid");
// A URL with an id opens the detail view in this same HTML file.
const detailId = new URLSearchParams(window.location.search).get("id");

function render() {
  grid.innerHTML = "";

  const visible = movies.filter(function (movie) {
    if (currentFilter === "watched") {
      return movie.watched;
    }
    if (currentFilter === "to-watch") {
      return !movie.watched;
    }
    return true;
  });

  if (visible.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "No movies to show here yet.";
    grid.appendChild(message);
    return;
  }

  visible.forEach(function (movie) {
    grid.appendChild(buildCard(movie));
  });
}

function buildCard(movie) {
  const card = document.createElement("div");
  card.className = "card";

  const poster = document.createElement("div");
  poster.className = "poster";
  const preview = getMoviePreview(movie);
  if (movie.poster || preview) {
    const img = document.createElement("img");
    img.src = movie.poster || trailerArtwork(preview);
    img.alt = movie.poster ? "Poster for " + movie.title : "";
    img.addEventListener("error", function () {
      poster.textContent = movie.title;
    });
    poster.appendChild(img);
  } else {
    poster.textContent = movie.title;
  }
  card.appendChild(poster);

  const title = document.createElement("h2");
  const link = document.createElement("a");
  link.href = "index.html?id=" + encodeURIComponent(movie.id);
  link.textContent = movie.title;
  title.appendChild(link);
  card.appendChild(title);

  const genre = document.createElement("p");
  genre.textContent = movie.genre;
  card.appendChild(genre);

  card.appendChild(buildWatchControls(movie));
  return card;
}

// Use the same watched button and stars on both pages.
function buildWatchControls(movie) {
  if (movie.watched) {
    return buildStars(movie);
  }

  const button = document.createElement("button");
  button.textContent = "Mark as watched";
  button.addEventListener("click", function () {
    markWatched(movie.id);
  });
  return button;
}

function buildStars(movie) {
  const row = document.createElement("div");
  row.className = "stars";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    if (i <= movie.rating) {
      star.className = "filled";
    }
    star.addEventListener("click", function () {
      setRating(movie.id, i);
    });
    row.appendChild(star);
  }

  return row;
}

function findMovie(id) {
  return movies.find(function (movie) {
    return movie.id === id;
  });
}

function markWatched(id) {
  movies = loadMovies();
  findMovie(id).watched = true;
  saveMovies();
  renderPage();
}

function setRating(id, stars) {
  movies = loadMovies();
  findMovie(id).rating = stars;
  saveMovies();
  renderPage();
}

function addMovie(event) {
  event.preventDefault();

  const titleInput = document.getElementById("title-input");
  const genreInput = document.getElementById("genre-input");
  const title = titleInput.value.trim();

  if (title === "") {
    return;
  }

  movies = loadMovies();
  movies.push({
    id: Date.now(),
    title: title,
    genre: genreInput.value,
    poster: "",
    watched: false,
    rating: 0
  });

  titleInput.value = "";
  saveMovies();
  render();
}

if (detailId === null) {
  document.getElementById("status-filter").addEventListener("change", function (event) {
    currentFilter = event.target.value;
    render();
  });

  document.getElementById("add-form").addEventListener("submit", addMovie);
}

// Match the title too, since an older watchlist may use the same ID for another film.
function getMoviePreview(movie) {
  const starter = defaultMovies.find(function (entry) {
    return entry.id === movie.id && entry.title === movie.title;
  });
  return starter ? moviePreviews[starter.id] : undefined;
}

function trailerArtwork(preview) {
  return "https://i.ytimg.com/vi/" + preview.trailerId + "/hqdefault.jpg";
}

function renderPreview(movie, preview) {
  const hero = document.getElementById("detail-hero");
  const synopsis = document.getElementById("detail-synopsis");
  const credits = document.getElementById("detail-credits");
  const extras = document.getElementById("detail-extras");
  hero.hidden = !preview;
  synopsis.hidden = !preview;
  credits.hidden = !preview;
  extras.hidden = !preview;
  if (!preview) {
    return;
  }

  const art = document.getElementById("detail-art");
  art.onerror = function () { art.hidden = true; };
  if (!art.hasAttribute("src")) {
    art.src = trailerArtwork(preview);
  }
  synopsis.textContent = preview.synopsis;
  document.getElementById("detail-director").textContent = preview.director;
  document.getElementById("detail-cast").textContent = preview.cast;
  document.getElementById("detail-reviews").href = preview.reviews;
  document.getElementById("detail-trailer").href = "https://www.youtube.com/watch?v=" + preview.trailerId;

  const play = document.getElementById("play-trailer");
  play.onclick = function () {
    const player = document.getElementById("trailer-player");
    const frame = document.createElement("iframe");
    frame.title = movie.title + " trailer";
    frame.allow = "autoplay; encrypted-media; picture-in-picture";
    frame.allowFullscreen = true;
    frame.src = "https://www.youtube-nocookie.com/embed/" + preview.trailerId + "?autoplay=1";
    player.replaceChildren(frame);
    player.hidden = false;
    play.hidden = true;
    frame.focus();
  };
}

function renderDetail() {
  const movie = movies.find(function (entry) {
    return String(entry.id) === detailId;
  });
  const title = document.getElementById("detail-title");
  const genre = document.getElementById("detail-genre");
  const poster = document.getElementById("detail-poster");
  const controls = document.getElementById("detail-controls");

  if (!movie) {
    title.textContent = "Movie not found";
    genre.textContent = "Open a title from your watchlist to see its details.";
    poster.hidden = true;
    controls.replaceChildren();
    return;
  }

  document.title = movie.title + " | Cue The Credits";
  title.textContent = movie.title;
  const preview = getMoviePreview(movie);
  genre.textContent = preview ? [preview.year, movie.genre, preview.runtime].join(" · ") : movie.genre;
  if (movie.poster) {
    poster.src = movie.poster;
    poster.alt = "Poster for " + movie.title;
    poster.hidden = false;
  }
  renderPreview(movie, preview);
  controls.replaceChildren(buildWatchControls(movie));
}

function renderPage() {
  if (detailId !== null) {
    renderDetail();
  } else {
    render();
  }
}

document.getElementById("watchlist-view").hidden = detailId !== null;
document.getElementById("watchlist-header").hidden = detailId !== null;
document.getElementById("detail-view").hidden = detailId === null;
document.getElementById("detail-header").hidden = detailId === null;
renderPage();

// Refresh saved values when returning with the browser's Back button.
window.addEventListener("pageshow", function () {
  movies = loadMovies();
  renderPage();
});
