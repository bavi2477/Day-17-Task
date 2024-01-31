document.addEventListener('DOMContentLoaded', function () {
    const countryContainer = document.getElementById('countryContainer');
    

    fetch('https://restcountries.com/v3.1/all')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch countries. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(countries => {
            countries.forEach(country => {
                createCountryCard(country);
            });
        })
        .catch(error => console.error('Error fetching countries:', error));

    function createCountryCard(country) {
        const col = document.createElement('div');
        col.classList.add('col-lg-4', 'col-sm-12', 'mb-4');

        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'h-100');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header', 'bg-dark', 'text-light'); // Add background and text color
        cardHeader.textContent = country.name?.common || 'Unknown Country';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'justify-content-between', 'bg-light');

        if (country.flags && country.flags.svg) {
            const flagImg = document.createElement('img');
            flagImg.classList.add('card-img-top');
            flagImg.src = country.flags.svg;
            flagImg.alt = `${country.name?.common || 'Unknown Country'} Flag`;
            flagImg.style.width = '100%';
            cardBody.appendChild(flagImg);
        }

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerHTML = `<strong>Region:</strong> ${country.region}<br/><strong>Latlng:</strong> ${country.latlng.join(', ')}`;

        const weatherButtonContainer = document.createElement('div');
        weatherButtonContainer.classList.add('d-flex', 'justify-content-center');

        const weatherButton = document.createElement('button');
        weatherButton.classList.add('btn', 'btn-primary');
        weatherButton.textContent = 'Click for Weather';
        
        
        weatherButton.addEventListener('click', () => {
            getWeatherData(country);
            $('#weatherModal').modal('show'); 
        });

        weatherButtonContainer.appendChild(weatherButton);

        cardBody.appendChild(cardText);
        cardBody.appendChild(weatherButtonContainer);

        card.appendChild(cardHeader);
        card.appendChild(cardBody);

        col.appendChild(card);
        countryContainer.appendChild(col);
    }

    function getWeatherData(country) {
        const apiKey = '75323973d12ed72ace6199c914faec94';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch weather data. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(weatherData => {
                updateModalContent(country, weatherData);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function updateModalContent(country, weatherData) {
        const modalBody = document.getElementById('weatherDetails');
        modalBody.innerHTML = `
            <p><strong>Country:</strong> ${country.name?.common || 'Unknown Country'}</p>
            <p><strong>City:</strong> ${weatherData.name}</p>
            <p><strong>Temperature:</strong> ${weatherData.main.temp} K</p>
            <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
            <!-- Add more weather details as needed -->
        `;
    }
});