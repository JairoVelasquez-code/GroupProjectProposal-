/*
  Movie Watchlist & Rating App - script.js

  KEY FEATURES (explained in the comments below):
    - Movies are stored in an array of objects and saved in localStorage
    - Each movie shows as a card in a grid
    - "Mark as watched" turns a card into a rating card with 5 clickable stars
    - A dropdown filters the cards by status (All / To Watch / Watched)
    - A form adds new movies

  GROUP MEMBERS: Jairo Velasquez, Chris Paskas, Joseph Moreno

  WHO DID WHAT: [Who?] - sections 1 and 2 (data + localStorage)
                [Who?] - sections 3 to 6 (cards, actions, filter, form)

  IMAGE SOURCES: none yet. When you add poster images, put them in an images/
  folder, set the "poster" field below, and credit each one here, like:
    images/inception.jpg - source: [website name and link]
*/


// ============================================================
// 1. DATA
// ============================================================

// The key name localStorage will use to store our list
const STORAGE_KEY = "movieWatchlist";

// Starting movies, used the first time the page loads.
// watched: true/false   rating: 0 means "not rated yet", otherwise 1 to 5
// poster: "" shows a colored box with the title. To use a real image, put
// the file in an images/ folder and set it, e.g. "images/casino.jpg"
const defaultMovies = [
  { id: 1, title: "Spider-Man 3",                  genre: "Action",    poster: "", watched: false, rating: 0 },
  { id: 2, title: "Once Upon a Time in Hollywood", genre: "Drama",     poster: "", watched: false, rating: 0 },
  { id: 3, title: "Casino",                        genre: "Crime",     poster: "", watched: false, rating: 0 },
  { id: 4, title: "Inception",                     genre: "Sci-Fi",    poster: "", watched: false, rating: 0 },
  { id: 5, title: "Coco",                          genre: "Animation", poster: "", watched: false, rating: 0 }
];

// The list the whole app works with, plus the current filter choice
let movies = loadMovies();
let currentFilter = "all";


// ============================================================
// 2. LOCALSTORAGE
// ============================================================

// localStorage only stores text, so we convert the array to text going in
// (JSON.stringify) and back to an array coming out (JSON.parse).
function saveMovies() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

function loadMovies() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);   // we've saved before, use that list
  }
  return defaultMovies;         // first visit, use the starting movies
}


// ============================================================
// 3. DRAWING THE CARDS
// ============================================================

const grid = document.getElementById("movie-grid");

// Clears the grid and rebuilds it from the movies array.
// We call this after every change so the screen always matches the data.
function render() {
  grid.innerHTML = "";

  // filter() keeps only the movies that match the dropdown choice
  const visible = movies.filter(function (movie) {
    if (currentFilter === "watched") {
      return movie.watched;
    }
    if (currentFilter === "to-watch") {
      return !movie.watched;
    }
    return true;   // "all"
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

// Builds the HTML for ONE movie card and returns it.
// We use textContent (not innerHTML) so a typed title can't inject HTML.
function buildCard(movie) {
  const card = document.createElement("div");
  card.className = "card";

  // Poster: a real image if the movie has one, otherwise the title in a box
  const poster = document.createElement("div");
  poster.className = "poster";
  if (movie.poster) {
    const img = document.createElement("img");
    img.src = movie.poster;
    img.alt = "Poster for " + movie.title;
    poster.appendChild(img);
  } else {
    poster.textContent = movie.title;
  }
  card.appendChild(poster);

  const title = document.createElement("h2");
  title.textContent = movie.title;
  card.appendChild(title);

  const genre = document.createElement("p");
  genre.textContent = movie.genre;
  card.appendChild(genre);

  // Not watched yet: show the button. Watched: show the stars instead.
  if (movie.watched) {
    card.appendChild(buildStars(movie));
  } else {
    const button = document.createElement("button");
    button.textContent = "Mark as watched";
    button.addEventListener("click", function () {
      markWatched(movie.id);
    });
    card.appendChild(button);
  }

  return card;
}

// Builds a row of 5 stars. Stars up to the movie's rating get the "filled"
// class (gold in the CSS). Clicking star number i sets the rating to i.
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


// ============================================================
// 4. ACTIONS (each one: change the data, save it, redraw)
// ============================================================

// Finds the movie object with a matching id
function findMovie(id) {
  return movies.find(function (movie) {
    return movie.id === id;
  });
}

function markWatched(id) {
  findMovie(id).watched = true;
  saveMovies();
  render();
}

function setRating(id, stars) {
  findMovie(id).rating = stars;
  saveMovies();
  render();
}

function addMovie(event) {
  event.preventDefault();   // stops the form from reloading the page

  const titleInput = document.getElementById("title-input");
  const genreInput = document.getElementById("genre-input");
  const title = titleInput.value.trim();

  if (title === "") {
    return;
  }

  movies.push({
    id: Date.now(),   // the current time in milliseconds works as a unique id
    title: title,
    genre: genreInput.value,
    poster: "",
    watched: false,
    rating: 0
  });

  titleInput.value = "";   // empty the box for the next movie
  saveMovies();
  render();
}


// ============================================================
// 5. FILTER
// ============================================================

// When the dropdown changes, remember the choice and redraw
document.getElementById("status-filter").addEventListener("change", function (event) {
  currentFilter = event.target.value;
  render();
});


// ============================================================
// 6. FORM + START
// ============================================================

document.getElementById("add-form").addEventListener("submit", addMovie);

// Draw the cards for the first time
render();