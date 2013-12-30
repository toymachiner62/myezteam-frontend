// Controller for the create team page
myezteam.controller('CreateEventController', ['$scope', '$http', '$routeParams', '$filter', 'myezteamBase', function($scope, $http, $routeParams, $filter, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	
	// Initially set the time picker time so the display shows something
	$scope.event = {start: {time: new Date()}, end: {time: new Date()}};
	
	// Get all of a users teams
	$scope.createEvent = function() {
	
	    $scope.event.team_id = $routeParams.id  // Set the team id from the url
	    $scope.event.timezone = "America/Chicago"   // Timezone is always defaulted to Central time for now
	    console.log($scope.event);
	    
	    // Convert dates to correct format that api call expects
	    var start = new Date($scope.event.start.date);
	    var end = new Date($scope.event.end.date);

	    // This just formats the date to yyyy-mm-dd. The slicing stuff just makes sure that single digit values are padded with zeros
	    $scope.event.start = start.getFullYear() + "-" + ("0" + (start.getMonth() + 1)).slice(-2) + "-" + ("0" + start.getDate()).slice(-2);
	    $scope.event.end = end.getFullYear() + "-" + ("0" + (end.getMonth() + 1)).slice(-2) + "-" + ("0" + end.getDate()).slice(-2);

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
	
	$scope.getTeam = function() {
        
        // Get all the players of a specific team
	    $http.get(baseUrl+'v1/teams/'+$routeParams.id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
            .success(function(response) {
                $scope.team_name = response.name;
                $scope.team_id = $routeParams.id;
            })
            .error(function(response) {
                $scope.success = null;
				$scope.error = 'An error occurred trying to get some data. Please try again later.';
            });
    }
		
    // Initially get the team name for the breadcrumbs
	$scope.getTeam();

}]);