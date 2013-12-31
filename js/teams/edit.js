// Controller for the create team page
myezteam.controller('EditTeamController', ['$scope', '$http', '$routeParams', 'teams', 'myezteamBase', function($scope, $http, $routeParams, teams, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	
	// Get the team that we're editing
	getTeam = function() {
	    
	    $http.get(baseUrl+'v1/teams/' + $routeParams.id + apiKey)
			.success(function(response) {
				$scope.team = response;
	            $scope.error = null;
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to edit your team. Please try again later.';
			});
	}

	// Get all of a users teams
	$scope.updateTeam = function() {
	
		$http.post(baseUrl+'v1/teams' + apiKey, $scope.team)
			.success(function(response) {
				$scope.error = null;
				$scope.success = 'Team ' + $scope.team.name + ' edited successfully!';
				
				// Refresh the team list in the menu so it contains the new team
				teams.getTeams(function(response) {
	                $scope.teams = response;    
	            });
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to edit your team. Please try again later.';
			});
	} 
	
	getTeam();  // Call on page load;
		
}]);