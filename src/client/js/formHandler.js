
const submit = document.querySelector("#save");

// popup message


submit.addEventListener("click", handleSubmit);

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
                // to store country name of city name in projectData object 
                projectData.countryName = cityInfo.geonames[0].countryName;
                // to store country code used later on to show flag of country
                projectData.countryCode = cityInfo.geonames[0].countryCode;
                console.log('countryName : '+ cityInfo.geonames[0].countryName +' countryCode : '+ cityInfo.geonames[0].countryCode);
                let myTripToCity = document.querySelector("#myTripToCity");
                let myTripToCountry = document.querySelector("#myTripToCountry");
                myTripToCity.innerHTML = tripLoc;
                myTripToCountry.innerHTML = cityInfo.geonames[0].countryName;
                
                // call getWeatherOfCity function to return weather data
                return getWeatherOfCity(latitude, longitude, date);
            }).then(function (weatherInfo) {
                // store maxTemp,minTemp and weatherCondition data in projectData object 
                projectData.maxTemp = weatherInfo["data"][0]["max_temp"];
                projectData.minTemp = weatherInfo["data"][0]["min_temp"];
                projectData.weatherCondition = weatherInfo["data"]["0"]["weather"]["description"];
                // store weather code icon to show icon of weather later on 
                projectData.weatherIcon = weatherInfo["data"]["0"]["weather"]["icon"];
                
             return getImage(projectData.tripLoc)
            }).then(function (imageInfo) {
                // to store city url Image data in projectData object
                projectData.cityImage = imageInfo["hits"][0]["largeImageURL"];
                
                return postProjectData(projectData);
                console.log("project data are : ");
                console.log(projectData);
            }).then(function (projectData) {
                // to Update UI view
                dynamicUpdateUI(projectData);
            })
    } catch (error) {
        console.log("error", error);
    }
}

// Function to get Coordinates of city from geoNames
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

// Async function to get data from Pixabay
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

//Function to get the difference between two dates
function lengthOfTrip(date1, date2) {
    let fristDate = new Date(date1);
    let secondDate = new Date(date2);
    const differenceInTime = Math.abs(fristDate - secondDate);
    //console.log(differenceInTime);
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
    return differenceInDays;
}
//Function to get the city image
function getCityImage(imageUrl) {
    cityImage.setAttribute("src", imageUrl);
}
//Function to get the contery flag
function getConteryFlag(countryCode) {

    countryFlags.setAttribute("src", `https://www.countryflags.io/${countryCode}/flat/64.png`);
}

//Function to get the weather icon
function getWeatherIcon(weatherCodeIcon) {
    weatherIcon.setAttribute("src", `https://www.weatherbit.io/static/img/icons/${weatherCodeIcon}.png`);
}
// function toggle(){
//      var blur = document.getElementById('blur');
//      blur.classList.toggle('active')
//     var popup = document.getElementById('popup');
//     popup.classList.toggle('active')
  
//   }

// Function to update UI
function dynamicUpdateUI(projectData) {
    document.getElementById("trip").style.display = "block";
    console.log("data in d ui ");
    console.log(projectData);
    //responsesSection.remove("hidden");
    let cityImage = document.querySelector("#cityImage");
    let myTripToCity = document.querySelector("#tripLoc");
    let myTripToCountry = document.querySelector("#myTripToCountry");
    let countryFlags = document.querySelector("#countryflags");
   // let dateOfDeparting = document.querySelector("#dateOfDeparting");
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
     //dateOfDeparting.innerHTML = data[3];
    daysAway.innerHTML = projectData.daysAway;
    maxTemp.innerHTML = projectData.maxTemp;
     minTemp.innerHTML = projectData.minTemp;
     weatherCondition.innerHTML = projectData["weatherCondition"];
    getWeatherIcon(projectData.weatherIcon);

}
let removeBtn = document.querySelector("#remove");
let trip = document.querySelector("#trip");
removeBtn.addEventListener("click", remove);
function remove (){

trip.remove();
}


export {
    handleSubmit,
    getCityCoordinates
}
   

