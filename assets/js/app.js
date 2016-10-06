/*
jQuery for animations and DOM simple stuff.
AngularJS for complex stuff. 
 */
$(document).foundation()

$(document).ready( function(){
	$('.btn_negative').click( function(){
		$('div.zip_code').slideToggle();
	});
});

var weatherApp = angular.module('getWeather', []);
weatherApp.controller('getWeatherController', function($scope, $http) {
	$scope.getGeo = function() {
		if (navigator.geolocation) {
			var startPos;

			var geoSuccess = function(position) {
				startPos = position;
				//console.log(startPos.coords.latitude);
				//console.log(startPos.coords.longitude);
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
});