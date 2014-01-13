// Controller for the profile page
myezteam.controller('ProfileController', ['$scope', '$http', 'myezteamBase', function($scope, $http, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
		
	// Save profile info when the form is submitted
	$scope.updateProfile = function() {
		
		$http.put(baseUrl+'v1/users' + apiKey, $scope.profile)
			.success(function(response) {
			    $scope.error = null;
				$scope.success = 'Your profile was updated successfully';
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to update your profile. Please try again later.';
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
			});	
	}
}]);