// Controller for the password reset page
myezteamLogin.controller('ChangePasswordController', ['$scope', '$http', '$routeParams', '$location', '$rootScope', function($scope, $http, $routeParams, $location, $rootScope) {

	// Password reset method when the form is submitted
	$scope.change_password = function() {
	
		$scope.user.password_change_key = $routeParams.key;
	
		// Reset the user's password
		$http.post(baseUrl+'v1/users/change_password' + apiKey, $scope.user)
			.success(function(response) {
				$scope.error = null;
				$rootScope.success = 'Password changed successfully';
				$location.path('index.html');
			})
			.error(function(response) {
				$scope.error = response.message;
			});
	}

}]);