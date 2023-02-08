'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
// 
const MoviesList = document.querySelector("header nav #movies-list");
const TVList = document.querySelector("header nav #TV-list");
const HomePageMovies=document.getElementById("Hp-movies");
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

const renderMovies = (movies,container) => {
  movies.map((movie) => {
   let movieDiv= generateMovie(movie);
    container.innerHTML+=movieDiv;
  });
};

const getListItems= async(items)=>{
  noHomePage(true);
  updateHomeMovies(`/genre/${items.id}/movies`,HomePageMovies);
}

document.addEventListener("DOMContentLoaded", autorun);

//style="width: 27rem;"

const generateMovie=(movie)=>{
  return(`
  <div class="col-lg-4 col-md-6 col-sm-12">
  <div class="card">
              <img src="${BACKDROP_BASE_URL + movie.backdrop_path}"
               class="card-img-top" alt="${movie.title}">

              <div class="card-body text-center w-100 h-100 px-4">
              <h5 class="card-title g-2">${movie.title}</h5>
              <p class="card-text">${movie.title}.</p>
              <a href="#" class="btn btn-primary">Open Move</a>
              </div>
          </div>
          </div>
  `);
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
