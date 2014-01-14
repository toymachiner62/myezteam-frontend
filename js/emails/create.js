// Controller for the create email page for a particular event
myezteam.controller('CreateEventEmailController', ['$scope', '$http', '$routeParams', '$filter', 'myezteamBase', function($scope, $http, $routeParams, $filter, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	
	// Set the checkbox values to arrays with null values so that the ng-true-value/ng-false-value work correctly
    $scope.email = {
        player_types: [false, false, false],
        response_types: [false, false, false, false, false]
    };

	// Get all of a users teams
	$scope.createEventEmail = function() {
	    $scope.email.team_id = $routeParams.id  // Set the team id from the url
	    $scope.email.event_id = $routeParams.event_id // Set the event id from the url

	    // Convert player_types and response_types to integer arrays
	    $scope.email.player_types = convert_types($scope.email.player_types);
	    $scope.email.response_types = convert_types($scope.email.response_types);
	    
	    // Convert $scope.email.include_rsvp_form to a boolean
	    if($scope.email.include_rsvp_form == 'true') {
            $scope.email.include_rsvp_form = true;
        } else if($scope.email.include_rsvp_form == 'false') {
            $scope.email.include_rsvp_form = false;
        }

		$http.post(baseUrl+'v1/emails' + apiKey, $scope.email)
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
        
        if(types != null && typeof types !== 'undefined') {
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
    var convert_types = function(types) {
        
        var converted_types = [];
        
        for(var i = 0; i < types.length; i++) {
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
        if($scope.email != null && typeof $scope.email !== 'undefined') {
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

}]);