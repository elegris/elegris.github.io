// Initialize Firebase and set up countries database
var config = {
    apiKey: "AIzaSyCHfY_Lq_XPr4C3vTkUssS5N93KMqpDLyU",
    authDomain: "helloclimate-11bbf.firebaseapp.com",
    databaseURL: "https://helloclimate-11bbf.firebaseio.com",
    storageBucket: "helloclimate-11bbf.appspot.com",
};

firebase.initializeApp(config);

var firebaseDB = firebase.database();
var countriesInFirebase = firebaseDB.ref('countries');

// Detect user location for some custom text in the header

$.get("https://accesscontrolalloworiginall.herokuapp.com/http://ipinfo.io", function(response) {
    userLocation = response.country;
    if (userLocation === "US" || userLocation === "UK") {
    	userLocation = "the " + userLocation + " or another country around the world"
    } else { 
    	userLocation = userLocation + "or another country around the world"
    }

    $('#userLocation').empty();
    $('#userLocation').append(userLocation);
}, "jsonp");

// Set some variables for later use

var currentCountry;
var futureTempSpan = $('#futureAvg');
var currentTempSpan = $('#currentAvg');
var climateChangeSpan = $('#climateChange');
var countryNameSpan = $('#countryName');
var countryNameSpan2 = $('#countryName2');
var selectedCountriesList = $('.selectedCountriesList');
var currentTemp;
var futureTemp;
var climateChange;

// Add countries to the dropdown

function countryToDropdownHTML(country) {
	return '<option value="' + country.iso3 + '">' + country.name + '</option>';
}

function getCountries() {
	$.get("https://accesscontrolalloworiginall.herokuapp.com/http://climatedataapi.worldbank.org/climateweb/rest/v1/country/", function(res) {
		var countryArray = res;
		$('#country-dropdown').empty();
		countryArray.forEach(function(element) {
			var tempHTML = countryToDropdownHTML(element);
			$('#country-dropdown').append(tempHTML);
		})
	})
}

getCountries();

// Function to convert Celsius to Fahrenheit
function celsiusToFahr(cels) {
	var fahr = (cels * 1.8) + 32;
	return fahr;
}; 

// Function to round off number to one decimal pt and add unit label (**NOTE** This yields a string)
function roundOff(num) {
	var roundedNum = ((Math.round(num * 10) / 10).toFixed(1) + "\xB0 F");
	return roundedNum;
}

// Function to append stuff to spans on the page
function appendData(data, span) {
	span.empty();
	span.append(data);
}

// Function to call APIs
function getData(currentUrl, futureUrl) {
	$.get(currentUrl, function(res) {
		var x = (res.length - 1);
		var tempCelsius = res[x].data;
		currentTemp = roundOff(celsiusToFahr(tempCelsius));
		appendData(currentTemp, currentTempSpan);

		$.get(futureUrl, function(res) {
			var futureTempCelsius = res[0].annualVal;
			futureTemp = roundOff(celsiusToFahr(futureTempCelsius));
			appendData(futureTemp, futureTempSpan);

			climateChange = roundOff(celsiusToFahr(futureTempCelsius) - celsiusToFahr(tempCelsius));
			appendData(climateChange, climateChangeSpan);
		});
	});
} 

