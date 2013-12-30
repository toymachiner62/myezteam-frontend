// Controller for the create team page
myezteam.controller('CreateTeamController', ['$scope', '$http', 'teams', 'myezteamBase', function($scope, $http, teams, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

	// Get all of a users teams
	$scope.createTeam = function() {
	
		$http.post(baseUrl+'v1/teams' + apiKey, $scope.team)
			.success(function(response) {
				$scope.error = null;
				$scope.success = 'Team ' + $scope.team.name + ' created successfully!';
				
				// Refresh the team list in the menu so it contains the new team
				teams.getTeams(function(response) {
	                $scope.teams = response;    
	            });
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to create your team. Please try again later.';
			});
		} 
		
}]);