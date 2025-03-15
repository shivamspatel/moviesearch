// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the search term from the URL
const searchTerm = getQueryParam("query");

// Update the search result text if there's a search term
if (searchTerm) {
    const searchResultElement = document.getElementById("searchResult");
    searchResultElement.textContent = `"${searchTerm}"`;
    searchResultElement.style.display = "inline-block"; 
    
    // Set the value of both search inputs to the search term
    document.querySelectorAll('.nav__input, .movie__input').forEach(input => {
        input.value = searchTerm;
    });
}

// Function to expand the search bar when icon is clicked
function searchActive() {
    const searchInput = document.querySelector('.nav__input');
    searchInput.style.width = '200px';
    searchInput.style.cursor = 'text';
    searchInput.focus();
}

// Close the search bar when clicking outside of it
document.addEventListener('click', function(event) {
    const searchWrapper = document.querySelector('.nav__input--wrapper');
    const searchIcon = document.querySelector('.nav__search');
    
    // If clicked element is not the search wrapper or search icon
    if (!searchWrapper.contains(event.target) && event.target !== searchIcon) {
        // Collapse the search bar
        const searchInput = document.querySelector('.nav__input');
        searchInput.style.width = '0px';
        searchInput.style.backgroundColor = 'transparent';
        searchInput.style.cursor = 'default';
    }
});

// Add click event listener to search icon
const searchIcon = document.querySelector('.nav__search');
if (searchIcon) {
    searchIcon.addEventListener('click', function(event) {
        // Prevent form submission on icon click
        event.preventDefault();
        searchActive();
    });
}

// Function to fetch movies from OMDb API
async function fetchMovies(searchTerm) {
    if (!searchTerm) return;

    // Clear current movies except for loading spinner
    const moviesList = document.querySelector('.movies__list');
    const loadingSpinner = document.querySelector('.movies__list--loading');
    moviesList.innerHTML = ''; // Clear the movie list
    if (loadingSpinner) {
        moviesList.appendChild(loadingSpinner); // Add the loading spinner back
        loadingSpinner.style.display = 'block'; // Show loading spinner
    }

    try {
        // Fetch data from OMDb API directly without variables
        const response = await fetch(`https://www.omdbapi.com/?apikey=38d9770d&s=${encodeURIComponent(searchTerm)}&type=movie`);
        const data = await response.json();

        // Update UI with search results
        updateMovieResults(data);
    } catch (error) {
        console.error('Error fetching movie data:', error);
    } finally {
        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
}

// Function to update movie list with API results
function updateMovieResults(data) {
  const moviesList = document.querySelector('.movies__list');
  
  // Clear current movies except for loading spinner
  const loadingSpinner = document.querySelector('.movies__list--loading');
  const spinnerDisplay = loadingSpinner ? loadingSpinner.style.display : 'none';
  moviesList.innerHTML = '';


  
  
  // Check if we have results and create movie elements
  if (data.Response === "True") {
    
    const movies = data.Search.slice(0, 6);
    
    // Create movie elements
    movies.forEach(movie => {
      const movieElement = createMovieElement(movie);
      moviesList.appendChild(movieElement);
    });
  }
}

// Function to create a movie element
function createMovieElement(movie) {
  // Create movie container
  const movieDiv = document.createElement('div');
  movieDiv.className = 'movie';
  
  // Create movie HTML
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


// Fetch movies based on search term
fetchMovies(searchTerm);