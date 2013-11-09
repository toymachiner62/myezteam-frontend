var token = sessionStorage.getItem("token");
var baseUrl = 'http://myezteam-webservices.herokuapp.com/';

var loginModule = angular.module('loginModule', ['ui.bootstrap']);

// Controller for the login page
loginModule.controller('LoginController', ['$scope', '$http', function($scope, $http) {

	// If a user has check the "remember me" box previously and the email/password is in localStorage, set the email/password
	if(localStorage.getItem("email") != null && localStorage.getItem("password") != null) {
		$scope.user = {
			email: localStorage.getItem("email"),
			password: localStorage.getItem("password"),
			remember: localStorage.getItem("remember")
		}
	} 

	// Login method when the form is submitted
	$scope.login = function() {
	
		// Authenticate the user
		$http.post(baseUrl+'v1/auth/login?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d', $scope.user)
			.success(function(response) {
				sessionStorage.setItem("token", response.token);
				$scope.loginError = null;

				// If a user checked the "remember me" box, set their email/password in localStorage
				if($scope.user.remember) {
					localStorage.setItem("email", $scope.user.email);
					localStorage.setItem("password", $scope.user.password);
					localStorage.setItem("remember", $scope.user.remember);

				} else {
					localStorage.removeItem("email");
					localStorage.removeItem("password");
					localStorage.removeItem("remember");
				}
			})
			.error(function(response) {
				$scope.loginError = response.message;
			});
	}
}]);