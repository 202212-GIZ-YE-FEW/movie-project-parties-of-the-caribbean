'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const actorSection = document.querySelector(".actorSection");

const singleActor = document.createElement("div");

document.body.appendChild(singleActor);
// Don't touch this function please
// const autorun = async () => {
  // const movies = await fetchMovies();
  // fetch actors
  // const actors = await fetchActors();
  // renderActors(actors.results);
  // ////////////////////////////////


  // renderMovies(movies.results);
  // 


// };
const actorsFun = async () => {
  // const movies = await fetchMovies();
  // fetch actors
  const actors = await fetchActors();
  renderActors(actors.results);
}
const a = document.querySelector(".a");
a.addEventListener('click', actorsFun)
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
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
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
             <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path
    }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date
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
  if (actor.gender == 1) {
    actor.gender = "female"
  }
  else {
    actor.gender = "male"
  }
  CONTAINER.innerHTML = "";
  singleActor.innerHTML = `
  
  <div class="bg-description">
    <div class="container">
      <div class="row py-5">
        <div class="col-md-4">
             <img class="w-100 p-2" id="actor-pic" src=${BACKDROP_BASE_URL + actor.profile_path}>
        </div>
        <div class="col-md-8 text-light">
            <h2  class="text-light" id="actor-name">${actor.name}</h2>
            <p id="actor-gender"><b>gender:</b> ${actor.gender}</p>
            <p id="actor-popularity"><b>popularity:</b> ${actor.popularity} </p>
            <p id="actor-birthday"><b>birthday:</b>${actor.birthday} </p>
            <p id="deathday" class="py-2"></p>
            <h3>biography :</h3>
            <p id="actor-biography">${actor.biography}</p>
        </div>
        </div>
        </div>   
    </div>
    <div class="container">
     <h2 class="text-light">related movies:</h2>
            <div class="row" id="related">
            <div>
            </div>`
  document.querySelector(".bg-description").style.setProperty('--background-image', `url(${BACKDROP_BASE_URL + actor.profile_path})`);
  const actorbirthday = document.getElementById('actor-birthday');
  const deathday = document.getElementById('deathday');
  if (actor.deathday != null) {

    console.log(actor.deathday)
    deathday.innerHTML = `<b>deathday:</b>${actor.deathday} `
  }

  actorbirthday.append(deathday);

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
  if (relatedMovies.length == 0) {
    const relatedMovieDiv = document.createElement("div");
    relatedMovieDiv.innerHTML = `<div>there is not movies <i class="fa-solid fa-heart-crack"></i></div>`;
    const related = document.querySelector('#related')
    console.log("k")
    related.appendChild(relatedMovieDiv)
  }

  // relatedMovies.map((relatedMovie) => {
  for (let i = 0; i < 5; i++) {
    const relatedMovieDiv = document.createElement("div");
    relatedMovieDiv.classList.add('col-lg-4');
    relatedMovieDiv.classList.add('col-sm-12');
    relatedMovieDiv.classList.add('col-md-6');
    relatedMovieDiv.innerHTML = `<div class="card m-1 actorList">
        <img  class="card-img-top" src="${BACKDROP_BASE_URL + relatedMovies[i].poster_path}" alt="${relatedMovies[i].title
      } poster">
      
        <h3 class="title text-center text-light">${relatedMovies[i].title}</h3> 
         </div>`;

    const related = document.querySelector('#related')
    console.log("k")
    related.appendChild(relatedMovieDiv)
  };

};

// render actors
const renderActors = (actors) => {
  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.classList.add('col-lg-4');
    actorDiv.classList.add('col-sm-12');
    actorDiv.classList.add('col-md-6');
    // actorDiv.classList.add('card');
    // actorDiv.style.width ="width: 18rem"

    actorDiv.innerHTML = `<div class=" card m-1 actorList " >    
        <img class="card-img-top " src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name
      } poster">
        <h3  class="title text-center text-light">${actor.name}</h3></div>
       `;
    actorDiv.addEventListener("click", () => {
      actoreDetails(actor);
      relatedMovies(actor);
    });
    actorSection.appendChild(actorDiv);
  });
};

document.addEventListener("DOMContentLoaded", autorun);
