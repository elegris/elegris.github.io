var userLocation

// Detect user location

$.get("http://ipinfo.io", function(response) {
    console.log(response.country);
    userLocation = response.country;
}, "jsonp");

// Add countries to dropdown 

$.get("http://climatedataapi.worldbank.org/climateweb/rest/v1/country/", function(response) {
	console.log(response);
})