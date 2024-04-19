// Global : contain (api,api_key,media,searching)
const global = {
    currentPage: window.location.pathname,
    api: "https://api.themoviedb.org/3/",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMzY2NzhjMGE1NzIyZGM1NWI5MzlmMmFjYTkyZWIyYiIsInN1YiI6IjY2MWQwZGQyNmY0M2VjMDE4NzVkNmE4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.prZBb5iVDlIACrMro8_1kEaFDTNlWhip_HoRTxqgnkY",
    },
    media: {
        genre: "",
        page: 1,
        totalPages: 1,
    },
    searching: {
        type: "",
        term: "",
        totalResults: 0,
    },
};

// ?------------------Start trending/movie/week---------------------
async function fetchingTMDB(endpoint, queries = "") {
    const response = await fetch(`${global.api}${endpoint}${queries}`, {
        method: "GET",
        headers: global.headers,
    });
    const data = await response.json();
    toggleSpinner(false);
    return data;
}
// ?------------------End trending/movie/week-----------------------

// ?------------------Start Popular Movies Section------------------
// ! Popular Movies
async function displayPopularMovies() {
    // FetchPopularMovies
    const { results, page, total_pages } = await fetchingTMDB(
        "movie/popular",
        `?page=${global.media.page}`
    );

    // Pagination Setup
    paginationSetup(page, total_pages);

    // Showing Movies On DOM
    const movieList = document.getElementById("popular-movies");
    movieList.innerHTML = "";
    results.forEach((movie) => {
        const card = document.createElement("div");
        // *TODO - Destructuring
        const {
            id,
            original_title: movieTitle,
            release_date,
            poster_path: moviePoster,
            overview,
        } = movie;
        card.classList.add("card");
        // *TODO - Conditional Rendering
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
// ! Movie Details
async function displayMovieDetails() {
    // Get Movie ID and Create element
    const movieId = window.location.search.split("=")[1];
    const movieDetailsItem = document.getElementById("movie-details");
    const div = document.createElement("div");

    // Fetch Movie Details
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
    // Movie Details On DOM
    div.innerHTML = `
        <div class="details-top">
        ${
            moviePoster === null
                ? `
                <img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="no image"
                />
                `
                : `
                <img
                    src="https://image.tmdb.org/t/p/w500${moviePoster}"
                    class="card-img-top"
                    alt="${movieName}"
                />
                `
        }
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
// ?------------------End Popular Movies Section-------------------

// ?------------------Start Popular Shows Section------------------
// ! Popular TV Shows
async function displayPopularShows() {
    // Fetching Tv Shows
    const { results, page, total_pages } = await fetchingTMDB(
        "tv/popular",
        `?page=${global.media.page}`
    );
    // Pagination Setup
    paginationSetup(page, total_pages);

    // Display TV Shows On DOM
    const showList = document.getElementById("popular-shows");
    showList.innerHTML = "";
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
// ! TV Details
async function displayTvDetails() {
    // Get TV ID and create element
    const tvID = window.location.search.split("=")[1];
    const tvDetailsItem = document.getElementById("show-details");
    const div = document.createElement("div");
    // Fetch TV Details
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
    // TV Details On DOM
    div.innerHTML = `
        <div class="details-top">
            <div>
            ${
                showPoster === null
                    ? `
                    <img
                        src="../images/no-image.jpg"
                        class="card-img-top"
                        alt="no image"
                    />
                    `
                    : `
                    <img
                        src="https://image.tmdb.org/t/p/w500${showPoster}"
                        class="card-img-top"
                        alt="${showName}"
                    />
                    `
            }
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
//?------------------End Popular Shows Section------------------

//?------------------Start Search Section------------------
// ! Search Function To Get Term And Validate
async function search() {
    // Get Search Term and Type from URL
    const queryString = window.location.search;
    const urlSearchParams = new URLSearchParams(queryString);
    global.searching.type = urlSearchParams.get("type");
    global.searching.term = urlSearchParams.get("search-term");
    global.searching.type === "tv" &&
        document
            .getElementById("tv")
            .toggleAttribute(
                "checked",
                document.getElementById("movie").hasAttribute("checked")
            );
    // Validate Search Results
    if (global.searching.term !== "" && global.searching.term !== null) {
        const { results, total_pages, page, total_results } =
            await searchApiData();
        // Pagination Setup
        paginationSetup(page, total_pages);
        // Global search params
        global.searching.totalResults = total_results;
        if (results.length === 0) {
            showALert("not matched result", "error");
            return;
        }
        displaySearchResults(results);
        document.querySelector("#search-term").value = "";
    } else {
        // Validate Search Term
        showALert("Please enter term", "error");
    }
}
// ! Display Search Results On DOM
function displaySearchResults(results) {
    // Select Search Wrapper and Empty It
    const searchWrapper = document.getElementById("search-results");
    searchWrapper.innerHTML = "";
    // Loop Through Results And Create Cards
    results.forEach((result) => {
        const {
            id,
            original_title,
            original_name,
            overview,
            poster_path,
            release_date,
            first_air_date,
        } = result;
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-front">
                ${
                    poster_path
                        ? `
            <img
            src="https://image.tmdb.org/t/p/w500${poster_path}"
            class="card-img-top"
                alt="${original_title || original_name}"/>
                `
                        : ` <img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${original_title || original_name}"/>
                    `
                }
            </div>
            <div class="card-back">
                <h4 class="card-title">${original_title || original_name}</h4>
                <p class="card-text">
                    <small class="text-muted"
                        >Release: ${
                            (release_date === undefined
                                ? `xxxx`
                                : release_date.slice(0, 4)) ||
                            (first_air_date === undefined
                                ? `xxxx`
                                : first_air_date.slice(0, 4))
                        }</small
                    >
                </p>
                <p class="card-overview">
                    ${overview.split(" ").splice(0, 20).join(" ")}...<a
                        href="${global.searching.type}-details.html?id=${id}"
                        class="see-more"
                    >
                        Details
                    </a>
                </p>
            </div>
        `;
        // Append Card To Wrapper
        document.getElementById("search-results-heading").innerHTML = `
        <h2>
        ${results.length}
        of ${global.searching.totalResults} results for (${global.searching.term})
        </h2>
        `;
        searchWrapper.appendChild(card);
    });
}
// ! Search API Fetching Function
async function searchApiData() {
    toggleSpinner(true);
    // Get Search Term and Type from URL
    const response = await fetch(
        `${global.api}search/${global.searching.type}?query=${global.searching.term}&page=${global.media.page}`,
        {
            method: "GET",
            headers: global.headers,
        }
    );
    const data = await response.json();
    toggleSpinner(false);
    return data;
}
// ! Show Alert Function
function showALert(message, className) {
    const alert = document.createElement("div");
    const txt = document.createTextNode(message);
    alert.classList.add("alert", className);
    alert.appendChild(txt);
    document.querySelector("#alert").appendChild(alert);
    toggleSpinner(false);
    setTimeout(() => {
        alert.classList.add("hide");
    }, 1000);
}
// ?------------------End Search Section------------------------

// ?------------------Start Pagination Section------------------
// ! Pagination Setup
function paginationSetup(page, total_pages) {
    global.media.page = page;
    global.media.totalPages = total_pages >= 500 ? 500 : total_pages;
    displayPageNumber();
}
// ! Display Page Numbers On DOM
function displayPageNumber() {
    // Select Pagination Element
    const ul = document.querySelector(".pagination");
    ul.innerHTML = "";
    // anchors
    const anchorPrev = document.createElement("a");
    const anchorNext = document.createElement("a");
    const anchorFirst = document.createElement("a");
    const anchorLast = document.createElement("a");
    // Li elements
    const prev = document.createElement("li");
    const next = document.createElement("li");
    const first = document.createElement("li");
    const last = document.createElement("li");
    //Appending to Child
    prev.appendChild(anchorPrev);
    next.appendChild(anchorNext);
    first.appendChild(anchorFirst);
    last.appendChild(anchorLast);
    // innerText
    anchorPrev.innerText = "Prev";
    anchorNext.innerText = "Next";
    anchorFirst.innerText = "<<";
    anchorLast.innerText = ">>";
    //dataset
    first.setAttribute("data-locate", 1);
    last.setAttribute("data-locate", global.media.totalPages);
    prev.setAttribute("id", "prev");
    next.setAttribute("id", "next");
    //Appending to Parent
    ul.appendChild(prev);
    ul.appendChild(first);
    // Calculate startPage and endPage values based on the current page and total pages in the media object
    let startPage = Math.max(1, global.media.page - 4);
    let endPage = Math.min(global.media.totalPages, startPage + 4);
    // Adjust startPage and endPage if the endPage is less than 5 to make sure it's less than 5 page numbers in the pagination display
    if (endPage - startPage < 5) {
        startPage = Math.max(1, endPage - 4);
    }
    // Display page numbers in the pagination Numbers on the DOM
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement("li");
        const anchor = document.createElement("a");
        const text = document.createTextNode(i);
        anchor.appendChild(text);
        li.setAttribute("data-page", i);
        li.appendChild(anchor);
        ul.appendChild(li);
    }
    // Append Last Page Number
    ul.appendChild(last);
    ul.appendChild(next);
    // Event Listener For Event Delegation
    ul.addEventListener("click", eventElement);
    paginationEffect();
}
// ! Event Listener
function eventElement(e) {
    // Get Element ID from the clicked element
    const elementID =
        e.target.parentElement.id ||
        e.target.parentElement.dataset.page ||
        e.target.parentElement.dataset.locate;
    // which element was clicked
    switch (elementID) {
        case "next":
            if (global.media.page <= global.media.page) {
                global.media.page++;
                displayPageNumber();
            }
            break;
        case "prev":
            if (global.media.page > 1) {
                global.media.page--;
                displayPageNumber();
            }
            break;
        case elementID:
            global.media.page = elementID;
            break;
        default:
            console.log("Error");
            break;
    }
    // validate the Genre will invoke the display function
    invokeGenreDisplay();
}
// ! Invoke Genre Display
function invokeGenreDisplay() {
    switch (global.media.genre) {
        case "movies":
            displayPopularMovies();
            break;
        case "tv-show":
            displayPopularShows();
            break;
        case "searching":
            search();
            break;
        default:
            break;
    }
}
// ! Pagination Effect
function paginationEffect() {
    const allLi = document.querySelectorAll(".pagination li[data-page]");
    allLi.forEach((li) => {
        li.classList.toggle(
            "currant",
            Number(li.dataset.page) === global.media.page
        );
    });
}
// ?------------------End Pagination Section--------------------

// ?------------------Start Utilities Section-------------------
// *TODO - Toggle Spinner
function toggleSpinner(condition) {
    document.querySelector(".spinner").classList.toggle("hidden", !condition);
}
// *TODO - Display Trending Slider
async function displaySlider(endpoint, type) {
    // Fetch Slider Data And Map Into Array
    const { results } = await fetchingTMDB(endpoint);
    const data = results.map((obj) => {
        return {
            id: obj.id,
            img: obj.poster_path,
            name: obj.original_title,
            rate: obj.vote_average,
        };
    });
    // Display Slider On DOM by looping through data array
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
    // Init Swiper Object For Slider
    initSwiper();
}
// *STUB - Init Swiper Object
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
// *TODO - Display Backdrop In Details Pages For Current Media
function displayBackdrop(backdropPath) {
    const overlayDiv = document.createElement("div");
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backdropPath})`;
    overlayDiv.classList.add("overlay");
    if (global.media.genre === "movie-details") {
        document.getElementById("movie-details").appendChild(overlayDiv);
    } else if (global.media.genre === "tv-details") {
        document.getElementById("show-details").appendChild(overlayDiv);
    }
}
// *TODO - Highlight Active Link
function highlightActiveLink() {
    const pages = document.querySelectorAll(".nav-link");
    pages.forEach((page) => {
        if (page.getAttribute("href") === global.currentPage) {
            page.classList.add("active");
        }
    });
}
// *TODO - Add Coma To Numbers
function addComa(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// ?------------------End Utilities Section-----------------------

// ?------------------Router App Pages----------------------------
function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            global.media.genre = "movies";
            displaySlider("trending/movie/week", "movie");
            displayPopularMovies();
            break;
        case "/shows.html":
            global.media.genre = "tv-show";
            displaySlider("trending/tv/week", "tv");
            displayPopularShows();
            break;
        case "/movie-details.html":
            global.media.genre = "movie-details";
            displayMovieDetails();
            break;
        case "/tv-details.html":
            global.media.genre = "tv-details";
            displayTvDetails();
            break;
        case "/search.html":
            global.media.genre = "searching";
            search();
            displayPageNumber();
            break;
        default:
            console.log("Error Page Not Found");
            break;
    }
    highlightActiveLink();
}
document.addEventListener("DOMContentLoaded", init);
// ***************************************************************
