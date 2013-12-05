// Controller for the team page
myezteam.controller('TeamController', ['$scope', '$http', '$routeParams', '$rootScope', 'myezteamBase', function($scope, $http, $routeParams, $rootScope, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

    $scope.getTeam = function() {
        
        // Get all the players of a specific team
	    $http.get(baseUrl+'v1/teams/'+$routeParams.id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
            .success(function(response) {
                $scope.team = response;
                
                $rootScope.title = 'Team ' + response.name;
		    
                // Get the players of the team.
                //if(response.manager.length > 0) {
            
                
                    $scope.getPlayers(response.id, response.name, response.type, response.default_location, response.description);
                    $scope.getEvents(response.id);
                    //$scope.selected = players[0];
               // } else if(response.player.length > 0) {
               //     $scope.getPlayers(players[0].id, players[0].name, players[0].type, players[0].default_location, players[0].description);
               //     $scope.selected = players[0];
              //  }
            })
            .error(function(response) {
                $scope.players = 'An error occurred looking for your team\'s players. Please try again later.';
            });
    }
		
	// Get all the players of a specific team
	$scope.getPlayers = function(team_id, team_name, team_type, team_location, team_description) {
	
		// Get all the players of a specific team
		$http.get(baseUrl+'v1/teams/'+team_id+'/players?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		.success(function(response) {
			$scope.teamId = team_id;
			$scope.teamName = team_name;
			$scope.teamType = team_type;
			$scope.teamLocation = team_location;
			$scope.teamDescription = team_description;
			$scope.players = response;
		})
		.error(function(response) {
			$scope['players'] = 'An error occurred looking for your players. Please try again later.';
		});

	}
	
	// Get all of a users upcoming events
	$scope.getEvents = function(team_id) {
	
		console.log('team_id = ' + team_id);
	
		$http.get(baseUrl+'v1/teams/' + team_id + '/events?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
		
				$scope.events = response;
				
			    var event_id = response[0].id;
			    var event_name = response[0].name;
			    var team_id = response[0].team_id;
				$scope.getResponses(event_id, event_name, team_id);
			})
			.error(function(response) {
				$scope.events = 'An error occurred looking for your events. Please try again later.';
			});
	}
	
	// Get all of the responses for a particular event
	$scope.getResponses = function(event_id, event_name, team_id) {

	    $http.get(baseUrl+'v1/events/' + event_id + '/responses?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(event_responses) {
				$scope.error = null;
				$scope.responses = event_responses;
				$scope.teamId = team_id;
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred looking for your events. Please try again later.';
			});
	}
	
	// Get all the players of a specific team
	$scope.deleteTeam = function(team_id) {
	
		//delete $http.defaults.headers.common['X-Requested-With'];
		// Get all the players of a specific team
		$http.delete(baseUrl+'v1/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		//$http({method: 'DELETE', url: baseUrl+'v1/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d'})
		.success(function(response) {
			
		})
		.error(function(response) {
			$scope['players'] = 'An error occurred looking for your players. Please try again later.';
		});

	}
	
	
	
    $scope.activateTeam = function(team) {
       $scope.selected = team; 
    };
	
	$scope.activeClass = function(team) {
		return team === $scope.selected ? 'active' : undefined;
	}
	
	$scope.getTeam();	// Call on page load
	
}]);