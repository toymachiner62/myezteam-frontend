// Controller for the create email page for a particular event
myezteam.controller('EditEventEmailController', ['$scope', '$http', '$routeParams', '$filter', 'myezteamBase', function($scope, $http, $routeParams, $filter, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	
	// Get all of a users teams
	$scope.updateEventEmail = function() {

	    $scope.email.team_id = $routeParams.id  // Set the team id from the url
	    $scope.email.event_id = $routeParams.event_id // Set the event id from the url

	    // Convert player_types and response_types to integer arrays
	    $scope.email.player_types = convert_types_to_int($scope.email.player_types);
	    $scope.email.response_types = convert_types_to_int($scope.email.response_types);
	    
	    // Convert $scope.email.include_rsvp to a boolean
	    if($scope.email.include_rsvp == 'true') {
            $scope.email.include_rsvp = true;
        } else if($scope.email.include_rsvp == 'false') {
            $scope.email.include_rsvp = false;
        }

		$http.put(baseUrl+'v1/emails/' + $scope.email.id + apiKey, $scope.email)
			.success(function(response) {
		        $scope.error = null;
		        $scope.success = 'Email for  ' + $scope.email.title + ' created successfully!';
		        $scope.email = null;   // clear form fields
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to create your event\'s email. Please try again later.';
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
    
    // Gets a particular event's details
    $scope.getEvent = function() {
        
        // Get the details of a specific event
	    $http.get(baseUrl+'v1/events/'+$routeParams.event_id + apiKey)
            .success(function(response) {
                $scope.event_name = response.name;
                $scope.error = null;
            })
            .error(function(response) {
                $scope.success = null;
				$scope.error = 'An error occurred trying to get some data. Please try again later.';
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
            });
    } 
    
    var getEmail = function() {
        // Get the details of a specific event
	    $http.get(baseUrl+'v1/emails/'+$routeParams.email_id + apiKey)
            .success(function(response) {
                $scope.email = response;
                $scope.error = null;

                // Convert player_types and response_types to boolean arrays
	            $scope.email.player_types = convert_types_to_bool($scope.email.player_types, 3);
	            $scope.email.response_types = convert_types_to_bool($scope.email.response_types, 5);
                
            })
            .error(function(response) {
                $scope.success = null;
				$scope.error = 'An error occurred trying to get some data. Please try again later.';
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
            });
    }
    
    /**
     * Checks if the passed in array (which corresponds to a checkbox group) has at least one box checked.
     * @param types - An array (player_types or response_types)
     */
    $scope.is_required = function(types) {

        if(typeof $scope.email !== 'undefined') {
            for(var i = 0; i < types.length; i++) {
                if(types[i] == true) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Loop through an array full of booleans convert all the true's to the appropriate integer
     * @param types - An array full of boolean values to be converted to integers
     */
    var convert_types_to_int = function(types) {
        
        var converted_types = [];
        
        for(var i = 0; i < types.length; i++) {
            if(types[i] == true) {
                // Set the integer value to 1 + the index
                converted_types.push(i + 1);
            }
        }
        
        return converted_types;
    }
    
    /**
     * Loop through an array full of ints and converts all the ints to to true boolean values where the index of the int - 1
     * @param types - An array full of integer values to be converted to true boolean values
     * @param max   - The size of the array to be returned
     */
    var convert_types_to_bool = function(types, max) {
        
        var converted_types = [];
        
        // Initially set all values to false
        for(var i = 0; i < max; i++) {
            converted_types.push(false);   
        }
        
        // Set all the appropriate values to true
        for(var i = 0; i < types.length; i++) {
            
            if(typeof types[i] == 'number') {
                // Set the integer value to 1 - the index
                converted_types[types[i] - 1] = true;
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
		
    // Initially get the team name for the breadcrumbs
	$scope.getTeam();
	$scope.getEvent();
	getEmail();

}]);