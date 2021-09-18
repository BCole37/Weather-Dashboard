var cityList =$("#city-list");
var cities = [];
var key = "b88dc539169faaad2eecac0f3eedf1be";

//Formats the Day as example shows
function FormatDay(date){
    var date = new Date();
     
    var dayOutput = "(" + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + ")"
    return dayOutput;
}


function storeCities(){
   // put cities to torage in an array
  localStorage.setItem("cities", JSON.stringify(cities));
  console.log(localStorage);
}

//Shows the cities in added order
function showCities() {
    // Empties the cities so their isnt a duplication every time a search is done
    cityList.empty();

    // makes a new list element for each added City
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      
      var li = $("<li>").text(city);
      li.attr("id","listCity");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      console.log(li);
      cityList.prepend(li);
    }
    //Makes sure that only the entered city is ran
    if (!city){
        return
    } 
    else{
        getWeather(city)
    };
}   

  // When the addcity button is clicked 
  $("#add-city").on("click", function(event){

    // Gets the text input for the search
    var city = $("#city-input").val().trim();

    // Makes sure the search is not empty
    if (city === "") {
        return;
    }
    // push adds to the list
    cities.push(city);
    // puts the cities to local storage and then shows them
  storeCities();
  showCities();
  });

 // gets the weather
  function getWeather(cityName){
      // cityname and my API key put into the URL
    var cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key; 

    //empties the weather Box
    $("#today-weather").empty();

    // gets the api from the cityURL
    fetch(cityURL)
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
        
        // makes the input box blank for user convinience
        $('#city-input').val('');


      // Makes a new row That adds date, temp ,etc. to page
      cityTitle = $("<h3>").text(data.name + " "+ FormatDay());
      $("#today-weather").append(cityTitle);
      var tempeture = parseInt((data.main.temp)* 9/5 - 459);
      var cityTemperature = $("<p>").text("Tempeture: "+ tempeture + "F");
      $("#today-weather").append(cityTemperature);
      var WindSpeed = $("<p>").text("Wind Speed: "+ data.wind.speed + "MPH");
      $("#today-weather").append(WindSpeed);
      var humidity = $("<p>").text("Humidity: "+ data.main.humidity + "%");
      $("#today-weather").append(humidity);

      //variables to get UV
      var Lon = data.coord.lon;
      var Lat = data.coord.lat;

        //Api call for UV index from coordinates
        var cordURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+ key+ "&lat=" + Lat +"&lon=" + Lon;
        fetch(cordURL)
        .then(function (response) {
            return response.json();
        })
        .then(function(dataUV) {

            // formats the UV
            var cityUV = $("<span>").text(dataUV.value);
            var cityUVp = $("<p>").text("UV Index: ");
            cityUVp.append(cityUV);
            $("#today-weather").append(cityUVp);
            console.log(typeof dataUV.value);

            // If statement for the UV color that escalates from good to bad
            if(dataUV.value > 0 && dataUV.value <=2){
                cityUV.attr("class","darkgreen")
            }
            else if (dataUV.value > 2.5 && dataUV.value <= 6){
                cityUV.attr("class","yellow")
            }
            else if (dataUV.value >6 && dataUV.value <= 8){
                cityUV.attr("class","orange")
            }
            else{
                cityUV.attr("class","red")
            }
          
        });
        
     
        //Api call for forcast
        var forcastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
        fetch(forcastURL)
        .then(function (response) {
            return response.json();
        })
        .then(function(dataDay) { 
            // clears the forcast
            $("#boxes").empty();

            
            for(var i=0, j=0; j<=4; i=i+7){
                // adds in the new box for each day
                    var fivedayForcast = $("<div>");
                    fivedayForcast.attr("class","col-2")
                    var d = new Date(0); 
                    d.setUTCSeconds(dataDay.list[i].dt);
                    var date = d;
                    var dayOutput = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() 
                    var fiveday = $("<h6>").text(dayOutput);
                    //Set src to the imags
                    var img = $("<img>");
                    var skyconditions = dataDay.list[i].weather[0].main;
                    //goes through and adds the appropriate img for weather
                    if(skyconditions==="Clear"){
                        img.attr("src", "https://img.icons8.com/summer.png")
                    } else if(skyconditions==="Clouds"){
                        img.attr("src", "https://img.icons8.com/cloud.png")
                    }else if(skyconditions==="Rain"){
                        img.attr("src", "https://img.icons8.com/rain.png")
                    }

                    var temp = dataDay.list[i].main.temp;
                    console.log(skyconditions);

                    // reterving conditions
                    var Tempurate = parseInt((temp)* 9/5 - 459);
                    var dayTemp = $("<p>").text("Tempeture: "+ Tempurate + "F");
                    var dayWind = $("<p>").text("Wind: "+ dataDay.list[i].wind.speed + "MPH");
                    var dayHumidity = $("<p>").text("Humidity: "+ dataDay.list[i].main.humidity + "%");

                    // adds in all the changes to the forecast
                    fivedayForcast.append(fiveday);
                    fivedayForcast.append(img);
                    fivedayForcast.append(dayTemp);
                    fivedayForcast.append(dayWind);
                    fivedayForcast.append(dayHumidity);
                    $("#boxes").append(fivedayForcast);
                    j++;                     
        }
      
    });
      

    });
    
  }

  //gets data if a previous location is clicked
  $(document).on("click", "#listCity", function() {
    var thisCity = $(this).attr("data-city");
    getWeather(thisCity);
  });

