const wrapper = document.querySelector('.wrapper');
const inputPart = document.querySelector('.input-part');
const infoText = document.querySelector('.info-text');
const inputField = document.querySelector('input');
const locationBtn = document.querySelector('button');
const wIcon = document.querySelector('.weather-part img');
const arrowClose = document.querySelector('.header__arrow-left');

let api;
let apiKey = 'fc7e62135a89b89cbfe025414757b19f';

inputField.addEventListener('keyup', e => {
  if(e.key === 'Enter' && inputField.value != " ") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener('click', () => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert('Your browser not support geolocation api')
  }
});

function onSuccess(position) {
  const {latitude, longitude} = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoText.innerHTML = error.message;
  infoText.classList.add('error');
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  infoText.innerText = 'Getting weather details...';
  infoText.classList.add('pending');
  fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
  if(info.cod == '404') {
    infoText.classList.replace('pending', 'error');
    infoText.innerText = `${inputField.value} isn't a valid city name` ;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const {description, id} = info.weather[0];
    const {feels_like, humidity, temp} = info.main

    if(id == 800) {
      wIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "icons/storm.svg";
    }else if (id >= 600 && id <= 622) {
      wIcon.src = "icons/snow.svg";
    }else if (id >= 701 && id <= 781) {
      wIcon.src = "icons/cloud.svg";
    }else if (id >= 801 && id <= 804) {
      wIcon.src = "icons/cloud.svg";
    }else if (id >= 300 && id <= 321) {
      wIcon.src = "icons/rain.svg"
    }

    wrapper.querySelector('.temperature .number').innerText = Math.floor(temp);
    wrapper.querySelector('.weather').innerText = description;
    wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
    wrapper.querySelector('.temperature .temperature__feels').innerText = Math.floor(feels_like);
    wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

    infoText.classList.remove('pending', 'error');
    wrapper.classList.add('active');
  }
}

arrowClose.addEventListener('click', () => {
  wrapper.classList.remove("active");
})