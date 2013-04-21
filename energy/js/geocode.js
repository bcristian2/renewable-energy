var geocoder;

function lookup(address)
{
	geocoder=new google.maps.Geocoder();
	geocoder.geocode({'address':address}, function(results, status){
		if(status==google.maps.GeocoderStatus.OK)
		{
			list="";
			for(var i=0; i<5; i++)
			{
				if(results[i])
				{
					return results[i].formatted_address;
				}
			}
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
			list="";
			for(var i=0; i<5; i++)
			{
				if(results[i])
				{
					return results[i].formatted_address;
				}
			}			
		}
	})	
}