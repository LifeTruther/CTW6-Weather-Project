// We may want to declare some fetched data types up here


const my_token = 'be18346a55697fe54b044a27ae2c7c3c'

let formx = document.querySelector('#queryDataForm')

formx.addEventListener('submit', (event) => {
    event.preventDefault();
    document.querySelector('.list-group').innerHTML=""
    let query_city = document.querySelector('#city');
    let query_state = document.querySelector('#state');
    let city = event.path[0][0].value;
    let state = event.path[0][1].value;
    console.log(event)
    console.log(`This is the data I got from User -- ${query_city.value}, ${query_state.value}`)
    
    let getLatLon = async () => {
        let response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${my_token}`)
        return response.data[0]
    };
    getLatLon()
    let getWeather = async () =>{
        const latlon = await getLatLon();
        let lat = latlon.lat;
        let lon = latlon.lon;
        let response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${my_token}`)
        return response
    };    
    getWeather()
    console.log(getWeather())
    
    let loadWeather = async () => {
        const weather = await getWeather();
        let currdescription = weather.data.current.weather[0].description
        let currtempF = (Math.round((parseFloat(weather.data.current.temp) - 273.15) * 1.8 + 32))
        let currfeels = (Math.round((parseFloat(weather.data.current.feels_like) - 273.15) * 1.8 + 32))
        let currhumidity = weather.data.current.humidity
        let curriconid = weather.data.current.weather[0].icon
        let dayiconid = weather.data.daily[0].weather[0].icon
        let forecast = weather.data.daily[0].weather[0].description
        let high = (Math.round((parseFloat(weather.data.daily[0].temp.max) - 273.15) * 1.8 + 32))
        let low = (Math.round((parseFloat(weather.data.daily[0].temp.min) - 273.15) * 1.8 + 32))

        const html = 
                `<table class="table-responsive" id="currtable">
                   <thead> 
                    <tr>
                    <th scope="column"></th>
                    <th scope="column">Conditions Outside</th>
                    <th scope="column">Current Temperature</th>
                    <th scope="column">What That Feels Like</th>
                    <th scope="column">Percent Humidity</th>
                    </tr>
                    </thead>
                    <tr>
                    <th scope="row"><img src="http://openweathermap.org/img/wn/${curriconid}.png" class="icon">
                    <td>${currdescription}</td>
                    <td>${currtempF} F</td>
                    <td>${currfeels} F</td>
                    <td>${currhumidity} %</td>
                    </tr>
                </table>
                <table class="table-responsive" id="dailytable">
                   <thead> 
                    <tr>
                    <th scope="column"></th>
                    <th scope="column">Forecast</th>
                    <th scope="column">High</th>
                    <th scope="column">Low</th>
                    </tr>
                    </thead>
                    <tr>
                    <th scope="row"><img src="http://openweathermap.org/img/wn/${dayiconid}.png" class="icon">
                    <td>${forecast}</td>
                    <td>${high} F</td>
                    <td>${low} F</td>
                    </tr>
                </table>`
            
        let z = document.getElementById('Weather-Section')
        console.log(z)
        z.insertAdjacentHTML('beforeend', html)
    
    }
    loadWeather()
    
    let alert = async() =>{
        const weather = await getWeather();
        if (weather.data.alerts){
            html = `<div class ="col-12 col-md-8 offset-md-2">
                    <div class="alert alert-danger" role="alert">
                    <p>${weather.data.alerts[0].description}</p>
                    </div>
                    </div>`
            let x = document.getElementById('Weather-Section')
            console.log(x)
            x.insertAdjacentHTML('afterbegin', html)
        }
    }
    alert()

});