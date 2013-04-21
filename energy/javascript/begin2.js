var socket = io.connect();

//socket.emit("dataRequest", "-79-69");
//socket.emit("closest", "-18160");

socket.on("dataRequest", function(data){
	console.log("cb: dataRequest:"+data);
	log.innerHTML=log.innerHTML.concat(data);
});

socket.on("closest", function(data){
	console.log("cb: closest:"+data);
	log.innerHTML=log.innerHTML.concat(data);
});



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
		}

		kwhPerSolarPanel=minSolar*30*1.66*0.15;
		powerGenerated=kwhPerSolarPanel*numSolarPanels;
		while(powerGenerated<355)
		{
			numSolarPanels++;
		}
	}

	var products={"solarPanels":numSolarPanels,"windTurbines":numWindTurbines};

	return products;
}


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