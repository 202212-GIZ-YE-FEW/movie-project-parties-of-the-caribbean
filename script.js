'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  // fetch actors
  // const actors = await fetchActors();
  // renderActors(actors.results);
  // ////////////////////////////////
 

  renderMovies(movies.results);
  // 
  
  
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
    
  
};
// fetch related movies
const fetchRelatedMovies = async (actorId) => {
console.log('k')
  const url = constructUrl(`person/${actorId}/movie_credits`);
  const res = await fetch(url);
  return res.json();
};
// fetch actors 
const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  return res.json();
};
//  fetch single actor
const fetchActor = async (actorId) => {
  
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  return res.json();
};
// render single actor
const renderActor = (actor) => {

  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="actor-pic" src=${BACKDROP_BASE_URL + actor.profile_path }>
        </div>
        <div class="col-md-8">
            <h2  id="actor-name">${actor.name}</h2>
            <p id="actor-gender"><b>gender:</b> ${actor.gender}</p>
            <p id="actor-popularity"><b>popularity:</b> ${actor.popularity} </p>
            <p id="actor-birthday"><b>birthday:</b> ${actor.birthday} </p>
            <h3>biography :</h3>
            <p id="actor-biography ">${actor.biography}</p>
        </div>
        
            <h3>movies the actor participated in:</h3>
            <ul id="related" class="list-unstyled"></ul>
    </div>`
};
//  single page for actor
const actoreDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  
  renderActor(actorRes);
};
const relatedMovies = async (actor) => {
  const relatedRes = await fetchRelatedMovies(actor.id);

  renderRelatedMovies(relatedRes.cast);
};
// render related movies
const renderRelatedMovies = (relatedMovies) => {
  relatedMovies.map((relatedMovie) => {
    const relatedMovieDiv = document.createElement("div");
    relatedMovieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + relatedMovie.poster_path}" alt="${relatedMovie.title
      } poster">
        <h3>${relatedMovie.title}</h3>`;
   
    const related = document.querySelector('ul#related')
    console.log("k")
    related.appendChild(relatedMovieDiv)
  });
};

// render actors
const renderActors = (actors) => {
  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name
      } poster">
        <h3>${actor.name}</h3>`;
    actorDiv.addEventListener("click", () => {
      actoreDetails(actor);
      relatedMovies(actor);
    });
    CONTAINER.appendChild(actorDiv);
  });
};

document.addEventListener("DOMContentLoaded", autorun);
