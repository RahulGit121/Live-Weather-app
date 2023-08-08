const userTab = document.querySelector("[userWeathertab]");
const searchTab = document.querySelector("[searchWeathertab]");
const grantLocationAccess = document.querySelector(".grant-access");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".content");
const notFound = document.querySelector(".not-found");
//constants

let currentTab = userTab;
const API_KEY = "88f03b08883c325462499d5f14f35c4b";
currentTab.classList.add("current-tab");
getSessionStorage();

//tabs switching

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        //background grey 
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantLocationAccess.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");

            // yaha your weather tab par wapis aaynge toh pehle se ek data show hoga weather ka wo kaha se aaya? wo aaya local storage me stored coordinates se

            getSessionStorage();
        }
    }

}


userTab.addEventListener("click", () => {
    switchTab(userTab)
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab)
});

function getSessionStorage() {
    const localCoordinates = sessionStorage.getItem("local-coordinates")
    if (!localCoordinates) {
        grantLocationAccess.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchApifunction(coordinates);
    }
}
//fetch Api funtion

async function fetchApifunction(coordinates) {

    const { lat, lon } = coordinates;
    grantLocationAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderFunction(data);
    }

    catch (err) {
        console.log(err);
    }
}

//for rendering function
function renderFunction(weatherInfo) {
    const placename = document.querySelector("[data-cityName]");
    const logo = document.querySelector("[country-logo]");
    const descr = document.querySelector("[desc-weather]");
    const weatherIcon = document.querySelector("[weather-icon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    //linking data from api to consts


    placename.innerText = weatherInfo?.name;
    logo.src = `https://flagcdn.com/48x36/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    descr.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = ` https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all} %`;

    console.log("render to hora");

}
//making grant access button functional

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("you dont have the location hardware for checking the weather");
    }
}
function showPosition(position) {
    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("local-coordinates", JSON.stringify(usercoordinates));
    fetchApifunction(usercoordinates);

}
const accessButton = document.querySelector(".btn");
accessButton.addEventListener("click", getlocation);

//search form event

const searchInput = document.querySelector("[search-form]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let cityname = searchInput.value;
    if (cityname === "") {
        return;
    }
    else {
        fetchSearchWeatherFunction(cityname);
    }
})

async function fetchSearchWeatherFunction(cityname) {

    // console.log("check 1");

    loadingScreen.classList.add("active");
    grantLocationAccess.classList.remove("active");
    userInfoContainer.classList.remove("active");

    // console.log("check 2");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        // console.log("call gaya api ka");

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderFunction(data);
        // console.log("render ke liye bhje hai");

    } catch {
        // console.log(error);
        console.log("haan bhai ni mila ye desh");
        userInfoContainer.classList.remove("active");
        notFound.classList.add("active");
    }
}
