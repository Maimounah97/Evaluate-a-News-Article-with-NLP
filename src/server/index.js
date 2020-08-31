var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
var bodyParser = require('body-parser')
var cors = require('cors')


var json = {
    'title': 'test json response',
    'message': 'this is a message',
    'time': 'now'
}

const fetch = require('node-fetch');


const app = express()
app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(express.static('dist'))
console.log(__dirname)

app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})



app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.get('/test', function (req, res) {
    res.json(mockAPIResponse);
})


// Setup empty JS object 
const projectData = {};

// post the url 
app.post('/postData', addData)

  function addData (req, res) {
    let newData = req.body;
    projectData.cityImage = newData.cityImage;
    projectData.tripLoc = newData.tripLoc;
    projectData.depDate = newData.depDate;
    projectData.countryName = newData.countryName;
    projectData.countryCode = newData.countryCode;
    projectData.daysAway = newData.daysAway;
    projectData.maxTemp = newData.maxTemp;
     projectData.minTemp = newData.minTemp;
     projectData.weatherCondition = newData.weatherCondition;
     projectData.weatherIcon = newData.weatherIcon;
    res.send(projectData);
    

   }
