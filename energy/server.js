var http = require('http'); //http server and client functionality
var fs = require('fs'); //filesystemrelayed functionality
var path = require('path'); //fs path related functionality
var mime = require('mime'); //ability to derive a MIME type based on filename extension
var cache = ""; //contents of cached files are stored

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
/*
var file = "./data.json";
new lazy(fs.createReadStream(file))
	.lines
    .forEach(function(line){
    	var data = JSON.parse(line);
     	var value = JSON.stringify(data["properties"]);
     	client.set(data["id"], value);
     }
 );
*/
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
//console.log("HI"+closest["44-79"]);

//socket.io - set up communication between client/server
var socketio = require ('socket.io');
var io = socketio.listen(server);
io.set('log level', 1);

io.sockets.on('connection', function(socket){

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
});


/*
client.set('color', 'red', redis.print);
client.get('color', function(err, value) {
	if (err) throw err;
	console.log('Got: ' + value);
});
*/




















