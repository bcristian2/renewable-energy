var socket = io.connect();

socket.on("request", function(data){
	console.log("cb: request:"+data);
	data=JSON.stringify(data);
	log.innerHTML=log.innerHTML.concat(data);

	var someid = document.getElementById("textbox1");
	someid.innerHTML = data.field;

});



