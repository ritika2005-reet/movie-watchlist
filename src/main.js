import "./style.css";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const movieGrid = document.getElementById("movieGrid");
const watchlistGrid = document.getElementById("watchlistGrid");
const statusMessage = document.getElementById("statusMessage");

const filterForm = document.getElementById("filterForm");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const ratingInput = document.getElementById("ratingInput");
const ratingValue = document.getElementById("ratingValue");
const sortSelect = document.getElementById("sortSelect");
const clearFilters = document.getElementById("clearFilters");

const watchlistButton = document.getElementById("watchlistButton");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


let movies = [
  {
    id: 1,
    title: "Inception",
    overview: "A skilled thief enters people's dreams to steal secrets.",
    poster_path: null,
    release_date: "2010-07-16",
    vote_average: 8.4,
    popularity: 90,
    genre_ids: [28, 878]
  },
  {
    id: 2,
    title: "Interstellar",
    overview: "A group of astronauts travels through space to find a new home.",
    poster_path: null,
    release_date: "2014-11-07",
    vote_average: 8.6,
    popularity: 88,
    genre_ids: [12, 18, 878]
  },
  {
    id: 3,
    title: "The Dark Knight",
    overview: "Batman faces a dangerous criminal who creates chaos in Gotham.",
    poster_path: null,
    release_date: "2008-07-18",
    vote_average: 8.5,
    popularity: 86,
    genre_ids: [28, 80, 18]
  },
  {
    id: 4,
    title: "Avatar",
    overview: "A marine becomes part of a new world on Pandora.",
    poster_path: null,
    release_date: "2009-12-18",
    vote_average: 7.9,
    popularity: 84,
    genre_ids: [28, 12, 878]
  }
];


const genreNames = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  53: "Thriller"
};


