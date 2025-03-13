function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// search term from URL
const searchTerm = getQueryParam("query");

// update search result text
if (searchTerm) {
  const searchResultElement = document.getElementById("searchResult");
  searchResultElement.textContent = `"${searchTerm}"`;
  searchResultElement.style.display = "inline-block";

  // value of both search inputs to the search
  document.querySelectorAll(".nav__input, .movie__input").forEach((input) => {
    input.value = searchTerm;
  });
}

// expand the search bar when icon is clicked
function searchActive() {
  const searchInput = document.querySelector(".nav__input");
  searchInput.style.width = "200px";
  searchInput.style.cursor = "text";
  searchInput.focus();
}

// close the search bar
document.addEventListener("click", function (event) {
  const searchWrapper = document.querySelector(".nav__input--wrapper");
  const searchIcon = document.querySelector(".nav__search");

  if (!searchWrapper.contains(event.target) && event.target !== searchIcon) {
    // collapse the search bar
    const searchInput = document.querySelector(".nav__input");
    searchInput.style.width = "0px";
    searchInput.style.backgroundColor = "transparent";
    searchInput.style.cursor = "default";
  }
});

const searchIcon = document.querySelector(".nav__search");
if (searchIcon) {
  searchIcon.addEventListener("click", function (event) {
    event.preventDefault();
    searchActive();
  });
}

async function fetchMovies(searchTerm) {
  if (!searchTerm) return;

  // loading spinner
  const loadingSpinner = document.querySelector(".movies__list--loading");
  if (loadingSpinner) {
    loadingSpinner.style.display = "block";
  }

  try {
    // fetch data
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=38d9770d&s=${encodeURIComponent(
        searchTerm
      )}&type=movie`
    );
    const data = await response.json();

    // update search results
    updateMovieResults(data);
  } catch (error) {
    console.error("Error fetching movie data:", error);
  } finally {
    if (loadingSpinner) {
      loadingSpinner.style.display = "none";
    }
  }
}

function updateMovieResults(data) {
  const moviesList = document.querySelector(".movies__list");

  // clear current movies except for loading spinner
  const loadingSpinner = document.querySelector(".movies__list--loading");
  const spinnerDisplay = loadingSpinner ? loadingSpinner.style.display : "none";
  moviesList.innerHTML = "";

  // check for results and create movie elements
  if (data.Response === "True") {
    const movies = data.Search.slice(0, 6);

    movies.forEach((movie) => {
      const movieElement = createMovieElement(movie);
      moviesList.appendChild(movieElement);
    });
  }
}

// create a movie element
function createMovieElement(movie) {
  const movieDiv = document.createElement("div");
  movieDiv.className = "movie";

  // create movie HTML
  movieDiv.innerHTML = `
    <figure class="movie__img--wrapper">
      <img src="${movie.Poster}" alt="${movie.Title}" class="movie__img">
      <h3 class="movie__info--title">${movie.Title}</h3>
      <div class="movie__info--list">
    <div class="movie__info movie__info1">
        <i class="fa-solid fa-clock movie__info--icon" aria-hidden="true"></i>
        <p class="movie__info--text">136m</p>
    </div>
    <div class="movie__info movie__info2">
        <i class="fa-solid fa-star movie__info--icon" aria-hidden="true"></i>
        <p class="movie__info--text">4.5</p>
    </div>
    <div class="movie__info movie__info3">
         <i class="fa-solid fa-earth-americas movie__info--icon" aria-hidden="true"></i>
        <p class="movie__info--text">English</p>
    </div>
      </div>
    </figure>
    <h4 class="movie__title">${movie.Title}</h4>
  `;

  return movieDiv;
}

fetchMovies(searchTerm);
