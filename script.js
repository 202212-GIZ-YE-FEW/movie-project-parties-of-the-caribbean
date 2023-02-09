'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
// 
const MoviesList = document.querySelector("header nav #movies-list");
const TVList = document.querySelector("header nav #TV-list");
const HomePageMovies=document.getElementById("Hp-movies");
const search=document.getElementById("search");
const searchRes=document.getElementById("searchRes");
const CONTAINER = document.querySelector(".container");

let checkHome=true;

//auto run function
const autorun = async () => {
  renderHome();
  const mList = await fetchList(`genre/movie/list`);
  const tvList = await fetchList(`genre/tv/list`);
  renderList(mList.genres,MoviesList);
  renderList(tvList.genres,TVList);
};

const renderHome = async () => {
  noHomePage(false);
  updateHomeMovies(`movie/now_playing`,HomePageMovies);
};


// Don't touch this function please
const constructUrl = (path,query="") => {
  if(query ===""){
      return `${TMDB_BASE_URL}/${path}?api_key=${atob(
      "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
      )}`;
  }else{
      return `${TMDB_BASE_URL}/${path}?api_key=${atob(
          "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
          )}&query=${query}`;
  }
};


const fetchList = async (path) => {
  const url = constructUrl(path);
  const res = await fetch(url);
  return res.json();
};


const renderList = (lists,container) => {
  lists.map((list) => {
    const listLi = document.createElement("li");
    listLi.innerHTML =
     `<a class="dropdown-item" src="#">${list.name}</a>`;
    listLi.addEventListener("click", () => {
      getListItems(list);
    });
    container.appendChild(listLi);
  });
};

const fetchMovies = async (path) => {
  const url = constructUrl(path);
  const res = await fetch(url);
  return res.json();
};

const renderMovies = async (movies,container) => {
 
  movies.map(async(movie) => {
    let movieDiv= await generateMovie(movie);
    // container.innerHTML+=movieDiv;
    container.appendChild(movieDiv);
  });
};

const getListItems= async(items)=>{
  noHomePage(true);
  updateHomeMovies(`/genre/${items.id}/movies`,HomePageMovies);
}

document.addEventListener("DOMContentLoaded", autorun);

async function getMore (movie){
  let link=`${TMDB_BASE_URL}/movie/${movie.id}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}`
  
  let x= await fetch(link);
  return x.json();
}


const generateMovie= async (movie)=>{

  
  let y =await getMore(movie);
  






  const m=document.createElement("div");
  m.classList.add("col-lg-4");
  m.classList.add("col-md-6");
  m.classList.add("col-sm-12");
  let out=`
  <div class="card">
              <img src="${BACKDROP_BASE_URL + movie.backdrop_path}"
               class="card-img-top" alt="${movie.title}">
              <div class="card-body text-center w-100 h-100 px-4">
              <h5 class="card-title g-2">${movie.title}</h5>
              <p class="card-text">${movie.overview.slice(0,40)}...</p>
              <p id="movie-vote-avg-count">
                <span>
                    <i class="fa-solid fa-star text-yellow"></i>
                    ${movie.vote_average} |  <i class="fa-solid fa-people-line text-yellow"></i> ${movie.vote_count}
                </span>
            </p>
            <span class="col p-3 g-4">
            `;
            y.genres.forEach(genre => {
              out+=`<span class="badge text-bg-warning m-1">`+genre.name+"</span>";
          
          });   
          out+="</span></div></div>";
  m.innerHTML=out;
  m.addEventListener('click', function(){
    movieDetails(movie);
  });
  return m;
}

const updateHomeMovies = async (path,ele) => {
  HomePageMovies.innerHTML="";
  const movies = await fetchMovies(path);
  renderMovies(movies.results,HomePageMovies);
  ele.classList.add('active');
}

