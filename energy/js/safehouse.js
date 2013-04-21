$(document).ready(function() {
        window.addEventListener('load', function() {
        new FastClick(document.body);
        }, false);

    var submitButton = document.getElementById('geolocateButton');
	submitButton.addEventListener('click', geolocate, false);

    function geolocate() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(function(position) {
				beginMap(position.coords.latitude, position.coords.longitude);
			});
		} else {
			alert("geolocation not in navigator");
			beginMap(41,-81);
		}
	}

	//used when geolocation is disabled
	//beginMap(41,-81);

	function beginMap (latitude, longitude) {
		var markLat = latitude;
		var markLong = longitude;

		console.log("beginMap"+markLat+","+markLong);
		var map = L.map('map',{zoomControl:false}).setView([markLat, markLong],3);
	
		var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
			key: 'BC9A493B41014CAABB98F0471D759707',
			styleId: 53589
		}).addTo(map);


		L.geoJson(statesData).addTo(map);


		var greenIcon = L.icon({
		    iconUrl: 'images/marker.png',

		    iconSize:     [30, 48], // size of the icon
		    iconAnchor:   [15, 48], // point of the icon which will correspond to marker's location
		    popupAnchor:  [15, 0] // point from which the popup should open relative to the iconAnchor
		});

		var userLocation = L.icon({
			iconSize: 	[12, 12],
			iconAnchor: [6, 6],
			className: 	'userLocation',
			iconUrl: 	'images/userLocation.png'
		})

		new L.marker([markLat, markLong], {icon: userLocation}).addTo(map);


		var marker = L.marker([markLat, markLong], {icon: greenIcon}).addTo(map);
		var circle = L.circleMarker([markLat, markLong], 1000, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5
		}).addTo(map);

		


		L.geoJson(statesData, {style: style}).addTo(map);

		var geojson = L.geoJson(statesData, {
		    style: style,
		    onEachFeature: onEachFeature
		}).addTo(map);

		var info = L.control();

		info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};

		// method that we will use to update the control based on feature properties passed
		info.update = function (props) {
			this._div.innerHTML = (props ?
	        '<b>' + props.name + '</b><br />' : ' ');
		};

		info.addTo(map);

		map.on('click', function(e) {
		    marker.setLatLng(e.latlng);
		    marker.update();

		    map.setView(e.latlng, 5);
		    circle.setLatLng(e.latlng);
		});

		map.on('dragstart', function(e) {

		});

		map.on('drag', function(e) {
			var center = map.getCenter();
			circle.setLatLng(marker.getLatLng());
			marker.setLatLng(center);
		    marker.update();

		});

		map.on('dragend', function(e) {
			console.log("marker set to",marker.getLatLng());
			circle.setLatLng(marker.getLatLng());
			finalize();
		});



		

		function style(feature) {
			//var windValue = parseInt(feature.properties.wind.value);
			//var solarValue = parseInt(feature.properties.solar.value);
			//var grade = ((windValue + solarValue)/2);
			//console.log(grade);
		    return {
		        fillColor: '#2984b1',
		    	color:'#2984b1',
		    	weight:2,
		    	dashArray: '3',
		        opacity: 1,
		        fillOpacity: 1
		    };
		}




		function highlightFeature(e) {
		    var layer = e.target;
		    info.update(layer.feature.properties);
		    layer.setStyle({
		        fillColor: '#2984b1',
		    	color:'#2984b1',
		    	weight:2,
		    	dashArray: '3',
		        opacity: 1,
		        fillOpacity: 1
		    });

		    if (!L.Browser.ie && !L.Browser.opera) {
		        layer.bringToFront();
		    }
		}


		function toggleDisplay(e) {
			// alert(layer.feature.properties.name);
			var layer = e.target;
			console.log('HEY:'+layer.feature.properties.name);
			var latitude = layer.feature.properties.latitude;
			var longitude = layer.feature.properties.longitude;

			//html: <b>Latitude:</b> 1.00<br/>
			//		<b>Longitude:</b> 1.00
			var location = "<b>Latitude:</b> " + latitude + "<br/>" + "<b>Longitude:</b> " + longitude + "<br/>";

			var windValue = layer.feature.properties.wind.value;
			var windUnits = layer.feature.properties.wind.units;

			//html: Availiable Wind Energy: <b>Value</b> 2.00 km/hr<br/>
			var windInfo = "<b>Available Wind Energy:</b><br/>" + '<b class="value">Value:</b> ' + windValue + " " + windUnits + "<br/>";

			var solarValue = layer.feature.properties.solar.value;
			var solarUnits = layer.feature.properties.solar.units;

			//html: Availiable Solar Energy: <b>Value</b> 2.00 kw/hr<br/>
			var solarInfo = "<b>Available Solar Energy:</b><br/>" + '<b class="value">Value:</b> ' + solarValue + " " + solarUnits;

			var innerHTML = location + windInfo + solarInfo;
			console.log(innerHTML);

			var srcElement = document.getElementById('moreInfo');
			var srcElement2 = document.getElementById('stateName');
			if(srcElement != null) {
				if(srcElement.className == "moreInfo hidden") {
					srcElement2.innerHTML = innerHTML;
			    	srcElement.className = "moreInfo show";
			    }
			    else if(srcElement.className == "moreInfo show" &&  stateName != srcElement2.innerHTML) {
					srcElement2.innerHTML = innerHTML;
			    }
			    else if(srcElement.className == "moreInfo show") {
			    	srcElement.className = "moreInfo hidden";
			    }
			}
		}

		function resetHighlight(e) {
		    geojson.resetStyle(e.target);
		    info.update();
		}


		function onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: highlightFeature,
		        mouseout: resetHighlight,
		        click: toggleDisplay
		    });
		}

		function finalize(e) {

			console.log("FINALIZE CALLED");
			
			var center = map.getCenter();
			console.log('finalizing coordinates at ', center);
			map.setView(center, 5);
			var location = new Object();
			console.log("finalizelat:", center.lat);
			console.log("finalizelng:", center.lng);

			//location.latitude  = Math.round(center.lat);
			//location.longitude = Math.round(center.lng);
			location.latitude = center.lat;
			location.longitude = center.lng;
			socket.emit("request", location);
			
		}

		function moreInfo(e) {
			//fill innerHTML for mapInfo 
			var srcElement = getElementById('mapInfo');

			var layer = e.target;
			var latitude = layer.latitude;
			var longitude = layer.longitude;

			var genInfo = '<p>'+latitude+'E, '+longitude+'S</p>';

			var ocean = layer.products.ocean;
			if(ocean){
				srcElement.innerHTML = genInfo+'<div class="ocean card">Yo dawg you\'re in the ocean bro. That\'s kinda smart \'cause you\'re assuming they can\'t swim but boy are you ever wrong...</div>';
			}
			else {
				var numSolar = layer.products.solarPanels;
				var numWind = layer.products.windTurbines;


				/*<div class="turbine card">
		          <span class="icon"></span>
		          <h3>Personal Wind Turbine</h3>
		          <p>This shit will give you so much god damn energy it's just completely whack.</p>
		          <div class="count">x3</div>
		        </div>*/
				var windCard = '<div class="turbine card"><span class="icon"></span><h3>Personal Wind Turbine</h3><p>This shit will give you so much god damn energy it\'s just completely whack.</p>' + '<div class="count">x' + numWind + '</div></div>';
				var solarCard = '<div class="solar card"><span class="icon"></span><h3>Personal Wind Turbine</h3><p>This shit will give you so much god damn energy it\'s just completely whack.</p>' + '<div class="count">x' + numSolar + '</div></div>';

				srcElement.innerHTML = genInfo + windCard + solarCard;
			}

		}

	}

	function goToPlace(address)
	{
		geocoder=new google.maps.Geocoder();
		geocoder.geocode({'address':address}, function(results, status){
			if(status==google.maps.GeocoderStatus.OK)
			{
				if(results[0])
				{
					console.log("Going to address:"+address);
					marker.setLatLng(results[0].geometry.location);
					marker.update();
					finalize();
				}
			}
		});
	}
     

    function getMarkerPosition()
    {
    	return marker.getLatLng();
    } 
});

