var token = sessionStorage.getItem("token");
var baseUrl = 'http://myezteam-webservices.herokuapp.com/';

var profileModule = angular.module('profileModule', ['ui.bootstrap']);

// Controller for the profile page
profileModule.controller('ProfileController', ['$scope', '$http', function($scope, $http) {

	// Set authorization token so we know the user has logged in.
	$http.defaults.headers.common.Authorization = 'Bearer ' + token;

	// Get the logge din users info
	$http.get(baseUrl+'v1/users?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		.success(function(response) {
			$scope.profile = response;
		})
		.error(function(response) {
			$scope.profile = 'An error occurred looking for your info. Please try again later.';
		});	
		
		
	// Save profile info when the form is submitted
	$scope.updateProfile = function() {
		
		$http.put(baseUrl+'v1/users?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d', $scope.profile)
			.success(function(response) {
				//$scope.profile = response;
			})
			.error(function(response) {
				//$scope.profile = 'An error occurred looking for your info. Please try again later.';
			});	
	}
}]);