(() => {
  const form = document.querySelector('#form');
  const formInput = document.querySelector('#form__input');
  const informationsContainer = document.querySelector('#informations');
  const infosButton = document.querySelector('#btn-infos');
  const ipAddressElement = document.querySelector('[data-ip-address]');
  const locationElement = document.querySelector('[data-location]');
  const timezoneElement = document.querySelector('[data-timezone]');
  const ispElement = document.querySelector('[data-isp]');
  const map = L.map('map', {
    attributionControl: false,
    zoomControl: false,
  });
  const myIcon = L.icon({
    iconUrl: '../images/icon-location.svg',
    iconSize: [46, 56],
  });

  getSearchData('');
  async function getSearchData(searchValue) {
    try {
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_iIEzyWkBYiGggnoJveB8gplWM201a&ipAddress=${searchValue}&domain=${searchValue}`
      );
      const data = await response.json();

      form.classList.remove('invalid');

      setInformations(data);
      setMap(data.location.lat, data.location.lng);
    } catch (error) {
      form.classList.add('invalid');
    }
  }

  function setInformations(data) {
    ipAddressElement.innerText = data.ip;
    locationElement.innerText = `${data.location.region}, ${data.location.country}`;
    timezoneElement.innerText = `UTC ${data.location.timezone}`;
    ispElement.innerText = data.isp;
  }

  async function setMap(latitude, longitude) {
    try {
      await map.setView([latitude, longitude], 13);
      await L.marker([latitude, longitude], { icon: myIcon }).addTo(map);
      await L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoiam9hbzkzMDIiLCJhIjoiY2t6dWRtcTN1N2xmeDJ3bmYxOGI5MWRkcSJ9.ZPN5caaUn0DLYDa0NvHYAQ',
      }).addTo(map);
    } catch (error) {
      console.log(error);
    }
  }

  form.addEventListener('submit', evt => {
    evt.preventDefault();
    const searchValue = formInput.value;

    if (searchValue.trim().length === 0) {
      form.classList.add('empty');
      return;
    }
    form.classList.remove('empty');

    getSearchData(searchValue);
  });

  infosButton.addEventListener('click', () => {
    informationsContainer.classList.toggle('hide');

    if (informationsContainer.classList.contains('hide')) {
      return (infosButton.title = 'show informations');
    }
    infosButton.title = 'hide informations';
  });
})();