const noHomePage=(check)=>{

const cover = document.querySelector(".cover-container");
const main = document.querySelector(".cover-container main");
const header = document.querySelector(".cover-container header");
const title=document.querySelector(".movies .text-right");
const filter=document.querySelector(".movies #filter");
if(check){
  cover.classList.add("no-home");
  cover.classList.remove("p-3");
  header.classList.add("fixed-top-no-home");
  main.style.display="none";
  title.style.display="none";
  filter.style.display="none";
  checkHome=false;

}else{
main.style.display="block";
cover.classList.add("p-3");
header.classList.remove("fixed-top-no-home");
cover.classList.remove("no-home");
title.style.display="block";
filter.style.display="flex";
checkHome=true;
}
}


const fetchSearch = async (path,query="") => {
  const url = constructUrl(path,query);
  const res = await fetch(url);
  return res.json();
};
const getSearchRes = async () => {
  
  const result = await fetchSearch("search/movie",search.value);
  renderSearch(result.results);
};


const renderSearch = (items) => {
  searchRes.innerHTML="";
  searchRes.style.display="block";
  items.map((item) => {
    const x=document.createElement("div");
    x.classList.add("result-Item");
    x.classList.add("d-flex");
    x.innerHTML +=`
     <img src="${BACKDROP_BASE_URL + item.backdrop_path}" height="60px" width="60px" alt="">
     <p>
     ${item.title}
     </p>`;
    
     x.addEventListener('click', function(){
      movieDetails(item);
    });
    searchRes.appendChild(x);
    
  });
};


////////////////////////////
//abrar
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieCredits = await fetchMovie(movie.id, "credits"); // for actors
  const movieSimilars = await fetchMovie(movie.id, "similar"); 
  // const allRelatedMovies = []
  // if(movieSimilars.total_pages > 1 ){
  //   allRelatedMovies.push(...movieSimilars.results);
  //   for(let i=1; i < movieSimilars.total_pages; i++){
  //     const data = await fetchMore(`movie/${movie.id}/similar`, i);
  //     allRelatedMovies.push(...data.results);
  //   }
  // }
  noHomePage(true);
  const movieTrailer = await fetchMovie(movie.id, "trailers");
  renderMovie(movieRes, movieCredits, movieSimilars, movieTrailer);
};

