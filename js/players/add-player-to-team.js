// Controller for the add player to team page
myezteam.controller('AddPlayerToTeamController', ['$scope', '$http', '$routeParams', 'myezteamBase', function($scope, $http, $routeParams, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

	// Create a player on the team
	$scope.addPlayer = function() {
	
	    $scope.player.team_id = $routeParams.id  // Set the team id from the url
	    
	    console.log($scope.player);
	    
		$http.post(baseUrl+'v1/players' + apiKey, $scope.player)
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
	    $http.get(baseUrl+'v1/teams/'+$routeParams.id + apiKey)
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