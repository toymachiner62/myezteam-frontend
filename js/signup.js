// Controller for the login page
myezteamLogin.controller('SignupController', ['$scope', '$http', function($scope, $http) {

	// Login method when the form is submitted
	$scope.signup = function() {
	
	    console.log($scope.user);
	
		// Authenticate the user
		$http.post(baseUrl+'v1/users' + apiKey, $scope.user)
			.success(function(response) {
				$scope.error = null;
				window.location = 'index.html';
			})
			.error(function(response) {
				$scope.error = response.message;
			});
	}

}]);