$('button').on('click', function(event) {
	// Unhide all the data fields 
	$('ul').removeClass('hidden');
	$('p').removeClass('hidden');
	$('div').removeClass('hidden');
	
	// Grab the selected country ISO3 code for constructing API url
	currentCountry = $('#country-dropdown').val();
	
	// Add selected country name as text throughout page, dealing with the many grammatical issues
	var selectedCountryName = $("#country-dropdown>option:selected").text();
	if (selectedCountryName === "British Virgin Islands (U.K.)" || selectedCountryName === "Cayman Islands (U.K.)" || selectedCountryName === "Cocos (Keeling) Islands (Aus.)" || selectedCountryName === "Comoros" || selectedCountryName === "Cook Islands (N.Z.)" || selectedCountryName === "Czech Republic" || selectedCountryName === "Dominican Republic" || selectedCountryName === "Faroe Islands (Den.)" || selectedCountryName === "Glorioso Islands (Fr.)" || selectedCountryName === "Isle of Man (U.K.)" || selectedCountryName === "Kyrgyz Republic" || selectedCountryName === "Maldives" || selectedCountryName === "Marshall Islands" || selectedCountryName === "Netherlands Antilles (Neth.)" || selectedCountryName === "Northern Mariana Islands (U.S.)" || selectedCountryName === "Philippines" || selectedCountryName === "Pitcairn Islands (U.K.)" || selectedCountryName === "Seychelles" || selectedCountryName === "Slovak Republic" || selectedCountryName === "Solomon Islands" || selectedCountryName === "Turks and Caicos Islands (U.K.)" || selectedCountryName === "U.S. Virgin Islands (U.S.)" || selectedCountryName === "United Arab Emirates" || selectedCountryName === "United Kingdom" || selectedCountryName === "United States" || selectedCountryName === "West Bank and Gaza") {
		selectedCountryName = "the " + selectedCountryName;
	} else if (selectedCountryName === "Bahamas, The") {
		selectedCountryName = "the Bahamas"
	} else if (selectedCountryName === "Congo, Democratic Republic of") {
		selectedCountryName = "the Democratic Republic of Congo"
	} else if (selectedCountryName === "Egypt, Arab Republic of") {
		selectedCountryName = "Egypt"
	} else if (selectedCountryName === "Falkland Islands (U.K.) / (Islas Malvina") {
		selectedCountryName = "the Falkland Islands"
	} else if (selectedCountryName === "Gambia, The") {
		selectedCountryName = "the Gambia"
	} else if (selectedCountryName === "Korea, Democratic Peoples Republic of") {
		selectedCountryName = "North Korea"
	} else if (selectedCountryName === "Korea, Republic of") {
		selectedCountryName = "South Korea"
	} else if (selectedCountryName === "Lao, People's Democratic Republic of") {
		selectedCountryName = "Laos"
	} else if (selectedCountryName === "Macedonia, FYR") {
		selectedCountryName = "Macedonia"
	} else if (selectedCountryName === "Micronesia, Federated States of") {
		selectedCountryName = "Micronesia"
	} else if (selectedCountryName === "Netherlands, The") {
		selectedCountryName = "Netherlands"
	} else if (selectedCountryName === "Syrian Arab Republic") {
		selectedCountryName = "Syria"
	} else if (selectedCountryName === "SÃ£o TomÃ© and PrÃ­ncipe") {
		selectedCountryName = "Sao Tome and Principe"
	} else if (selectedCountryName === "Yemen, Republic of") {
		selectedCountryName = "Yemen"
	}

	appendData(selectedCountryName, countryNameSpan);
	appendData(selectedCountryName, countryNameSpan2);

	// push selected country to firebase
	countriesInFirebase.push({
		name: selectedCountryName
	});

	// Grab the selected SRES scenario
	var selectedScenario = $('#sres-scenario').val();
	
	// Construct the API urls
	futureClimateUrl = ("https://accesscontrolalloworiginall.herokuapp.com/http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualavg/ensemble/" + selectedScenario + "/50/tas/2080/2099/" + currentCountry + ".json");
	currentClimateUrl = ("https://accesscontrolalloworiginall.herokuapp.com/http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/tas/year/" + currentCountry + ".json");
	
	getData(currentClimateUrl, futureClimateUrl);
});

// Generate 10 most recently selected countries and append to ul

firebaseDB.ref('countries').on('value', function(res) {
	selectedCountriesList.empty();

	var lastTenCountries = res.val();
	var weirdIds = Object.keys(lastTenCountries);

	for (i = (weirdIds.length - 1); i > (weirdIds.length - 11); i--) {
		var key = weirdIds[i];
		var countryListItem = lastTenCountries[key].name;
		var liHtml = "<li>" + countryListItem + "</li>";
		selectedCountriesList.append(liHtml);
	} 
});