function getData(latitude, longitude){
  //round it off
  //access db, look for data at location
  //return json object
  var _latitude = Math.round(latitude);
  var _longitude = Math.round(longitude);
  //var byId = longitude*latitude; //TODO: fix this
  //return taffydb({id:byId});
}
function checkIfCity(latitude, longitude){
  //access db that has locations of cities
  //is location one of these locations?
  //return true/false
  var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&sensor=true";
  $.getJSON(
    url,
    function(data){
      console.log(data);
    });

}

function processCity(data){
  //get solar data
  //get roof top area
  //energyProducedBySolar(solarData, roofTopArea)

}
function processRural(data){
  //constant total area
  //equation: windspeed(turbine)(area) + (solar)(solarpanel)(totalarea-area)
  //derivative of the equation equal to zero, find the max "area" variable
  //plug it back into equation to get the most energy produced
}

function canSurvive(latitude, longitude) {

  console.log("Begin at: "+latitude + "," + longitude); //some location that is on the grid

  var isCity = checkIfCity(latitude, longitude);
  var data = getData(latitude, longitude)
  if (isCity) {
    //processCity(latitude,);
  } else { //rural
    processRural(data);
  }

}


function IsHighlyPopulated ( latitude, longitude){
  //get population density given lat and long
  //if population is > x return true
  //else return false
}

function produceEnergy (latitude, longitude){
  if (IsHighlyPopulated(latitude,longitude)) {
    return false;
  }
  //return energyProduced by this area

}












function findNearestArea(latitude, longitude){
  console.log(latitude, longitude);
  latitude = Math.round(latitude);
  longitude = Math.round(longitude);


  //var max energy, final lat, final long
  //for each box adjacent to lat, long
    //check if highlypopulated,
      //else check how much energy can be produced

    //if max energy is greater than required, we're done and return max energy, final lat and final long

}

if ("geolocation" in navigator) {
/* geolocation is available */
navigator.geolocation.getCurrentPosition(function(position) {
  longitude = position.coords.longitude;
  latitude  = position.coords.latitude;
  console.log("positions1:" + latitude + "," + longitude);

});
} else {
  alert("geolocation not in navigator");
}







































  
