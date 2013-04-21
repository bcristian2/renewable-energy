var geocoder;

function lookup(address)
{
	geocoder=new google.maps.Geocoder();
	geocoder.geocode({'address':address}, function(results, status){
		if(status==google.maps.GeocoderStatus.OK)
		{
			var list=[];
			for(var i=0; i<5; i++)
			{
				if(results[i])
				{
					list.push(results[i].formatted_address);
					console.log(results[i].formatted_address);
				}
			}
			return list;
		}
	})
}

function reverse(lat, lng)
{
	geocoder=new google.maps.Geocoder();
	var latlng=new google.maps.LatLng(lat, lng);
	geocoder.geocode({'location':latlng}, function(results, status){
		if(status==google.maps.GeocoderStatus.OK)
		{
			var list=[];
			for(var i=0; i<5; i++)
			{
				if(results[i])
				{
					list.push(results[i].formatted_address);
					console.log(results[i].formatted_address);
				}
			}
			return list;
		}
	})
}

function addToSearchList(address)
{
	geocoder=new google.maps.Geocoder();
	geocoder.geocode({'address':address}, function(results, status){
		if(status==google.maps.GeocoderStatus.OK)
		{
			var list=[];
			for(var i=0; i<5; i++)
			{
				if(results[i])
				{
					list.push("<li onclick='console.log(\'adding\'')>"+results[i].formatted_address+"</li>");
					console.log(results[i].formatted_address);
				}
			}
		document.getElementById('searchList').innerHTML=list.join('');
		}
	})
}