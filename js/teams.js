// Controller for the teams page
myezteam.controller('TeamsController', ['$scope', '$http', 'myezteamBase', 'teams', function($scope, $http, myezteamBase, teams) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	//templateFactory.setTitle('My Teams');
    
    // Called on page load
    teams.getTeams(function(response) {
	    $scope.teams = response;   
	    
	    //$scope['teams'] = teams.getTeams();
		
		var players = null;
			
			
		// Get the details and players of the first team in the list.
		if(response.manager.length > 0) {
			players = response.manager;
			$scope.getPlayers(players[0].id, players[0].name, players[0].type, players[0].default_location, players[0].description);
			$scope.selected = players[0];
		} else if(response.player.length > 0) {
			players = response.player;
			$scope.getPlayers(players[0].id, players[0].name, players[0].type, players[0].default_location, players[0].description);
			$scope.selected = players[0];
		}
	});
		
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
	
}]);