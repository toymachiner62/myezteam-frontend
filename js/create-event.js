// Controller for the create team page
myezteam.controller('CreateEventController', ['$scope', '$http', '$routeParams', 'myezteamBase', function($scope, $http, $routeParams, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

	// Get all of a users teams
	$scope.createEvent = function() {
	
	    
	    $scope.event.team_id = $routeParams.id  // Set the team id from the url
	    console.log($scope.event);
	
		$http.post(baseUrl+'v1/events?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d', $scope.event)
			.success(function(response) {
		        $scope.error = null;
		        $scope.success = 'Event ' + $scope.event.name + ' created successfully!';
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to create your team\'s event. Please try again later.';
			});
		}

}]);