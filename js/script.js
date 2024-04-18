// custom router
const global = {
    currentPage: window.location.pathname,
    api: "https://api.themoviedb.org/3/",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMzY2NzhjMGE1NzIyZGM1NWI5MzlmMmFjYTkyZWIyYiIsInN1YiI6IjY2MWQwZGQyNmY0M2VjMDE4NzVkNmE4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.prZBb5iVDlIACrMro8_1kEaFDTNlWhip_HoRTxqgnkY",
    },
};
let currentPage = 1;
let genre;


// FetchingData From TMDB
async function fetchingTMDB(endpoint, queries = "") {
    showSpinner();
    const response = await fetch(`${global.api}${endpoint}${queries}`, {
        method: "GET",
        headers: global.headers,
    });
    const data = await response.json();
    hideSpinner();
    return data;
}

// displayPopularMovies
async function displayPopularMovies(endpoint, queries = "") {
    const { results } = await fetchingTMDB(endpoint, queries);
    const movieList = document.getElementById("popular-movies");
    movieList.innerHTML = "";
    detectPage();
    results.forEach((movie) => {
        const card = document.createElement("div");
        const {
            id,
            original_title: movieTitle,
            release_date,
            poster_path: moviePoster,
            overview,
        } = movie;
        console.log();
        card.classList.add("card");
        card.innerHTML = `
        <div class="card-front">
        ${
            moviePoster
                ? `
            <img
            src="https://image.tmdb.org/t/p/w500${moviePoster}"
            class="card-img-top"
            alt="${movieTitle}"/>
            `
                : ` <img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${movieTitle}"/>
                `
        }
        </div>
        <div class="card-back">
            <h4 class="card-title">${movieTitle}</h4>
            <p class="card-text">
                <small class="text-muted">Release: ${release_date.slice(
                    0,
                    4
                )}</small>
            </p>
            <p class="card-overview">
            ${overview
                .split(" ")
                .splice(0, 20)
                .join(
                    " "
                )}...<a href="movie-details.html?id=${id}" class="see-more">
            Details
            </a>
            </p>
        </div>
        `;
        movieList.appendChild(card);
    });
}

// displayPopularShows
async function displayPopularShows(endpoint, queries = "") {
    const { results } = await fetchingTMDB(endpoint, queries);
    const showList = document.getElementById("popular-shows");
    showList.innerHTML = "";
    detectPage();
    results.forEach((show) => {
        const card = document.createElement("div");
        const {
            id,
            original_name: showTitle,
            first_air_date,
            poster_path: showPoster,
            overview,
        } = show;
        card.classList.add("card");
        card.innerHTML = `
        <div class="card-front">
        ${
            showPoster
                ? `
            <img
            src="https://image.tmdb.org/t/p/w500${showPoster}"
            class="card-img-top"
            alt="${showTitle}"/>
            `
                : ` <img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${showTitle}"/>
                `
        }
        </div>
        <div class="card-back">
            <h4 class="card-title">${showTitle}</h4>
            <p class="card-text">
                <small class="text-muted">Release: ${first_air_date.slice(
                    0,
                    4
                )}</small>
            </p>
            <p class="card-overview">
            ${overview
                .split(" ")
                .splice(0, 20)
                .join(
                    " "
                )}...<a href="tv-details.html?id=${id}" class="see-more">
            Details
            </a>
            </p>
        </div>
        `;
        showList.appendChild(card);
    });
}
// highlight active link
function highlightActiveLink() {
    const pages = document.querySelectorAll(".nav-link");
    pages.forEach((page) => {
        if (page.getAttribute("href") === global.currentPage) {
            page.classList.add("active");
        }
    });
}
// Spinner Toggle
function showSpinner() {
    document.querySelector(".spinner").classList.remove("hidden");
}
function hideSpinner() {
    document.querySelector(".spinner").classList.add("hidden");
}
// Pagination
function pagination(endpoint, totalPages) {
    const pageContainer = document.querySelector(".pagination");
    pageContainer.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target.parentElement.id;
        switch (target) {
            case "next":
                changePage(currentPage + 1, endpoint, totalPages);
                break;
            case "prev":
                changePage(currentPage - 1, endpoint, totalPages);
                break;
            default:
                const pageNum = parseInt(target);
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                    changePage(pageNum, endpoint, totalPages);
                }
        }
    });
}

function changePage(newPage, endpoint, totalPages) {
    if (newPage < 1) {
        newPage = 1;
    } else if (newPage > totalPages) {
        newPage = totalPages;
    }

    currentPage = newPage;
    switch (genre) {
        case "movies":
            displayPopularMovies(endpoint, `?page=${currentPage}`);
            break;
        case "tv-show":
            console.log(genre);
            displayPopularShows(endpoint, `?page=${currentPage}`);
            break;
        default:
            break;
    }
}

function detectPage() {
    const allPages = document.querySelectorAll(`.pagination li`);
    allPages.forEach((pageNum) => {
        if (Number(pageNum.id) === currentPage) {
            pageNum.classList.add("currant");
        } else {
            pageNum.classList.remove("currant");
        }
    });
    document
        .getElementById("next")
        .classList.toggle("disable", currentPage === 5);
    document
        .getElementById("prev")
        .classList.toggle("disable", currentPage === 1);
}

// init app
function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            displayPopularMovies("movie/popular");
            genre = "movies";
            pagination("movie/popular", 5);
            break;
        case "/shows.html":
            displayPopularShows("tv/popular?page=1");
            genre = "tv-show";
            pagination("tv/popular", 5);
            break;
        case "/movie-details.html":
            console.log("Movie-details");
            break;
        case "/tv-details.html":
            console.log("Tv-details");
            break;
        case "/search.html":
            console.log("Search");
            break;
        default:
            console.log("Error Page Not Found");
            break;
    }
    highlightActiveLink();
}
document.addEventListener("DOMContentLoaded", init);
