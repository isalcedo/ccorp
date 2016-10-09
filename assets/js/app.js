/*
jQuery for animations and DOM simple stuff.
AngularJS for complex stuff. 
 */
$(document).foundation()

var weatherApp = angular.module('getWeather', []);
var sunrise;
var sunset;

weatherApp.controller('getWeatherController', function($scope, $http, $filter) {
	$http.get('assets/js/countries.json').success(function(data) {
		$scope.countries = data;
	});

	$scope.getGeo = function( zip_code, country_code ) {
		if (typeof zip_code !== 'undefined' || typeof country_code !== 'undefined' ) {
			if (typeof zip_code == 'undefined') {
				zip_code = '';
			} 
			$http.get("http://api.openweathermap.org/data/2.5/weather?zip="+ zip_code +","+ country_code.alpha2 +"&units=metric&APPID=aa8521fe973ae615bd42f0b20a0e47c6")
			.then(function(response) {
				$scope.data = response.data;
				$scope.icon = "http://openweathermap.org/img/w/"+response.data.weather[0].icon+".png";

				$http.get("https://maps.googleapis.com/maps/api/timezone/json?location="+response.data.coord.lat+","+response.data.coord.lon+"&timestamp="+response.data.sys.sunrise+"&key=AIzaSyBOv4sSajL69MzT9ADx1y3-BHkaH7-sI-M")
				.then(function(Gresponse) {
					sunrise = moment(response.data.sys.sunrise*1000);
					sunset  = moment(response.data.sys.sunset*1000);
					$scope.sunrise = sunrise.tz(Gresponse.data.timeZoneId).format('ha'); 
					$scope.sunset  = sunset.tz(Gresponse.data.timeZoneId).format('ha'); 
				});
						
				var country = $filter('filter')($scope.countries, {alpha2: $scope.data.sys.country}, true);
				if (country.length) {
					$scope.country = country[0];
				} else {
					$scope.country = '';
				}

				angular.element('#weather_data').slideDown();
			});

		} else {

			if (navigator.geolocation) {
				var startPos;
				angular.element('div.zip_code').slideUp();
				
				var geoSuccess = function(position) {
					startPos = position;
					lat  = startPos.coords.latitude;
					lon  = startPos.coords.longitude;
					$http.get("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&APPID=aa8521fe973ae615bd42f0b20a0e47c6")
					.then(function(response) {
						$scope.data    = response.data;
						$scope.icon    = "http://openweathermap.org/img/w/"+response.data.weather[0].icon+".png";

						$http.get("https://maps.googleapis.com/maps/api/timezone/json?location="+lat+","+lon+"&timestamp="+response.data.sys.sunrise+"&key=AIzaSyBOv4sSajL69MzT9ADx1y3-BHkaH7-sI-M")
						.then(function(Gresponse) {
							sunrise = moment(response.data.sys.sunrise*1000);
							sunset  = moment(response.data.sys.sunset*1000);
							$scope.sunrise = sunrise.tz(Gresponse.data.timeZoneId).format('ha'); 
							$scope.sunset  = sunset.tz(Gresponse.data.timeZoneId).format('ha'); 
						});

						var country = $filter('filter')($scope.countries, {alpha2: $scope.data.sys.country}, true);
						if (country.length) {
							$scope.country = country[0];
						} else {
							$scope.country = '';
						}
						
						angular.element('#weather_data').slideDown();
					});
				};

				var geoError = function(error) {
					console.log(error);
				}

				navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
			} else {
				console.log('Geolocation is not supported.');
			}

		}
	}
	$scope.askZip = function() {
		angular.element('div.zip_code').slideDown();
	}
});