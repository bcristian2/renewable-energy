var socket = io.connect();

socket.on("request", function(data){
	console.log("cb: request:"+data);
	// data=JSON.stringify(data);

	$('#mapInfo').filter(function(){
		var panel = $(this);
		console.log('PRODUCTS:',data['products']);
		var realPlace=reverseLookup(data['latitude'],data['longitude']);
		$(panel, '.details').text(JSON.stringify(data));
		
		isOcean = data['ocean'];

		if (data['products']['solarPanels']) {
			windCard = '<div class="turbine card"><span class="icon">x' + data['products']['solarPanels'] + '</span><h3>Personal Wind Turbine</h3><p>Harness the power of the wind! Sharp blades are a bonus.</p><p class="price">$329 - $1299</p></div>';
			panel.append(windCard);
			// console.log(windCard, panel);
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

		$('#map').css('top',-200);
		$('.overlay').addClass('focus');
	});

});