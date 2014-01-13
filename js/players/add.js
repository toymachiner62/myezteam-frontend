// Controller for the add player to team page
myezteam.controller('AddPlayerToTeamController', ['$scope', '$http', '$routeParams', '$location', 'myezteamBase', function($scope, $http, $routeParams, $location, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

	// Create a player on the team
	$scope.addPlayer = function() {
	
	    $scope.player.team_id = $routeParams.id  // Set the team id from the url
	    
		$http.post(baseUrl+'v1/players' + apiKey, $scope.player)
			.success(function(response) {
		        $scope.error = null;
		        $scope.success = 'Player ' + $scope.player.email + ' added to team successfully!';
		        $scope.player = null;   // clear form fields
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
		        //$location.path("/teams/" + $routeParams.id);
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to add player to your team. Please try again later.';
				$("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
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
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/errorr message is visible
            });
    }
		
    // Initially get the team name for the breadcrumbs
	$scope.getTeam();

}]);