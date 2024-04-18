// custom router
const global = {
    currentPage: window.location.pathname,
    api: "https://api.themoviedb.org/3/",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMzY2NzhjMGE1NzIyZGM1NWI5MzlmMmFjYTkyZWIyYiIsInN1YiI6IjY2MWQwZGQyNmY0M2VjMDE4NzVkNmE4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.prZBb5iVDlIACrMro8_1kEaFDTNlWhip_HoRTxqgnkY",
    },
    totalPages: 5,
};

let currentPage = 1;
let genre;

// FetchingData From TMDB
async function fetchingTMDB(endpoint, queries = "") {
    const response = await fetch(`${global.api}${endpoint}${queries}`, {
        method: "GET",
        headers: global.headers,
    });
    showSpinner();
    const data = await response.json();
    hideSpinner();
    return data;
}

// displayPopularMovies
async function displayPopularMovies(queries = "") {
    const { results } = await fetchingTMDB("movie/popular", queries);
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
async function displayPopularShows(queries = "") {
    const { results } = await fetchingTMDB("tv/popular", queries);
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

// displayMovieDetails
async function displayMovieDetails() {
    const movieId = window.location.search.split("=")[1];
    const movieDetailsItem = document.getElementById("movie-details");

    const {
        backdrop_path: backGround,
        original_title: movieName,
        overview: details,
        poster_path: moviePoster,
        release_date,
        vote_average: rating,
        genres,
        homepage,
        budget,
        revenue,
        runtime,
        status,
        production_companies,
    } = await fetchingTMDB(`movie/${movieId}`);
    //Overlay BackDrop
    displayBackdrop(backGround);

    // create movie element
    const div = document.createElement("div");

    div.innerHTML = `
        <div class="details-top">
            <div>
                <img src="https://image.tmdb.org/t/p/w500${moviePoster}"
                class="card-img-top" alt="${movieName}" />
            </div>
            <div>
                <h2>${movieName}</h2>
                <p>
                    <i class="fas fa-star text-primary"></i>
                    ${rating} / 10
                </p>
                <p class="text-muted">Release Date: ${release_date}</p>
                <p>${details}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                    ${genres.forEach((gen) => {
                        `<li>${gen.name}</li>`;
                    })}
                </ul>
                <a href="${homepage}" target="_blank" class="btn"
                    >Visit Movie Homepage</a
                >
            </div>
        </div>
        <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Budget:</span> $${addComa(
                    budget
                )}</li>
                <li>
                    <span class="text-secondary">Revenue:</span> $${addComa(
                        revenue
                    )}
                </li>
                <li>
                    <span class="text-secondary">Runtime:</span> ${runtime}
                    minutes
                </li>
                <li><span class="text-secondary">Status:</span> ${status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">

            </div>
            ${production_companies.map((com) => `${com.name}`).join(" , ")}
        </div>
    `;
    movieDetailsItem.appendChild(div);
}
async function displayTvDetails() {
    const tvID = window.location.search.split("=")[1];
    const tvDetailsItem = document.getElementById("show-details");
    const {
        backdrop_path: backGround,
        original_name: showName,
        number_of_episodes: totalEpisodes,
        overview: details,
        poster_path: showPoster,
        first_air_date: releaseDate,
        last_episode_to_air: lastEpisode,
        vote_average: rating,
        genres,
        homepage,
        status,
        production_companies,
    } = await fetchingTMDB(`tv/${tvID}`);
    //Overlay BackDrop
    displayBackdrop(backGround);

    // create movie element
    const div = document.createElement("div");

    div.innerHTML = `
        <div class="details-top">
            <div>
                <img
                    src="https://image.tmdb.org/t/p/w500${showPoster}"
                    class="card-img-top"
                    alt="Show Name"
                />
            </div>
            <div>
                <h2>${showName}</h2>
                <p>
                    <i class="fas fa-star text-primary"></i>
                    ${rating} / 10
                </p>
                <p class="text-muted">Release Date: ${releaseDate}</p>
                <p>${details}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                    ${genres
                        .map((gen) => {
                            `<li>${gen.name}</li>`;
                        })
                        .join("")}
                </ul>
                <a href="${homepage}" target="_blank" class="btn"
                    >Visit Show Homepage</a
                >
            </div>
        </div>
        <div class="details-bottom">
            <h2>Show Info</h2>
            <ul>
                <li>
                    <span class="text-secondary">Number Of Episodes:</span>
                    ${totalEpisodes}
                </li>
                <li>
                    <span class="text-secondary">Last Episode To Air:</span>
                    ${lastEpisode.name}
                </li>
                <li><span class="text-secondary">Status:</span> ${status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">
            ${production_companies.map((com) => `${com.name}`).join(" , ")}
            </div>
        </div>
    `;
    tvDetailsItem.appendChild(div);
}
// overLay
function displayBackdrop(backdropPath) {
    const overlayDiv = document.createElement("div");
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backdropPath})`;
    overlayDiv.classList.add("overlay");
    if (genre === "movie-details") {
        document.getElementById("movie-details").appendChild(overlayDiv);
    } else if (genre === "tv-details") {
        document.getElementById("show-details").appendChild(overlayDiv);
    }
}

// add Comma To Numbers
function addComa(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
function pagination() {
    const pageContainer = document.querySelector(".pagination");
    pageContainer.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target.parentElement.id;
        switch (target) {
            case "next":
                changePage(++currentPage);
                break;
            case "prev":
                changePage(--currentPage);
                break;
            default:
                const pageNum = parseInt(target);
                if (
                    !isNaN(pageNum) &&
                    pageNum >= 1 &&
                    pageNum <= global.totalPages
                ) {
                    changePage(pageNum);
                }
        }
    });
}

function changePage(newPage) {
    if (newPage < 1) {
        newPage = 1;
    } else if (newPage > global.totalPages) {
        newPage = global.totalPages;
    }

    currentPage = newPage;
    switch (genre) {
        case "movies":
            displayPopularMovies(`?page=${currentPage}`);
            break;
        case "tv-show":
            displayPopularShows(`?page=${currentPage}`);
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

// displaySlider
async function displaySlider(endpoint, type) {
    const { results } = await fetchingTMDB(endpoint);
    const data = results.map((obj) => {
        return {
            id: obj.id,
            img: obj.poster_path,
            name: obj.original_title,
            rate: obj.vote_average,
        };
    });
    data.forEach((item) => {
        const swiperDiv = document.createElement("div");
        swiperDiv.classList.add("swiper-slide");
        swiperDiv.innerHTML = ` <a href="${type}-details.html?id=${item.id}">
                <img
                    src="https://image.tmdb.org/t/p/w500${item.img}"
                    alt="Movie Title"
                />
            </a>
            <h4 class="swiper-rating">
                <i class="fas fa-star text-secondary"></i> ${item.rate} / 10
            </h4>`;
        document.querySelector(".swiper-wrapper").appendChild(swiperDiv);
    });
    initSwiper();
}
function initSwiper() {
    const swipe = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disable: false,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });
}

// init app
function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            genre = "movies";
            displaySlider("movie/now_playing", "movie");
            displayPopularMovies();
            pagination();
            break;
        case "/shows.html":
            genre = "tv-show";
            displaySlider("tv/on_the_air", "tv");
            displayPopularShows();
            pagination();
            break;
        case "/movie-details.html":
            genre = "movie-details";
            displayMovieDetails();
            break;
        case "/tv-details.html":
            genre = "tv-details";
            displayTvDetails();
            break;
        case "/search.html":
            break;
        default:
            console.log("Error Page Not Found");
            break;
    }
    highlightActiveLink();
}
document.addEventListener("DOMContentLoaded", init);
