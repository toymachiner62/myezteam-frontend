// Controller for the create email page for a particular event
myezteam.controller('CreateEventEmailController', ['$scope', '$http', '$routeParams', '$filter', 'myezteamBase', function($scope, $http, $routeParams, $filter, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	
	// Set the checkbox values to arrays with null values so that the ng-true-value/ng-false-value work correctly
    $scope.email = {
        //player_types: [null, null, null],
        //response_types: [null, null, null, null, null]
        player_types: [false, false, false],
        response_types: [false, false, false, false, false]
    };
	
	// Initially set the time picker time so the display shows something
	//$scope.event = {start: {time: new Date()}, end: {time: new Date()}};
	
	// Get all of a users teams
	$scope.createEventEmail = function() {
	console.log($scope.email);
	console.log($routeParams);
	    $scope.email.team_id = $routeParams.id  // Set the team id from the url
	    $scope.email.event_id = $routeParams.event_id // Set the event id from the url
	    //$scope.event.timezone = "America/Chicago"   // Timezone is always defaulted to Central time for now

	    // Remove false values from player_types and response_types
	    var player_types = [];
	    var response_types = [];
	    
	    // Loop through all types and convert all the true's to the appropriate integer
        /*for(var i = 0; i < player_types; i++) {
            if(player_types[i] == true) {
                // Set the integer value to 1 + the index
                $scope.email.player_types.push(i + 1);
            }
        }
	    
	    for(type in $scope.email.response_types) {
	        response_types[response_types.length] = type;
	    } */
	    
	    // Convert player_types and response_types to integer arrays
	    $scope.email.player_types = convert_types(player_types);
	    $scope.email.response_types = convert_types(response_types);
	    
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
    
    /**
     * Checks if the passed in array (which corresponds to a checkbox group) has at least one box checked.
     * @param types - An array (player_types or response_types)
     */
    $scope.is_required = function(types) {

        for(var i = 0; i < types.length; i++) {
            if(types[i] == true) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Loop through an array full of booleans convert all the true's to the appropriate integer
     * @param types - An array full of boolean values to be converted to integers
     */
    var convert_types = function(types) {
        
        var converted_types = [];
        
        for(var i = 0; i < types; i++) {
            if(types[i] == true) {
                // Set the integer value to 1 + the index
                converted_types.push(i + 1);
            }
        }
        
        return converted_types;
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
   
    // Watches $scope.email.response_types for changes. If the value changes, make sure to remove all 
    //      the "null" values from the array os the array returned only contains integers which correspond 
    //      to the response_types in the db
   /* $scope.$watch('email.response_types', function() {
        
        // If $scope.email exists
        if(typeof $scope.email !== 'undefined') {
            for(var i = 0; i < $scope.email.response_types.length; i++) {
                console.log('type = '+$scope.email.response_types[i]);
                if($scope.email.response_types[i] == 'null') {
                    $scope.email.response_types[i] = null;
                }
            }
        }
   });
   
   // Watches $scope.email.player_types for changes. If the value changes, make sure to remove all 
    //      the "null" values from the array os the array returned only contains integers which correspond 
    //      to the player_types in the db
    $scope.$watch('email.player_types', function() {
        
        // If $scope.email exists
        if(typeof $scope.email !== 'undefined') {
            for(var i = 0; i < $scope.email.player_types.length; i++) {
                console.log('type = '+$scope.email.player_types[i]);
                if($scope.email.player_types[i] == 'null') {
                    $scope.email.player_types[i] = null;
                }
            }
        }
   }); */
		
    // Initially get the team name for the breadcrumbs
	$scope.getTeam();
	$scope.getEvent();

}]);