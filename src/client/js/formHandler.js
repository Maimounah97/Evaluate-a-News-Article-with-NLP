
const projectData = {};
const responsesSection = document.querySelector("#responsesSection");
function handleSubmit(event) {
    event.preventDefault();
    // Storing city name in the projectData object
    let tripLoc = document.querySelector("#tripLoc").value;
    projectData.tripLoc = tripLoc;
    //lengthOfTrip function parameters
    let depDate = document.querySelector("#depDate").value;
   
    projectData.depDate = depDate;
     let reDate = document.querySelector("#reDate").value;
     projectData.reDate = reDate;
    projectData.daysAway= lengthOfTrip(reDate, depDate);
     
    //make multiple API call
    try {
        getCityCoordinates(tripLoc)
            .then(function (cityInfo) {
                //getWeatherOfCity function parameters
                const latitude = cityInfo.geonames[0].lat;
                const longitude = cityInfo.geonames[0].lng;
                console.log('latitude : '+latitude+' longitude : '+longitude)
                const date = projectData["depDate"];
                // store country name of city name in projectData object 
                projectData.countryName = cityInfo.geonames[0].countryName;
                // store country code 
                projectData.countryCode = cityInfo.geonames[0].countryCode;
                console.log('countryName : '+ cityInfo.geonames[0].countryName +' countryCode : '+ cityInfo.geonames[0].countryCode);
                // let myTripToCity = document.querySelector("#myTripToCity");
                // let myTripToCountry = document.querySelector("#myTripToCountry");
                // myTripToCity.innerHTML = tripLoc;
                // myTripToCountry.innerHTML = cityInfo.geonames[0].countryName;
                
                // call getWeatherOfCity function to return weather data
                return getWeatherOfCity(latitude, longitude, date);
            }).then(function (weatherInfo) {
                // store maxTemp,minTemp , weatherCondition and weatherIcon data in projectData object 
                projectData.maxTemp = weatherInfo["data"][0]["max_temp"];
                projectData.minTemp = weatherInfo["data"][0]["min_temp"];
                projectData.weatherCondition = weatherInfo["data"]["0"]["weather"]["description"]; 
                projectData.weatherIcon = weatherInfo["data"]["0"]["weather"]["icon"];
                // call getImage function to get city url image
             return getImage(projectData.tripLoc)
            }).then(function (imageInfo) {
                // to store city url Image data in projectData object
                projectData.cityImage = imageInfo["hits"][0]["largeImageURL"];
                
                return postProjectData(projectData);
                // print project data on console
                console.log("project data are : ");
                console.log(projectData);
                //  Update UI 
            }).then(function (projectData) {
                dynamicUpdateUI(projectData);
            })
    } catch (error) {
        console.log("error", error);
    }
}

// get Coordinates of city from geoNames
async function getCityCoordinates(city) {
    const geoNamesUrl = `https://secure.geonames.org/searchJSON?q=${city}&maxRows=10&username=Maimounah97`;
    const response = await fetch(geoNamesUrl, { mode: 'cors' });
    try {
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
    console.log(response);
}
// get weather information
async function getWeatherOfCity(latitude, longitude, date) {
    const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=4f93b973405c43ebb8715ceb397e4beb`;
    const response = await fetch(forecastUrl, { mode: 'cors' })
    try {
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error)
    }
}

//  get city url image from Pixabay
async function getImage(city) {
    const PixaBayApiUrl = `https://pixabay.com/api/?key=18047960-e4eb94ccdf0e75ec1b7c5f7ba&q=${city}&category=places&image_type=photo`;
    const response = await fetch(PixaBayApiUrl, { mode: 'cors' })
    try {
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error)
    }
}

//  post function
async function postProjectData(projectData) {

    const url = 'http://localhost:8081/postData';

    const response = await fetch(url, {
        method: "POST",
        mode: 'cors',
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(projectData)
    });
    try {
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
    
}

// get the difference between two dates
function lengthOfTrip(date1, date2) {
    let fristDate = new Date(date1);
    let secondDate = new Date(date2);
    const differenceInTime = Math.abs(fristDate - secondDate);
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
    return differenceInDays;
}
// get the city image
function getCityImage(imageUrl) {
    cityImage.setAttribute("src", imageUrl);
}
// get the contery flag
function getConteryFlag(countryCode) {

    countryFlags.setAttribute("src", `https://www.countryflags.io/${countryCode}/flat/64.png`);
}

// get the weather icon
function getWeatherIcon(weatherCodeIcon) {
    weatherIcon.setAttribute("src", `https://www.weatherbit.io/static/img/icons/${weatherCodeIcon}.png`);
}


//  update UI and scroll the window
function dynamicUpdateUI(projectData) {
    // translate the display state from none to block
    let trip = document.querySelector("#trip");
    trip.style.display = "block";
    // start to scrll the window
    let tripPos = trip.getBoundingClientRect();
    window.scrollTo({
        top : tripPos.y,
        behavior: "smooth"

    });

    // print the trip information
    let cityImage = document.querySelector("#cityImage");
    let myTripToCity = document.querySelector("#tripLoc");
    let myTripToCountry = document.querySelector("#myTripToCountry");
    let countryFlags = document.querySelector("#countryflags");
    let daysAway = document.querySelector("#daysAway");
    let maxTemp = document.querySelector("#maxTemp");
    let minTemp = document.querySelector("#minTemp");
    let weatherCondition = document.querySelector("#weatherCondition");
    let weatherIcon = document.querySelector("#weatherIcon");
    let dateOfDeparting = document.querySelector("#dateOfDeparting");
    dateOfDeparting.innerHTML = projectData.depDate;
    getCityImage(projectData.cityImage);
     myTripToCity.innerHTML = projectData.tripLoc;
     myTripToCountry.innerHTML = projectData.countryName;
    getConteryFlag(projectData.countryCode);
    daysAway.innerHTML = projectData.daysAway;
    maxTemp.innerHTML = projectData.maxTemp;
     minTemp.innerHTML = projectData.minTemp;
     weatherCondition.innerHTML = projectData["weatherCondition"];
    getWeatherIcon(projectData.weatherIcon);

}



export {
    handleSubmit,
    getCityCoordinates
}
   

