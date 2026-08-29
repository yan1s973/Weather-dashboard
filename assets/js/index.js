// Global declaration of variables

const recentSearchesContainer = $("#recent-searches-container");
const weatherInfoContainer = $("#weather-info-container");
const searchForm = $("#search-form");

// ============================================================
// 🔑 METS TA CLÉ API OPENWEATHER ICI
const API_KEY = "7b544cafc8cf12ffb67c1ebf33c42cc3";
// ============================================================

// Reusable modular function to read data from Local Storage
const readFromLocalStorage = (key, defaultValue) => {
	const dataFromLS = localStorage.getItem(key);
	const parsedData = JSON.parse(dataFromLS);
	if (parsedData) {
		return parsedData;
	} else {
		return defaultValue;
	}
};

// Function that uses Local Storage to store persistent data.
const writeToLocalStorage = (key, value) => {
	const stringifiedValue = JSON.stringify(value);
	localStorage.setItem(key, stringifiedValue);
};

const constructUrl = (baseUrl, params) => {
	const queryParams = new URLSearchParams(params).toString();
	return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
};

// Function to fetch data from an API
const fetchData = async (url, options = {}) => {
	try {
		const response = await fetch(url, options);
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			throw new Error("Failed to fetch data");
		}
	} catch (error) {
		throw new Error(error.message);
	}
};

// Function that applies red/amber/green colour to the UV index depending on its severity
const getUviClassName = (uvi) => {
	if (uvi >= 0 && uvi <= 2) return "bg-success";
	if (uvi > 2 && uvi <= 8) return "bg-warning";
	if (uvi > 8) return "bg-danger";
};

// Function to render todays weather info for the users chosen city
const renderCurrentData = (data) => {
	const currentWeatherCard = `<div class="p-3 jumbotron">
    <div class="text-center">
      <h2 class="my-2">${data.cityName}</h2>
      <h3 class="my-2">${moment.unix(data.weatherData.current.dt).format("dddd, Do MMM, YYYY HH:mm:ss")}</h3>
      <div>
        <img
          src="https://openweathermap.org/img/w/${data.weatherData.current.weather[0].icon}.png"
          alt="weather icon"
          class="shadow-sm p-3 mt-3 bg-body rounded border"
        />
      </div>
      <p class="mt-2 text-capitalize text-muted">${data.weatherData.current.weather[0].description}</p>
    </div>
    <!-- weather metric div -->
    <div class="mt-4">
      <div class="row g-0">
        <div class="col-sm-12 col-md-4 p-2 border bg-light fw-bold">Température</div>
        <div class="col-sm-12 col-md-8 p-2 border">${data.weatherData.current.temp} &deg;C</div>
      </div>
      <div class="row g-0">
        <div class="col-sm-12 col-md-4 p-2 border bg-light fw-bold">Ressenti</div>
        <div class="col-sm-12 col-md-8 p-2 border">${data.weatherData.current.feels_like} &deg;C</div>
      </div>
      <div class="row g-0">
        <div class="col-sm-12 col-md-4 p-2 border bg-light fw-bold">Humidité</div>
        <div class="col-sm-12 col-md-8 p-2 border">${data.weatherData.current.humidity}&percnt;</div>
      </div>
      <div class="row g-0">
        <div class="col-sm-12 col-md-4 p-2 border bg-light fw-bold">Vent</div>
        <div class="col-sm-12 col-md-8 p-2 border">${data.weatherData.current.wind_speed} km/h</div>
      </div>
      <div class="row g-0">
        <div class="col-sm-12 col-md-4 p-2 border bg-light fw-bold">Visibilité</div>
        <div class="col-sm-12 col-md-8 p-2 border">${(data.weatherData.current.visibility / 1000).toFixed(1)} km</div>
      </div>
    </div>
  </div>`;

	weatherInfoContainer.append(currentWeatherCard);
};

// Function to render the 5 day forecast cards
const renderForecastData = (data) => {
	const createForecastCard = (each) => {
		const forecast = `<div class="card m-2 forecast-card forecast-cards-bg">
      <div class="d-flex justify-content-center">
        <img
          src="https://openweathermap.org/img/w/${each.weather[0].icon}.png"
          class="shadow-sm p-3 mt-3 bg-body rounded border card-img-top weather-icon"
          alt="weather icon"
        />
      </div>
      <div class="card-body">
        <h5 class="card-title text-center text-white">${moment.unix(each.dt).format("ddd, Do MMM")}</h5>
        <p class="text-center text-white text-capitalize" style="font-size:0.85rem">${each.weather[0].description}</p>
        <div class="mt-2 text-center">
          <div class="row g-0">
            <div class="col-12 p-2 border bg-light fw-bold">Température</div>
            <div class="col-12 p-2 border text-white">${each.temp.day} &deg;C</div>
          </div>
          <div class="row g-0">
            <div class="col-12 p-2 border bg-light fw-bold">Humidité</div>
            <div class="col-12 p-2 border text-white">${each.humidity}&percnt;</div>
          </div>
          <div class="row g-0">
            <div class="col-12 p-2 border bg-light fw-bold">Vent</div>
            <div class="col-12 p-2 border text-white">${each.wind_speed} km/h</div>
          </div>
        </div>
      </div>
    </div>`;
		return forecast;
	};

	const forecastCards = data.weatherData.daily.map(createForecastCard).join("");

	const forecastWeatherCards = `<div>
    <h2 class="mt-3 text-center">Prévisions sur 5 jours</h2>
    <hr />
    <div class="d-flex flex-row justify-content-center flex-wrap">
      ${forecastCards}
    </div>
  </div>`;

	weatherInfoContainer.append(forecastWeatherCards);
};

