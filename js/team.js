// Controller for the team page
myezteam.controller('TeamController', ['$scope', '$http', '$routeParams', '$rootScope', 'myezteamBase', function($scope, $http, $routeParams, $rootScope, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

    $scope.getTeam = function() {
        console.log('in getTeam');
        
        // Get all the players of a specific team
	    $http.get(baseUrl+'v1/teams/'+$routeParams.id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
            .success(function(response) {
                $scope.team = response;
                
                $rootScope.title = 'Team ' + response.name;
		    
                // Get the players of the team.
                //if(response.manager.length > 0) {
            
                
                    $scope.getPlayers(response.id, response.name, response.type, response.default_location, response.description);
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
		$http.get(baseUrl+'v1/players/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		.success(function(response) {
			$scope.teamId = team_id;
			$scope.teamName = team_name;
			$scope.teamType = team_type;
			$scope.teamLocation = team_location;
			$scope.teamDescription = team_description;
			$scope['players'] = response;
		})
		.error(function(response) {
			$scope['players'] = 'An error occurred looking for your players. Please try again later.';
		});

	}
	
	// Get all the players of a specific team
	$scope.deleteTeam = function(team_id) {
	
		// Get all the players of a specific team
		$http.delete(baseUrl+'v1/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
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