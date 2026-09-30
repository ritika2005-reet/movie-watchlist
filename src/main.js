import "./style.css" ;

const TMDB_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const movies = [
  {
    id: 1,
    title: "Inception",
    genre: "Science Fiction",
    genreId: "878",
    rating: 8.8,
    year: 2010,
    emoji: "🌀",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre: "Action",
    genreId: "28",
    rating: 9.0,
    year: 2008,
    emoji: "🦇"
  },
  {
    id: 3,
    title: "Interstellar",
    genre: "Science Fiction",
    genreId: "878",
    rating: 8.7,
    year: 2014,
    emoji: "🚀"
  },
  {
    id: 4,
    title: "Avengers: Endgame",
    genre: "Action",
    genreId: "28",
    rating: 8.4,
    year: 2019,
    emoji: "⚡"
  },
  {
    id: 5,
    title: "The Conjuring",
    genre: "Horror",
    genreId: "27",
    rating: 7.5,
    year: 2013,
    emoji: "👻"
  },
  {
    id: 6,
    title: "Joker",
    genre: "Drama",
    genreId: "18",
    rating: 8.4,
    year: 2019,
    emoji: "🃏"
  },
  {
    id: 7,
    title: "Harry Potter",
    genre: "Fantasy",
    genreId: "14",
    rating: 7.6,
    year: 2001,
    emoji: "🪄"
  },
  {
    id: 8,
    title: "Titanic",
    genre: "Romance",
    genreId: "10749",
    rating: 7.9,
    year: 1997,
    emoji: "🚢"
  },
  {
    id: 9,
    title: "Spider-Man",
    genre: "Adventure",
    genreId: "12",
    rating: 8.0,
    year: 2002,
    emoji: "🕷️"
  },
  {
    id: 10,
    title: "Toy Story",
    genre: "Animation",
    genreId: "16",
    rating: 8.3,
    year: 1995,
    emoji: "🤠"
  },
  {
    id: 11,
    title: "The Hangover",
    genre: "Comedy",
    genreId: "35",
    rating: 7.7,
    year: 2009,
    emoji: "😂"
  },
  {
    id: 12,
    title: "Gone Girl",
    genre: "Mystery",
    genreId: "9648",
    rating: 8.1,
    year: 2014,
    emoji: "🔍"
  }
];

let watchlist = JSON.parse(localStorage.getItem("movieWatchlist")) || [];

const movieGrid = document.querySelector("#movieGrid");
const watchlistGrid = document.querySelector("#watchlistGrid");
const statusMessage = document.querySelector("#statusMessage");

const filterForm = document.querySelector("#filterForm");
const searchInput = document.querySelector("#searchInput");
const genreSelect = document.querySelector("#genreSelect");
const ratingInput = document.querySelector("#ratingInput");
const ratingValue = document.querySelector("#ratingValue");
const sortSelect = document.querySelector("#sortSelect");
const clearFilters = document.querySelector("#clearFilters");

const watchlistButton = document.querySelector("#watchlistButton");

const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");



// ------------------------------
// DISPLAY MOVIES
// ------------------------------


function displayMovies(movieList) {

  movieGrid.innerHTML = "";

  if (movieList.length === 0) {
    movieGrid.innerHTML = `
      <p class="empty-message">
        No movies found. Try different filters.
      </p>
    `;

    return;
  }

  movieList.forEach(movie => {

    const isAdded = watchlist.some(item => item.id === movie.id);

    const card = document.createElement("article");

    card.className = "movie-card";

    card.innerHTML = `
      <div class="movie-poster">
    <img src="${movie.poster}" alt="${movie.title} poster">
</div>

      <div class="movie-info">

        <h3>${movie.title}</h3>

        <p class="movie-meta">
          ${movie.year} • ${movie.genre}
        </p>

        <p class="movie-rating">
          ⭐ ${movie.rating}/10
        </p>

        <button
          class="primary-button watch-button"
          data-id="${movie.id}"
        >
          ${isAdded ? "✓ Added to Watchlist" : "+ Add to Watchlist"}
        </button>

      </div>
    `;

    movieGrid.appendChild(card);
  });

  document.querySelectorAll(".watch-button").forEach(button => {

    button.addEventListener("click", () => {

      const id = Number(button.dataset.id);

      toggleWatchlist(id);

    });

  });
}


// ------------------------------
// WATCHLIST
// ------------------------------

function toggleWatchlist(id) {

  const movie = movies.find(movie => movie.id === id);

  if (!movie) return;

  const alreadyAdded = watchlist.some(item => item.id === id);

  if (alreadyAdded) {

    watchlist = watchlist.filter(item => item.id !== id);

  } else {

    watchlist.push(movie);

  }

  localStorage.setItem(
    "movieWatchlist",
    JSON.stringify(watchlist)
  );

  displayMovies(movies);

  displayWatchlist();
}


// ------------------------------
// DISPLAY WATCHLIST
// ------------------------------

function displayWatchlist() {

  watchlistGrid.innerHTML = "";

  if (watchlist.length === 0) {

    watchlistGrid.innerHTML = `
      <p class="empty-message">
        Your watchlist is empty. Add movies you want to watch.
      </p>
    `;

    return;
  }

  watchlist.forEach(movie => {

    const card = document.createElement("article");

    card.className = "movie-card";

    card.innerHTML = `
      <div class="movie-poster">
  <img src="${movie.poster}" alt="${movie.title} poster">
</div>

      <div class="movie-info">

        <h3>${movie.title}</h3>

        <p class="movie-meta">
          ${movie.year} • ${movie.genre}
        </p>

        <p class="movie-rating">
          ⭐ ${movie.rating}/10
        </p>

        <button
          class="clear-button remove-button"
          data-id="${movie.id}"
        >
          Remove
        </button>

      </div>
    `;

    watchlistGrid.appendChild(card);

  });

  document.querySelectorAll(".remove-button").forEach(button => {

    button.addEventListener("click", () => {

      const id = Number(button.dataset.id);

      watchlist = watchlist.filter(
        movie => movie.id !== id
      );

      localStorage.setItem(
        "movieWatchlist",
        JSON.stringify(watchlist)
      );

      displayWatchlist();

      displayMovies(movies);

    });

  });
}