const fetchMovie = async (movieId, path="") => {
  const url = path ? constructUrl(`movie/${movieId}/${path}`): constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, movieCredits, movieSimilars, movieTrailer) => {
  const trailer = document.createElement('div');
  const production_companies = document.createElement('div');

  // A trailer that has the movie trailer from youtube
  let trailerSource;
  movieTrailer.youtube.find(item => {
    if(item.type === "Trailer")
      trailerSource =  item.source;
  });
  // Trailer DOM
  trailer.innerHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${trailerSource}"></iframe>`;

  // The movie production company name and logo
  movie.production_companies.forEach(comp => {
    production_companies.innerHTML += `
      <li class="col-md-6 col-lg-3">
        <div class="bg-white p-1">
          <img src="${BACKDROP_BASE_URL + comp.logo_path}" alt="${comp.name} logo" class="img-fluid">
        </div>
        <span>${comp.name}</span>
      </li>
    `;
  });
  
  // The director name
  let director_name;
  movieCredits.crew.find(item => {
    if(item.job === "Director")
      director_name = item.name;
  });
  HomePageMovies.innerHTML = "";
  HomePageMovies.innerHTML = `
  <div class="bg-description">
    <div class="container">
      <div class="row py-5">
          <div class="col-md-4 col-lg-3">
            <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.poster_path} alt="${movie.title} poster" class="w-100">
          </div>
          <div class="col-md-8 col-lg-9 d-flex flex-column justify-content-between text-start">
            <h2 id="movie-title" class="font-weight-bolder mb-4">${movie.id}, ${movie.title}</h2>
            <p id="movie-vote-avg-count">
                <span>
                    <i class="fa-solid fa-star text-yellow"></i>
                    ${movie.vote_average} |  <i class="fa-solid fa-people-line text-yellow"></i> ${movie.vote_count}
                </span>
            </p>
            <p id="movie-release-date" class="sub-title text-capitalize">
                <strong>release date:</strong>
                <span>
                    ${movie.release_date}
                </span>
            </p>
            <p id="movie-runtime" class="sub-title text-capitalize">
                <strong>runtime:</strong>
                <span>
                    ${movie.runtime} Minutes
                </span>
            </p>
            <p id="movie-language" class="sub-title text-capitalize">
                <strong>language:</strong>
                <span>
                    ${movie.spoken_languages.map(lang => {
                    return ` ${lang.english_name}`
                  })}
                </span>
            </p>
            <p id="movie-director-name" class="sub-title text-capitalize">
                <strong>director:</strong>
                <span>${director_name}</span>
            </p>
            <p id="movie-overview" class="overview mb-0">
                <strong>Overview:</strong>
                <br>
                ${movie.overview}
            </p>
          </div>
      </div>
    </div>
  </div>`; 
  document.querySelector(".bg-description").style.setProperty('--background-image', `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(21, 18, 18, 0.6), rgba(255, 212, 160, 0.6)), url(${BACKDROP_BASE_URL + movie.poster_path})`);
  HomePageMovies.innerHTML += `
  <div class="bg-dark text-white">
    <div class="container">
      <div class="row flex-column py-5 carousel-container">
        <div class="d-flex align-items-center">
          <h4 class="text-capitalize me-3">top cast</h4>
          <button class="btn btn-sm text-white bg-dark mx-2 px-2 prev-btn"><i class="fa-sharp fa-solid fa-arrow-left"></i></button>
          <button class="btn btn-sm text-white bg-dark mx-2 px-2 next-btn"><i class="fa-sharp fa-solid fa-arrow-right"></i></button>
        </div>
        <ul id="movie-actors" class="d-flex justify-content-between text-center list-unstyled my-3 track">
        </ul>
      </div>
      <div class="row flex-column py-5">
        <h4 class="text-capitalize ml-2">Related Movies</h4>
        <ul id="movie-related-movies" class="row justify-content-between text-center list-unstyled my-3"></ul>
      </div>
      <div class="row flex-column py-5">
        <h3>Trailer:</h3><br />
        ${trailer.innerHTML}
      </div>
      <div class="row flex-column py-5">
        <h4 class="text-capitalize">production companies</h4>
        <ul id="movie-production-companies" class="row justify-content-center text-center list-unstyled my-3"> 
          ${production_companies.innerHTML}
        </ul>
      </div>
    </div>
  </div>
  `; 

  // The main 5 actors of the movies in the credit section
  movieCredits.cast.map(actor => {
    const singleActor = document.createElement('li');
    singleActor.classList.add('my-4', 'mx-4', 'col-sm-5', 'col-md-3', 'col-xl-2');
    if(actor.profile_path)
        singleActor.innerHTML = `
        <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name} profile" class="rounded-circle">
    `
    else singleActor.innerHTML = `
    <img src="./img/placehoder profile.jpg" alt="${actor.name} profile" class="rounded-circle">
        <div class="text-center">
          <h6 class="py-2">${actor.name}</h6>
        </div>
      `;
    singleActor.addEventListener("click", () => {
      actoreDetails(actor);
      relatedMovies(actor);
    });
    const actorsList = document.querySelector('ul#movie-actors');
    actorsList.appendChild(singleActor);
  });
  
  //The related movies section which includes at least five related movies
  // Page1
  const voteClass = (vote) => {
    if (vote >= 8.5)
      return 'high';
    else if (vote >= 7)
      return 'medium';
    else if (vote >= 5)
      return 'low';
    else
      return 'very-low';
  };

  movieSimilars.results.forEach(similar => {
    const singleSimilar = document.createElement('li');
    singleSimilar.classList.add('card_effects', 'col-sm-6', 'col-md-4', 'col-lg-3');
    singleSimilar.innerHTML = `
      <article class="text-left">
          <h2>${similar.original_title}</h2>
          <h4 class="${voteClass(similar.vote_average)}">${similar.vote_average} %</h4>
      </article>
      <img src="${BACKDROP_BASE_URL + similar.poster_path}" alt="${similar.original_title} poster" class="img-fluid">   
    `;
    singleSimilar.addEventListener("click", () => {
      movieDetails(similar);
    });
    const similarsList = document.querySelector('ul#movie-related-movies');
    similarsList.appendChild(singleSimilar);
  });

  // slider actors
  const carouselContainer = document.querySelector('.carousel-container');
  const track = document.querySelector('.track');
  const prev = document.querySelector('.prev-btn');
  const next = document.querySelector('.next-btn');
  const widthCarousel = carouselContainer.offsetWidth - 25;
  let position = 0;
  next.addEventListener('click', () => {
    position += widthCarousel;
    track.style.transform = `translateX(-${position}px)`
  });
  prev.addEventListener('click', () => {
    position = 0;
    track.style.transform = `translateX(0px)`
  });
};