// Function to render recently searched cities from local storage
const renderRecentSearches = () => {
	const recentSearches = readFromLocalStorage("recentSearches", []);

	if (recentSearches.length) {
		const createRecentCity = (city) => {
			return `<li
                class="list-group-item border-top-0 border-end-0 border-start-0"
                data-city="${city}"
            >${city}</li>`;
		};

		const recentCities = recentSearches.map(createRecentCity).join("");

		const ul = `<ul class="list-group rounded-0">${recentCities}</ul>`;

		recentSearchesContainer.append(ul);
	} else {
		const alert = `<div class="alert alert-warning" role="alert">
            Aucune recherche récente
        </div>`;
		recentSearchesContainer.append(alert);
	}
};

// Function to render an error message
const renderErrorAlert = () => {
	weatherInfoContainer.empty();

	const alert = `<div class="alert alert-danger m-3" role="alert">
    <strong>Erreur !</strong> Ville introuvable ou clé API invalide. Vérifie le nom de la ville et réessaie.
  </div>`;

	weatherInfoContainer.append(alert);
};

// ============================================================
// 🔧 FONCTION CORRIGÉE — utilise /forecast (gratuit)
//    au lieu de /onecall (payant)
// ============================================================
const fetchWeatherData = async (cityName) => {
	// 1) Météo actuelle
	const currentDataUrl = constructUrl(
		"https://api.openweathermap.org/data/2.5/weather",
		{
			q: cityName,
			appid: API_KEY,
			units: "metric",
			lang: "fr",
		}
	);

	const currentData = await fetchData(currentDataUrl);

	const lat = currentData?.coord?.lat;
	const lon = currentData?.coord?.lon;
	const displayCityName = currentData?.name;

	// 2) Prévisions 5 jours (endpoint gratuit)
	const forecastDataUrl = constructUrl(
		"https://api.openweathermap.org/data/2.5/forecast",
		{
			lat: lat,
			lon: lon,
			appid: API_KEY,
			units: "metric",
			lang: "fr",
		}
	);

	const forecastData = await fetchData(forecastDataUrl);

	// Garder 1 entrée par jour à midi (12:00:00)
	const dailyForecasts = forecastData.list
		.filter((item) => item.dt_txt.includes("12:00:00"))
		.slice(0, 5)
		.map((item) => ({
			dt: item.dt,
			temp: { day: Math.round(item.main.temp) },
			humidity: item.main.humidity,
			wind_speed: (item.wind.speed * 3.6).toFixed(1), // m/s → km/h
			weather: item.weather,
		}));

	return {
		cityName: displayCityName,
		weatherData: {
			current: {
				dt: currentData.dt,
				temp: Math.round(currentData.main.temp),
				feels_like: Math.round(currentData.main.feels_like),
				humidity: currentData.main.humidity,
				wind_speed: (currentData.wind.speed * 3.6).toFixed(1), // m/s → km/h
				visibility: currentData.visibility,
				weather: currentData.weather,
			},
			daily: dailyForecasts,
		},
	};
};

const renderWeatherInfo = async (cityName) => {
	try {
		const weatherData = await fetchWeatherData(cityName);
		weatherInfoContainer.empty();
		renderCurrentData(weatherData);
		renderForecastData(weatherData);
		return true;
	} catch (error) {
		renderErrorAlert();
		return false;
	}
};

// Function to handle click on a recent search city
const handleRecentSearchClick = async (event) => {
	const target = $(event.target);

	if (target.is("li")) {
		const cityName = target.attr("data-city");
		$(target).addClass("active").siblings().removeClass("active");
		await renderWeatherInfo(cityName);
	}
};

const handleFormSubmit = async (event) => {
	event.preventDefault();

	const cityName = $("#search-input").val().trim();

	if (cityName) {
		const renderStatus = await renderWeatherInfo(cityName);

		const recentSearches = readFromLocalStorage("recentSearches", []);

		if (!recentSearches.includes(cityName) && renderStatus) {
			recentSearches.push(cityName);
			writeToLocalStorage("recentSearches", recentSearches);
			recentSearchesContainer.children().last().remove();
			renderRecentSearches();
		}
	}
};

const onReady = () => {
	renderRecentSearches();

	// Recharger la dernière ville recherchée au rafraîchissement
	const recentSearches = readFromLocalStorage("recentSearches", []);
	if (recentSearches.length) {
		const lastCity = recentSearches[recentSearches.length - 1];
		renderWeatherInfo(lastCity);
	}
};

const handleSearchInput = (event) => {
    const value = $("#search-input").val().trim();
    if (value === "") {
        weatherInfoContainer.empty();
    }
};

// Event listeners
recentSearchesContainer.click(handleRecentSearchClick);
searchForm.submit(handleFormSubmit);
$("#search-input").on("keyup", handleSearchInput);
$(document).ready(onReady);