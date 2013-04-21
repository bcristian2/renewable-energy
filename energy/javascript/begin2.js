var socket = io.connect();

socket.emit("dataRequest", "-79-69");
socket.emit("closest", "-18160");

socket.on("dataRequest", function(data){
	console.log("cb: dataRequest:"+data);
	log.innerHTML=log.innerHTML.concat(data);
});

socket.on("closest", function(data){
	console.log("cb: closest:"+data);
	log.innerHTML=log.innerHTML.concat(data);
});





//2
function findClosestTo(latitude, longitude){
	//round it off
	//access database to get the closest location to use
}

function begin(latitude, longitude){
	findClosestTo(latitude, longitude);
	latitude = -79;
	longitude =  -69;

	grabData(latitude, longitude);
}


//take 2
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    //begin(position.coords.latitude, position.coords.longitude);
  });
} else {
  alert("geolocation not in navigator");
}