//roqaia
const actorsFun = async () => {
  
  // fetch actors
  const actors = await fetchActors();
  renderActors(actors.results);
}
const fetchRelatedMovies = async (actorId) => {
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
  HomePageMovies.innerHTML = "";
  const singleActor = document.createElement("div");
HomePageMovies.appendChild(singleActor);
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
    // const related = document.querySelector('#related')
    console.log("k")
    // HomePageMovies.innerHTML="";
    HomePageMovies.appendChild(relatedMovieDiv);
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
    // HomePageMovies.innerHTML="";
    HomePageMovies.appendChild(relatedMovieDiv);
  };

};

// render actors
const renderActors = (actors) => {
  const actorSection = document.createElement("div");
  actorSection.classList.add('row');
  actorSection.classList.add('g-4');
  actorSection.classList.add('row-cols-auto');
  actorSection.classList.add("text-center");
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
    actorDiv.addEventListener("click",  () => {
     actoreDetails(actor);
     relatedMovies(actor);
    });
    actorSection.appendChild(actorDiv);
  });
  HomePageMovies.innerHTML="";
  HomePageMovies.appendChild(actorSection);
  noHomePage(true);
};





//////////////////////////////



search.addEventListener('search', getSearchRes);

search.addEventListener('focusout',function(){
  setTimeout(function(){
    searchRes.style.display="none";
  },200);
 
});

search.addEventListener('focus', function(){
  searchRes.style.display="block";
});




const dateFilter=document.getElementById("date");

async function  filterByDate (i){
  const link=`${TMDB_BASE_URL}/discover/movie?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}&year=${i}`;
    const res =await fetch(link);
    return res.json();
}

for(let i=2000; i<=2023; i++){
  const li =document.createElement("li");
  const a =document.createElement("li");
  a.classList.add("dropdown-item");
  a.textContent=i;
  li.appendChild(a);
  li.addEventListener("click",async function (){
   const mov=await filterByDate(i);
   HomePageMovies.innerHTML="";
   renderMovies(mov.results,HomePageMovies);
  });
  dateFilter.appendChild(li);
}
/////////////////////////
//make nav fixed on scrool
document.addEventListener("DOMContentLoaded", function(){
  window.addEventListener('scroll', function() {
    if(checkHome){
      if (window.scrollY > 50) {
        document.getElementById('header').classList.add('fixed-top');
        // add padding top to show content behind navbar
        navbar_height = document.querySelector('.navbar').offsetHeight;
        document.body.style.paddingTop = navbar_height + 'px';
        
      } else {
        document.getElementById('header').classList.remove('fixed-top');
         // remove padding top from body
        document.body.style.paddingTop = '0';
      } 
    }
  });

}); 

// }); 


