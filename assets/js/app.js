/*
jQuery for animations and DOM simple stuff.
AngularJS for complex stuff. 
 */
$(document).foundation()

var weatherApp = angular.module('getWeather', []);

weatherApp.controller('getWeatherController', function($scope, $http) {
	$http.get('assets/js/countries.json').success(function(data) {
		$scope.items = data;
	});

	$scope.getGeo = function( zip_code, country_code ) {
		if (typeof zip_code !== 'undefined' || typeof country_code !== 'undefined' ) {
			console.log(country_code);
			$http.get("http://api.openweathermap.org/data/2.5/weather?zip="+ zip_code +","+ country_code.alpha2 +"&units=metric&APPID=aa8521fe973ae615bd42f0b20a0e47c6")
			.then(function(response) {
				$scope.data = response.data;
				$scope.icon = "http://openweathermap.org/img/w/"+response.data.weather[0].icon+".png";
				angular.element('#weather_data').slideDown();
			});

		} else {
			if (navigator.geolocation) {
				var startPos;

				var geoSuccess = function(position) {
					startPos = position;
					lat  = startPos.coords.latitude;
					lon  = startPos.coords.longitude;
					$http.get("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&APPID=aa8521fe973ae615bd42f0b20a0e47c6")
					.then(function(response) {
						$scope.data = response.data;
						$scope.icon = "http://openweathermap.org/img/w/"+response.data.weather[0].icon+".png";
						angular.element('#weather_data').slideDown();
					});
				};

				var geoError = function(error) {
					console.log(error);
				}

				navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
			}
			else {
				console.log('Geolocation is not supported.');
			}
		}
	}
	$scope.askZip = function() {
		angular.element('div.zip_code').slideToggle();
	}
});