// Load movies from TMDB
async function loadMovies() {

  statusMessage.textContent = "Loading movies...";

  try {

    const response = await fetch(
      TMDB_BASE_URL + "/trending/movie/week",
      {
        headers: {
          Authorization: "Bearer " + TMDB_TOKEN,
          accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("TMDB request failed");
    }

    const data = await response.json();

    movies = data.results;

    statusMessage.textContent =
      movies.length + " movies found.";

    applyFilters();

  } catch (error) {

    console.log("TMDB error:", error);

    statusMessage.textContent =
      "TMDB movies could not be loaded. Showing sample movies.";

    applyFilters();
  }
}


// Create movie card
function createMovieCard(movie) {

  const card = document.createElement("article");

  card.className = "movie-card";

  let poster =
    "https://via.placeholder.com/500x750?text=No+Poster";

  if (movie.poster_path) {

    poster =
      "https://image.tmdb.org/t/p/w500" +
      movie.poster_path;
  }

  const genres = (movie.genre_ids || [])
    .map(function(id) {
      return genreNames[id];
    })
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  card.innerHTML =
    '<img class="movie-poster" src="' +
    poster +
    '" alt="' +
    movie.title +
    '">' +

    '<div class="movie-info">' +

    '<h3>' +
    movie.title +
    '</h3>' +

    '<p class="movie-meta">' +
    (movie.release_date || "Unknown date") +
    " • ⭐ " +
    Number(movie.vote_average || 0).toFixed(1) +
    '</p>' +

    '<p class="movie-genre">' +
    (genres || "Movie") +
    '</p>' +

    '<p class="movie-description">' +
    (movie.overview || "No description available.") +
    '</p>' +

    '<button class="watchlist-btn" data-id="' +
    movie.id +
    '" type="button">' +
    'Add to Watchlist' +
    '</button>' +

    '</div>';

  return card;
}


// Display movies
function displayMovies(movieList) {

  movieGrid.innerHTML = "";

  if (movieList.length === 0) {

    movieGrid.innerHTML =
      '<p class="empty-message">No movies found.</p>';

    return;
  }

  movieList.forEach(function(movie) {

    movieGrid.appendChild(
      createMovieCard(movie)
    );

  });

  addWatchlistEvents();
}


// Get selected genres
function getSelectedGenres() {

  return Array.from(genreSelect.selectedOptions)
    .map(function(option) {
      return Number(option.value);
    });
}


// Apply filters
function applyFilters() {

  const searchText =
    searchInput.value.trim().toLowerCase();

  const minimumRating =
    Number(ratingInput.value);

  const selectedGenres =
    getSelectedGenres();

  let filteredMovies =
    movies.filter(function(movie) {

      const title =
        (movie.title || "").toLowerCase();

      const matchesSearch =
        title.includes(searchText);

      const matchesRating =
        Number(movie.vote_average || 0) >= minimumRating;

      const movieGenres =
        movie.genre_ids || [];

      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some(function(genre) {
          return movieGenres.includes(genre);
        });

      return (
        matchesSearch &&
        matchesRating &&
        matchesGenre
      );
    });


  if (sortSelect.value === "rating") {

    filteredMovies.sort(function(a, b) {

      return (
        Number(b.vote_average || 0) -
        Number(a.vote_average || 0)
      );

    });

  } else if (sortSelect.value === "release_date") {

    filteredMovies.sort(function(a, b) {

      return new Date(b.release_date || 0) -
        new Date(a.release_date || 0);

    });

  } else {

    filteredMovies.sort(function(a, b) {

      return (
        Number(b.popularity || 0) -
        Number(a.popularity || 0)
      );

    });
  }


  displayMovies(filteredMovies);

  updateURL();
}


// Add watchlist events
function addWatchlistEvents() {

  const buttons =
    document.querySelectorAll(".watchlist-btn");

  buttons.forEach(function(button) {

    button.addEventListener("click", function() {

      const movieId =
        Number(button.dataset.id);

      addToWatchlist(movieId);

    });

  });
}


// Get watchlist
function getWatchlist() {

  return JSON.parse(
    localStorage.getItem("movieWatchlist") || "[]"
  );
}


// Add to watchlist
function addToWatchlist(movieId) {

  const watchlist =
    getWatchlist();

  if (!watchlist.includes(movieId)) {

    watchlist.push(movieId);

    localStorage.setItem(
      "movieWatchlist",
      JSON.stringify(watchlist)
    );

    showWatchlist();

    alert("Movie added to your watchlist!");

  } else {

    alert("Movie is already in your watchlist.");
  }
}


// Show watchlist
function showWatchlist() {

  watchlistGrid.innerHTML = "";

  const watchlist =
    getWatchlist();

  const savedMovies =
    movies.filter(function(movie) {

      return watchlist.includes(movie.id);

    });


  if (savedMovies.length === 0) {

    watchlistGrid.innerHTML =
      '<p class="empty-message">' +
      'Your watchlist is empty.' +
      '</p>';

    return;
  }


  savedMovies.forEach(function(movie) {

    const card =
      createMovieCard(movie);

    const button =
      card.querySelector(".watchlist-btn");

    button.textContent = "Remove";

    button.addEventListener(
      "click",
      function() {

        removeFromWatchlist(movie.id);

      }
    );

    watchlistGrid.appendChild(card);
  });
}


// Remove from watchlist
function removeFromWatchlist(movieId) {

  let watchlist =
    getWatchlist();

  watchlist =
    watchlist.filter(function(id) {

      return id !== movieId;

    });

  localStorage.setItem(
    "movieWatchlist",
    JSON.stringify(watchlist)
  );

  showWatchlist();
}


// Update URL
function updateURL() {

  const params =
    new URLSearchParams();

  const search =
    searchInput.value.trim();

  const genres =
    getSelectedGenres();

  const rating =
    ratingInput.value;

  const sort =
    sortSelect.value;


  if (search) {
    params.set("search", search);
  }

  if (genres.length > 0) {
    params.set("genres", genres.join(","));
  }

  if (rating !== "0") {
    params.set("rating", rating);
  }

  if (sort !== "popularity") {
    params.set("sort", sort);
  }


  const query =
    params.toString();

  const newURL =
    query
      ? window.location.pathname + "?" + query
      : window.location.pathname;

  window.history.replaceState(
    {},
    "",
    newURL
  );
}


// Restore filters from URL
function restoreFiltersFromURL() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const search =
    params.get("search");

  const genres =
    params.get("genres");

  const rating =
    params.get("rating");

  const sort =
    params.get("sort");


  if (search) {
    searchInput.value = search;
  }


  if (genres) {

    const selectedGenres =
      genres.split(",").map(Number);

    Array.from(
      genreSelect.options
    ).forEach(function(option) {

      option.selected =
        selectedGenres.includes(
          Number(option.value)
        );

    });
  }


  if (rating) {

    ratingInput.value =
      rating;

    ratingValue.textContent =
      rating;
  }


  if (sort) {
    sortSelect.value = sort;
  }
}


// Live search
searchInput.addEventListener(
  "input",
  function() {
    applyFilters();
  }
);


// Rating slider
ratingInput.addEventListener(
  "input",
  function() {

    ratingValue.textContent =
      ratingInput.value;

    applyFilters();
  }
);


// Filter form
filterForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    applyFilters();
  }
);


// Genre filter
genreSelect.addEventListener(
  "change",
  function() {

    applyFilters();
  }
);


// Sorting
sortSelect.addEventListener(
  "change",
  function() {

    applyFilters();
  }
);


// Clear filters
clearFilters.addEventListener(
  "click",
  function() {

    searchInput.value = "";

    Array.from(
      genreSelect.options
    ).forEach(function(option) {

      option.selected = false;

    });

    ratingInput.value = 0;

    ratingValue.textContent = "0";

    sortSelect.value = "popularity";

    window.history.replaceState(
      {},
      "",
      window.location.pathname
    );

    applyFilters();
  }
);


// Watchlist navigation
watchlistButton.addEventListener(
  "click",
  function() {

    document
      .getElementById("watchlist")
      .scrollIntoView({
        behavior: "smooth"
      });

    showWatchlist();
  }
);


// Login form
loginForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    loginMessage.textContent =
      "Login form submitted successfully.";

    loginMessage.classList.add(
      "success-message"
    );
  }
);


// Start website
restoreFiltersFromURL();

ratingValue.textContent =
  ratingInput.value;

showWatchlist();

loadMovies();