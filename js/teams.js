var token = sessionStorage.getItem("token");
var baseUrl = 'http://myezteam-webservices.herokuapp.com/';

var teamsModule = angular.module('teamsModule', ['ui.bootstrap', 'profileModule']);

// Controller for the teams page
teamsModule.controller('TeamsController', ['$scope', '$http', function($scope, $http) {

	// Set authorization token so we know the user has logged in.
	$http.defaults.headers.common.Authorization = 'Bearer ' + token;
	
	// Get the logged in users info
	$http.get(baseUrl+'v1/users?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		.success(function(response) {
			$scope.profile = response;
		})
		.error(function(response) {
			$scope.profile = 'An error occurred looking for your info. Please try again later.';
		});	

	

	// Get all of a users teams
	$scope.getTeams = function() {
		$http.get(baseUrl+'v1/teams/all?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
		
				$scope['teams'] = response;
				var players = null;
			
				// Get the details and players of the first team in the list.
				if(response.manager.length > 0) {
					players = response.manager;
					$scope.getPlayers(players[0].id, players[0].name, players[0].type, players[0].default_location, players[0].description);
				} else if(response.player.length > 0) {
					players = response.player;
					$scope.getPlayers(players[0].id, players[0].name, players[0].type, players[0].default_location, players[0].description);
				}
			
			})
			.error(function(response) {
				$scope['teams'] = 'An error occurred looking for your teams. Please try again later.';
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
	
	$scope.getTeams();	// Call on page load
	
}]);