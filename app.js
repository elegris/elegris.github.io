var userLocation

// Detect user location

// $.get("https://ipinfo.io", function(response) {
//     console.log(response.country);
//     userLocation = response.country;
// }, "jsonp");

// Add countries to dropdown 

// $.get("https://climatedataapi.worldbank.org/climateweb/rest/v1/country/", function(response) {
// 	console.log(response);
// })

function jsonCallback(json){
  console.log(json);
}

$.ajax({
  url: "http://climatedataapi.worldbank.org/climateweb/rest/v1/country?callback=handler",
  dataType: "jsonp"
});