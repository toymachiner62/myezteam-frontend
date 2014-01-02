// Controller for the create team page
myezteam.controller('EditEventController', ['$scope', '$http', '$routeParams', '$filter', 'myezteamBase', function($scope, $http, $routeParams, $filter, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	
	// Initially set the time picker time so the display shows something
	//$scope.event = {start: {time: new Date()}, end: {time: new Date()}};
	
	// Get the event that we're editing
	var getEvent = function() {
	    
	    $http.get(baseUrl+'v1/events/' + $routeParams.event_id + apiKey)
			.success(function(response) {
				$scope.event = response;
				
				// Convert dates to correct format that api call expects
        	    var start = new Date($scope.event.start);
        	    var end = new Date($scope.event.end);
                
                // Now that we've retrieved the date and have it in a local variable, we can modify the $scope.event object to hold the dates for the ui
                $scope.event.start = {date: null, time: new Date()};
                $scope.event.end = {date: null, time: new Date()};
                
        	    // This just formats the date to yyyy-mm-dd. The slicing stuff just makes sure that single digit values are padded with zeros
        	    $scope.event.start.date = start.getFullYear() + "-" + ("0" + (start.getMonth() + 1)).slice(-2) + "-" + ("0" + start.getDate()).slice(-2);
        	    $scope.event.end.date = end.getFullYear() + "-" + ("0" + (end.getMonth() + 1)).slice(-2) + "-" + ("0" + end.getDate()).slice(-2);
	            $scope.event.start.time = start; //$scopestart.getHours() + ":" + start.getMinutes() + ":" + start.getSeconds();
	            $scope.event.end.time = end; //end.getHours() + ":" + end.getMinutes() + ":" + end.getSeconds();
        	    
	            $scope.error = null;
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to edit your team. Please try again later.';
			});
	}
	
	// Get all of a users teams
	$scope.updateEvent = function() {
	
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
	    
		$http.put(baseUrl+'v1/events/' + $scope.event.id + apiKey, $scope.event)
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
	    $http.get(baseUrl+'v1/teams/'+$routeParams.id + apiKey)
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
    getEvent();

}]);