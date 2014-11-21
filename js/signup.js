// Controller for the login page
myezteamLogin.controller('SignupController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	// Login method when the form is submitted
	$scope.signup = function() {
	
		// Authenticate the user
		$http.post(baseUrl+'v1/users' + apiKey, $scope.user)
			.success(function(response) {
				$scope.error = null;
				$location.path('index.html');
			})
			.error(function(response) {
				$scope.error = response.message;
			});
	};

	/**
	 * Sets a dirty flag on the passed in field.
	 *
	 * Used to only show error messages when blurring out of a field
	 *
	 * @param field
	 */
	$scope.fieldDirty = function(field) {
		$scope[field] = {};
		$scope[field].dirty = true;
	};

}]);