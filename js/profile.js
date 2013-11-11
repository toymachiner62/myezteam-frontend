var token = sessionStorage.getItem("token");
var baseUrl = 'http://myezteam-webservices.herokuapp.com/';

//var profileModule = angular.module('profileModule', ['ui.bootstrap']);

// Controller for the profile page
myezteam.controller('ProfileController', ['$scope', '$http', 'myezteamBase', function($scope, $http, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	//templateFactory.setTitle('My Profile');
		
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