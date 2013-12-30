// Controller for the profile page
myezteam.controller('ProfileController', ['$scope', '$http', 'myezteamBase', function($scope, $http, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	//templateFactory.setTitle('My Profile');
		
	// Save profile info when the form is submitted
	$scope.updateProfile = function() {
		
		$http.put(baseUrl+'v1/users' + apiKey, $scope.profile)
			.success(function(response) {
				//$scope.profile = response;
			})
			.error(function(response) {
				//$scope.profile = 'An error occurred looking for your info. Please try again later.';
			});	
	}
}]);