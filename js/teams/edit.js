// Controller for the create team page
myezteam.controller('EditTeamController', ['$scope', '$http', '$routeParams', 'teamsFactory', 'myezteamBase', function($scope, $http, $routeParams, teamsFactory, myezteamBase) {

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
	
		$http.put(baseUrl+'v1/teams' + apiKey, $scope.team)
			.success(function(response) {
				$scope.error = null;
				$scope.success = 'Team ' + $scope.team.name + ' edited successfully!';
				
				/*// Refresh the team list in the menu so it contains the new team
				teamsFactory.get_teams(function(teams) {
	                $scope.teams = teams;    
	            });*/
	            
	            teamsFactory.broadcast();   // Tell the rest of the controllers there's been a change
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to edit your team. Please try again later.';
			});
	}
	
	getTeam();  // Call on page load;
		
}]);