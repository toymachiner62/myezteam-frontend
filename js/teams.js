var token = sessionStorage.getItem("token");
var baseUrl = 'http://myezteam-webservices.herokuapp.com/';

var teamsModule = angular.module('teamsModule', ['ui.bootstrap', 'profileModule']);

// Controller for the teams page
teamsModule.controller('TeamsController', ['$scope', '$http', function($scope, $http) {

	// Set authorization token so we know the user has logged in.
	$http.defaults.headers.common.Authorization = 'Bearer ' + token;
	
	// Get the logge din users info
	$http.get(baseUrl+'v1/users?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		.success(function(response) {
			$scope.profile = response;
		})
		.error(function(response) {
			$scope.profile = 'An error occurred looking for your info. Please try again later.';
		});	

	// Get all of a users teams teams
	$http.get(baseUrl+'v1/teams?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		.success(function(response) {
	
			$scope['teams'] = response;
		})
		.error(function(response) {
			$scope['teams'] = 'An error occurred looking for your teams. Please try again later.';
		});
		
	// Get all the players of a specific team
	$scope.getPlayers = function(team_id, team_name) {
		$http.get(baseUrl+'v1/players/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		.success(function(response) {
			$scope.teamName = team_name;
			$scope['players'] = response;
		})
		.error(function(response) {
			$scope['players'] = 'An error occurred looking for your teams. Please try again later.';
		});

	}
	
}]);