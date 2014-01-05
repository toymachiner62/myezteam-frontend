// Controller for the create email page for a particular event
myezteam.controller('CreateEventEmailController', ['$scope', '$http', '$routeParams', '$filter', 'myezteamBase', function($scope, $http, $routeParams, $filter, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	
	// Initially set the time picker time so the display shows something
	//$scope.event = {start: {time: new Date()}, end: {time: new Date()}};
	
	// Get all of a users teams
	$scope.createEventEmail = function() {
	
	    $scope.email.team_id = $routeParams.id  // Set the team id from the url
	    $scope.email.event_id = $routeParams.event_id // Set the event id from the url
	    //$scope.event.timezone = "America/Chicago"   // Timezone is always defaulted to Central time for now

	    // Convert player_types and response_types to simple json arrays
	    var player_types = [];
	    var response_types = [];
	    
	    for(type in $scope.email.player_types) {
	        player_types[player_types.length] = type;
	    }
	    
	    for(type in $scope.email.response_types) {
	        response_types[response_types.length] = type;
	    }
	    
	    $scope.email.player_types = player_types;
	    $scope.email.response_types = response_types;
	    
	    // Convert $scope.email.include_rsvp to a boolean
	    if($scope.email.include_rsvp == 'true') {
            $scope.email.include_rsvp = true;
        } else if($scope.email.include_rsvp == 'false') {
            $scope.email.include_rsvp = false;
        }

		$http.post(baseUrl+'v1/emails' + apiKey, $scope.email)
			.success(function(response) {
		        $scope.error = null;
		        $scope.success = 'Email for  ' + $scope.email.title + ' created successfully!';
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to create your event\'s email. Please try again later.';
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
    
    // Gets a particular event's details
    $scope.getEvent = function() {
        
        // Get the details of a specific event
	    $http.get(baseUrl+'v1/events/'+$routeParams.event_id + apiKey)
            .success(function(response) {
                $scope.event_name = response.name;
            })
            .error(function(response) {
                $scope.success = null;
				$scope.error = 'An error occurred trying to get some data. Please try again later.';
            });
    } 
    
    // Watches $scope.email.default for changes. If the value changes, convert it to a boolean datatype and set some other variables
    $scope.$watch('email.default', function() {
        
        // If $scope.email exists
        if(typeof $scope.email !== 'undefined') {
            if($scope.email.default == 'true') {
                $scope.email.default = true;
                $scope.email.send_type = 'days_before'
            } else if($scope.email.default == 'false') {
                $scope.email.default = false;
                $scope.email.send_type = null;
            }
        }
   });
   
    // Watches $scope.email.include_rsvp for changes. If the value changes, convert it to a boolean datatype
    /*$scope.$watch('email.include_rsvp', function() {
        
        // If $scope.email exists
        if(typeof $scope.email !== 'undefined') {
            if($scope.email.include_rsvp == 'true') {
                $scope.email.include_rsvp = true;
            } else if($scope.email.include_rsvp == 'false') {
                $scope.email.include_rsvp = false;
            }
        }
   });*/
		
    // Initially get the team name for the breadcrumbs
	$scope.getTeam();
	$scope.getEvent();

}]);