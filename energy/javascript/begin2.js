var socket = io.connect();

socket.on("request", function(data){
	console.log("cb: request:"+data);
	// data=JSON.stringify(data);

	var distanceFromHome=-1;

	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
				var R = 6371; // km
				var dLat = (data['latitude']-position.coords.latitude).toRad();
				var dLon = (data['longitude']-position.coords.longitude).toRad();
				var lat1 = lat1.toRad();
				var lat2 = lat2.toRad();

				var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				distanceFromHome = R * c;
		});
	}

	$('#mapInfo').filter(function(){
		var panel = $(this);
		console.log(data['products']);
		var realPlace=reverseLookup(data['latitude'],data['longitude']);
		
		isOcean = data['ocean']

		if (data['products']['solarPanels']) {
			windCard = '<div class="turbine card"><span class="icon">x' + data['products']['solarPanels'] + '</span><h3>Personal Wind Turbine</h3><p>Harness the power of the wind! Sharp blades are a bonus.</p><p class="price">$329 - $1299</p></div>';
			panel.append(windCard);
		}

		if (data['products']['windTurbines']) {
			solarCard = '<div class="solar card"><span class="icon">x' + data['products']['windTurbines'] + '</span><h3>Solar Panels</h3><p>Cheaper than wind turbines, but don\'t generate as much power.</p><p class="price">$220 - $899</p></div>';
			panel.append(solarCard);
		}

		if (isOcean) {

		}

		contextHeight = window.innerHeight;
		panel.addClass('display').css('top', contextHeight).animate({
			top: 300
		}, 300, 'easeOutElastic');

		document.getElementById("map").style.marginTop = "-150px";
		
		// console.log('GIVE ME SOMETHING', realPlace,data['latitude'],data['longitude']);

		$(panel, '.title').text(realPlace[0]);
		$(panel, '.details').text(JSON.stringify(data));
	});

});