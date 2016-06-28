

// Detect user location

// $.get("https://ipinfo.io", function(response) {
//     console.log(response.country);
//     userLocation = response.country;
// }, "jsonp");

// Add countries to dropdown 

// $.get("https://climatedataapi.worldbank.org/climateweb/rest/v1/country/", function(response) {
// 	console.log(response);
// })

// function jsonCallback(json){
//   console.log(json);
// }

// $.ajax({
//   url: "https://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualavg/bccr_bcm2_0/b1/tas/2080/2099/fra.json?callback=handler",
//   dataType: "jsonp"
// });

var userLocation

// Detect user location

$.get("http://ipinfo.io", function(response) {
    console.log(response.country);
    userLocation = response.country;
}, "jsonp");

// Add countries to dropdown 

// $.get("http://climatedataapi.worldbank.org/climateweb/rest/v1/country/", function(response) {
// 	console.log(response);
// })

$.getJSON('http://cors.io/?u=http://climatedataapi.worldbank.org/climateweb/rest/v1/country/', function(response) {
	console.log(response);
})
