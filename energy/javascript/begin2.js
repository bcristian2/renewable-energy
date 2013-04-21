var socket = io.connect();

socket.on("request", function(data){
	console.log("cb: request:"+data);
	// data=JSON.stringify(data);

	$('#mapInfo').filter(function(){
		var panel = $(this);
		console.log(reverse);
		$(panel, '.title').text('geocoded name');
		$(panel, '.details').text(JSON.stringify(data));
		
		numWind = data['products']['solarPanels'];
		numSolar = data['products']['windTurbines'];

		if (numWind) {
			windCard = '<div class="turbine card"><span class="icon">x' + numWind + '</span><h3>Personal Wind Turbine</h3><p>Harness the power of the wind! Sharp blades are a bonus.</p></div>';
			panel.append(windCard);
		}

		if (numSolar) {
			solarCard = '<div class="solar card"><span class="icon">x' + numSolar + '</span><h3>Solar Panels</h3><p>Cheaper than wind turbines, but don\'t generate as much power.</p></div>';
			panel.append(solarCard);
		}

		contextHeight = window.innerHeight;
		panel.addClass('display').css('top', contextHeight).animate({
			top: 300
		}, 300, 'easeOutElastic');

		document.getElementById("map").style.marginTop = "-150px";
	});

});