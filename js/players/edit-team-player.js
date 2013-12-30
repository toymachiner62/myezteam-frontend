// Controller for editing a particular player of a team
myezteam.controller('EditTeamPlayerController', ['$scope', '$http', '$routeParams', 'myezteamBase', function($scope, $http, $routeParams, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

	// Create a player on the team
	$scope.updatePlayer = function() {
	
	    $scope.player.team_id = $routeParams.id  // Set the team id from the url
	    
		$http.post(baseUrl+'v1/players?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d', $scope.player)
			.success(function(response) {
		        $scope.error = null;
		        $scope.success = 'Player ' + $scope.player.email + ' added to team successfully!';
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to add player to your team. Please try again later.';
			});
	}
	
	// Get team id and name for the breadcrumbs
	$scope.getTeam = function() {
        
        // Get all the players of a specific team
	    $http.get(baseUrl+'v1/teams/'+$routeParams.id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
            .success(function(response) {
                $scope.team_name = response.name;
                $scope.team_id = $routeParams.id;
            })
            .error(function(response) {
                $scope.success = null;
				$scope.error = 'An error occurred trying to get some data. Please try again later.';
            });
    }
		
    // Initially get the team name for the breadcrumbs
	$scope.getTeam();

}]);