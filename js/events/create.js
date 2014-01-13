// Controller for the create team page
myezteam.controller('CreateEventController', ['$scope', '$http', '$routeParams', '$filter', 'myezteamBase', function($scope, $http, $routeParams, $filter, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	
	// Get all of a users teams
	$scope.createEvent = function() {
	
	    $scope.event.team_id = $routeParams.id  // Set the team id from the url
	    $scope.event.timezone = "America/Chicago"   // Timezone is always defaulted to Central time for now
	    
	    // Convert dates/times to correct format the api call expects
	    var start_date = new Date($scope.event.start.date);
	    var end_date = new Date($scope.event.end.date);
	    var start_time = $scope.event.start.time.getHours() + ":" + $scope.event.start.time.getMinutes() + ":" + $scope.event.start.time.getSeconds();
	    var end_time = $scope.event.end.time.getHours() + ":" + $scope.event.end.time.getMinutes() + ":" + $scope.event.end.time.getSeconds();
	    
	    // This just formats the date to yyyy-mm-dd. The slicing stuff just makes sure that single digit values are padded with zeros
	    $scope.event.start = start_date.getFullYear() + "-" + ("0" + (start_date.getMonth() + 1)).slice(-2) + "-" + ("0" + start_date.getDate()).slice(-2) + ' ' + start_time;
	    $scope.event.end = end_date.getFullYear() + "-" + ("0" + (end_date.getMonth() + 1)).slice(-2) + "-" + ("0" + end_date.getDate()).slice(-2) + ' ' + end_time;
	    
		$http.post(baseUrl+'v1/events' + apiKey, $scope.event)
			.success(function(response) {
		        $scope.error = null;
		        $scope.success = 'Event ' + $scope.event.name + ' created successfully!';
		        $scope.event = null;   // clear form fields
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to create your team\'s event. Please try again later.';
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
			});
	}
	
	$scope.getTeam = function() {
        
        // Get all the players of a specific team
	    $http.get(baseUrl+'v1/teams/'+$routeParams.id + apiKey)
            .success(function(response) {
                $scope.team_name = response.name;
                $scope.team_id = $routeParams.id;
            })
            .error(function(response) {
                $scope.success = null;
				$scope.error = 'An error occurred trying to get some data. Please try again later.';
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
            });
    }
    
    /**
     * Creates a new Date object with the time rounded to the nearest hour
     * @param end   - A boolean that determines if we should add an hour to the date or not
     */
    var getRoundedTime = function(end) {
        var date = new Date();
        date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
        if(end) {
            date.setHours(date.getHours() + 1);
        }
        date.setMinutes(0);
        return date;
    }
		
    // Initially set the time picker time so the display shows something
	$scope.event = {start: {time: getRoundedTime(false)}, end: {time: getRoundedTime(true)}};
    // Initially get the team name for the breadcrumbs
	$scope.getTeam();

}]);