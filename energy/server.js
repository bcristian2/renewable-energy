var http = require('http'); //http server and client functionality
var fs = require('fs'); //filesystemrelayed functionality
var path = require('path'); //fs path related functionality
var mime = require('mime'); //ability to derive a MIME type based on filename extension
var cache = ""; //contents of cached files are stored


//Given a JSON string from the server, determine the number of solar panels and wind turbines required 
function findNumProducts(jsonStr){

	var obj=eval("(" + jsonStr + ')');
	solarMonths=obj["solar"]["value"];
	windMonths=obj["wind"]["value"];

	//minMonth is the lowest value of monthly values
	var minMonth=0;
	var minValue=parseFloat(solarMonths[0])+parseFloat(windMonths[0]);
	for(var i=1; i<12; i++)
	{
		var currValue=parseFloat(solarMonths[0])+parseFloat(windMonths[0]);
		if(currValue<minValue)
		{
			minMonth=i;
			minValue=currValue;
		}
	}

	minSolar=parseFloat(solarMonths[minMonth]);
	minWind=parseFloat(windMonths[minMonth]);
	var numSolarPanels=0;
	var numWindTurbines=0;
	if(minSolar==0)
	{


		//must calculate 335 using only wind
		kwhPerWindTurbine=minWind*20;
		powerGenerated=kwhPerWindTurbine*numWindTurbines;
		while(powerGenerated<335)
		{
			numWindTurbines++;
			powerGenerated=kwhPerWindTurbine*numWindTurbines;
		}
	}
	else if(minWind==0)
	{


		//must calculate 335kWh using only solar
		kwhPerSolarPanel=minSolar*30*1.66*0.15;
		powerGenerated=kwhPerSolarPanel*numSolarPanels;
		while(powerGenerated<355)
		{
			numSolarPanels++;
			powerGenerated=kwhPerSolarPanel*numSolarPanels;
		}
	}
	else
	{


		//Calculate, aiming for 167kWh from solar, 167kWh from wind
		kwhPerWindTurbine=minWind*20;
		powerGenerated=kwhPerWindTurbine*numWindTurbines;
		while(powerGenerated<167)
		{
			numWindTurbines++;
			powerGenerated=kwhPerWindTurbine*numWindTurbines;
		}

		kwhPerSolarPanel=minSolar*30*1.66*0.15;
		powerGenerated=kwhPerSolarPanel*numSolarPanels;
		while(powerGenerated<355)
		{
			numSolarPanels++;
			powerGenerated=kwhPerSolarPanel*numSolarPanels;
		}
	}

	var products={"solarPanels":numSolarPanels,"windTurbines":numWindTurbines};
	return products;
}

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents){
	response.writeHead(
		200,
		{"content-type":mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

function serveStatic(response, cache, absPath){
	//check if file is cached in memory
	if(cache[absPath]) {
		//server file from memory
		sendFile(response, absPath, cache[absPath]);
	} 
	else {
		//check if file exists
		fs.exists(absPath, function (exists){
			if (exists){
				//read file from disk
				fs.readFile(absPath, function (err, data){
					if(err){
						send404(response);
					}
					else {
						//cache
						cache[absPath] = data;
						//and serve file from disk
						sendFile(response, absPath, data);
					}
				})
			} 
			else {
				send404(response);
			}
		});
	}

}


//create httpserver using anon function to define per-request behaviour
var server = http.createServer(function(request, response){
	var filePath = false;

	console.log(request.url);
	if(request.url == '/'){
		filePath = 'index.html'; //serve this as default
	} else {
		filePath =  request.url; //translate url path to relative file path
	}

	var absPath = './' +filePath;
	serveStatic(response, cache, absPath); //serve static file
});

server.listen(8080, function(){
	console.log("   server listening on 8080.");
});

//redis server
var redis = require('redis'),
	client = redis.createClient(6379,'127.0.0.1');

client.on('error', function(err) {
	console.log('Error '+ err);	
});

//put information into database
var lazy = require("lazy");

var file = "./data.json";
new lazy(fs.createReadStream(file))
	.lines
    .forEach(function(line){
    	var data = JSON.parse(line);
     	var value = JSON.stringify(data["properties"]);
     	client.set(data["id"], value);
     }
 );

/*
var file = "./closest.json";
var closest=[];
new lazy(fs.createReadStream(file))
	.lines
    .forEach(function(line){
    	var value = JSON.parse(line);
    	//console.log(value);
    	//console.log(value["value"]);
    	closest[value["key"]]= value["value"];

     }
);
*/
//console.log("HI"+closest["44-79"]);

//socket.io - set up communication between client/server
var socketio = require ('socket.io');
var io = socketio.listen(server);
io.set('log level', 1);

io.sockets.on('connection', function(socket){

	/*
	socket.on("dataRequest", function(location){
		console.log("dataRequest for:"+location);
		client.get(location, function (err, value){
			socket.emit("dataRequest", value);
		});
	});

	socket.on("closest", function(location){
		console.log("closest request for:"+location);
		console.log(" is:"+closest[location]);
		socket.emit("closest", closest[location]);


	});
*/

	socket.on("request", function(original){
		var location = new Object();
		location.latitude = Math.round(original.latitude);
		location.longitude = Math.round(original.longitude);

		console.log("Data request for:"+location.latitude+","+location.longitude);

		var options={
				hostname: 'api.geonames.org',
			
				path: '/oceanJSON?lat='+location.latitude+'&lng='+location.longitude+'&username=mtriff',
				method: 'GET'
		}; 
		//console.log(options);
		//api.geonames.org/oceanJSON?lat=46&lng=46&username=mtriff
		var req=http.request(options, function(res) {
				//console.log(res);
				//console.log('Status:'+res.statusCode);
				res.setEncoding('utf8');
				res.on('data', function (chunk){
					//console.log("callback of res data");
					//console.log(chunk);
					chunk = JSON.parse(chunk);

					if(chunk["ocean"]){
						socket.emit('request', false);
					} else { //valid point, start get random valid location
						var validPoint = new Object();

						function getValidPoint(){
							var random1 = Math.floor(Math.random()*10);
							var random2 = Math.floor(Math.random()*10);
							var latitude = location.latitude + random1;
							var longitude = location.longitude + random2;
							var locationID = String(latitude).concat(String(longitude));
							console.log(locationID);

							client.get(locationID, function(err, value){
								if (err || !value) {
									console.log("no data");
									getValidPoint();
								} else {
									//valid point, parse stuff
									console.log("validPoint");
									console.log(value);
									//value = JSON.parse(value);
									var productsJSON = findNumProducts(value);
									//socket.emit('request',true);
									console.log(productsJSON);
									var result = {
										"id":locationID,
										"latitude":original.latitude,
										"longitude":original.longitude,
										"products":{
											"ocean":false,
											"solarPanels":productsJSON["solarPanels"],
											"windTurbines":productsJSON["windTurbines"]
										},
									};
									socket.emit("request", result);
								}
							});
						}
						getValidPoint();
					}

				});
		});
		req.addListener("response", function (data){
			console.log("SUSCCSES");
			console.log(data);
		});
		req.end();
		
	});
});























