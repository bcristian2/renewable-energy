var socket = io.connect();

socket.on("request", function(data){
	console.log("cb: request:"+data);
	data=JSON.stringify(data);
	console.log(data);

});



