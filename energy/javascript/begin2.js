var socket = io.connect();

socket.on("request", function(data){
	console.log("cb: request:"+data);
	// data=JSON.stringify(data);

	var distanceFromHome=-1;

	if ("geolocation" in navigator) {
		console.log('Find distance');
		navigator.geolocation.getCurrentPosition(function(position) {
				if (typeof(Number.prototype.toRad) === "undefined") {
				  Number.prototype.toRad = function() {
				    return this * Math.PI / 180;
				  }
				}

				var R = 6371; // km
				var dLat = (data['latitude']-position.coords.latitude)*Math.PI/180;
				var dLon = (data['longitude']-position.coords.longitude)*Math.PI/180;
				var lat1 = position.coords.latitude*Math.PI/180;
				var lat2 = data['latitude']*Math.PI/180;
				console.log("mid");
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				distanceFromHome = R * c;
				console.log(distanceFromHome);

				computeCards(data, distanceFromHome);
		});
	}

});

function computeCards(data, distanceFromHome)
{
		reverseLookup(data['latitude'],data['longitude'],computeCardsHelp, data, distanceFromHome);
}

function computeCardsHelp(data, distanceFromHome, realPlace)
{
	$('#mapInfo').filter(function(){
		var panel = $(this);

		console.log('PRODUCTS:',data['products']);
		
		isOcean = data['ocean'];

		var titleArr=realPlace[0].split(',');
		var short_title=titleArr.slice(0,2);
		var long_title=titleArr.slice(2,realPlace[0].length);

		$(panel, '.title').html('<h2>'+short_title+'</h2><p>'+long_title+'</p>');
		// distanceFromHome.toFixed(2);
		panel.prepend('<div class="stats"><p class="distance">'+distanceFromHome.toFixed(2)+'<small>km</small></p></div>');

		if (data['products']['solarPanels']) {
			console.log("wind");
			windCard = '<div class="turbine card"><span class="icon">x' + data['products']['solarPanels'] + '</span><h3>Personal Wind Turbine</h3><p>Harness the power of the wind! Sharp blades are a bonus.</p><p class="price">$329 - $1299</p></div>';
			panel.append(windCard);
			// console.log(windCard, panel);
		}

		if (data['products']['windTurbines']) {
			console.log("solar");
			solarCard = '<div class="solar card"><span class="icon">x' + data['products']['windTurbines'] + '</span><h3>Solar Panels</h3><p>Cheaper than wind turbines, but don\'t generate as much power.</p><p class="price">$220 - $899</p></div>';
			panel.append(solarCard);
		}

		if (isOcean) {

		}

		contextHeight = window.innerHeight;
		panel.addClass('display').css('top', contextHeight).animate({
			top: 300
		}, 300, 'easeOutElastic');

		$('#map').addClass('focused');//css('top',-150);
		$('.overlay').addClass('focus');
		// document.getElementById("map").style.marginTop = "-150px";
		
		// console.log('GIVE ME SOMETHING', realPlace,data['latitude'],data['longitude']);
	console.log("DISTANCE!", distanceFromHome);

		console.log(panel)
	});

}