// ------------------------------
// FILTER MOVIES
// ------------------------------

function applyFilters(event) {

  if (event) {
    event.preventDefault();
  }

  const searchText =
    searchInput.value.trim().toLowerCase();

  const selectedGenres = Array.from(
  genreSelect.selectedOptions
).map(option => option.value);

  const minimumRating =
    Number(ratingInput.value);

  const sortBy =
    sortSelect.value;

  let filteredMovies = movies.filter(movie => {
    

    const matchesSearch =
      movie.title
        .toLowerCase()
        .includes(searchText);

    const matchesGenre =

  selectedGenres.length === 0 ||
  selectedGenres.includes(String(movie.genreId));

    const matchesRating =
      movie.rating >= minimumRating;
      

    return (
      matchesSearch &&
      matchesGenre &&
      matchesRating
    );

  });


  // SORTING

  if (sortBy === "popularity") {

    filteredMovies.sort(
      (a, b) => b.rating - a.rating
    );

  }

  else if (sortBy === "release_date") {

    filteredMovies.sort(
      (a, b) => b.year - a.year
    );

  }

  else if (sortBy === "rating") {

    filteredMovies.sort(
      (a, b) => b.rating - a.rating
    );

  }


  displayMovies(filteredMovies);

  statusMessage.textContent =
   `${filteredMovies.length} movie(s) found.`;
   const params = new URLSearchParams();

if (searchText) {
  params.set("search", searchText);
}

if (selectedGenres.length > 0) {
  params.set("genre", selectedGenres.join(","));
}

if (minimumRating > 0) {
  params.set("rating", minimumRating);
}

if (sortBy !== "popularity") {
  params.set("sort", sortBy);
}

window.history.replaceState(
  {},
  "",
  params.toString()
    ? "?" + params.toString()
    : window.location.pathname
);
}


// ------------------------------
// RATING SLIDER
// ------------------------------

ratingInput.addEventListener("input", () => {

  ratingValue.textContent =
    ratingInput.value;

});


// ------------------------------
// FILTER FORM
// ------------------------------

filterForm.addEventListener(
  "submit",
  applyFilters
);


// ------------------------------
// CLEAR FILTERS
// ------------------------------



clearFilters.addEventListener("click", () => {

  searchInput.value = "";

  genreSelect.value = "";

  ratingInput.value = "0";

  ratingValue.textContent = "0";

  sortSelect.value = "popularity";

  applyFilters();
});


// ------------------------------
// WATCHLIST BUTTON
// ------------------------------

watchlistButton.addEventListener("click", () => {

  document
    .querySelector("#watchlist")
    .scrollIntoView({
      behavior: "smooth"
    });

});


// ------------------------------
// LOGIN
// ------------------------------

loginForm.addEventListener("submit", event => {

  event.preventDefault();

  const username =
    document.querySelector("#username").value.trim();

  const password =
    document.querySelector("#password").value.trim();

  if (!username || !password) {

    loginMessage.textContent =
      "Please enter username and password.";

    return;

  }

  loginMessage.textContent =
   `Welcome, ${username}! Login successful.`;

});


// ------------------------------
// INITIAL LOAD
// ------------------------------

// RESTORE FILTERS FROM URL
const urlParams = new URLSearchParams(window.location.search);

searchInput.value = urlParams.get("search") || "";

genreSelect.value = urlParams.get("genre") || "";

ratingInput.value = urlParams.get("rating") || "0";
ratingValue.textContent = ratingInput.value;

sortSelect.value = urlParams.get("sort") || "popularity";

applyFilters();


displayWatchlist();

statusMessage.textContent = movies.length + " movies available.";

async function testTMDB() {
  try {
    const response = await fetch(
      TMDB_BASE_URL + "/trending/movie/day",
      {
        headers: {
          Authorization: "Bearer " + TMDB_TOKEN,
          accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("TMDB error: " + response.status);
    }

    const data = await response.json();

const trendingMovies = data.results.map(movie => ({
  id: movie.id,
  title: movie.title,
  genre: "Movie",
  genreId: movie.genre_ids[0] || "",
  rating: movie.vote_average,
  year: movie.release_date
    ? Number(movie.release_date.slice(0, 4))
    : 0,
  emoji: "🎬",
  poster: movie.poster_path
    ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
    : ""
}));

movies.splice(
  0,
  movies.length,
  ...trendingMovies
);

displayMovies(movies);

statusMessage.textContent =
 ` ${movies.length} trending movies loaded from TMDB.;`

console.log(
  "TMDB connection successful:",
  data.results
);

  } catch (error) {
    console.error(
      "TMDB connection failed:",
      error
    );
  }
}

const urlSearch = urlParams.get("search");
const urlGenre = urlParams.get("genre");
const urlRating = urlParams.get("rating");
const urlSort = urlParams.get("sort");

if (urlSearch) {
  searchInput.value = urlSearch;
}

if (urlGenre) {
  genreSelect.value = urlGenre;
}

if (urlRating) {
  ratingInput.value = urlRating;
  ratingValue.textContent = urlRating;
}

if (urlSort) {
  sortSelect.value = urlSort;
}

applyFilters();

testTMDB();