// Controller for the password reset page
myezteamLogin.controller('ResetPasswordController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {

	// Password reset method when the form is submitted
	$scope.reset = function() {
	
		$scope.user.redirect_url = 'http://www.myezteam.com/index.html#/change-password';
	
		// Reset the user's password
		$http.post(baseUrl+'v1/users/reset' + apiKey, $scope.user)
			.success(function(response) {
				$scope.error = null;
				$rootScope.success = 'Password reset link has been sent to your email';
				$location.path('/login');
			})
			.error(function(response) {
				$scope.error = response.message;
			});
	}

}]);