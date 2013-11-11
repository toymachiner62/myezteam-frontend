// Controller for the create team page
myezteam.controller('CreateTeamController', ['$scope', '$http', 'myezteamBase', function($scope, $http, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

	// Get all of a users teams
	$scope.createTeam = function() {
	
		$http.post(baseUrl+'v1/teams/?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d', $scope.team)
			.success(function(response) {
				$scope.error = null;
				$scope.success = 'Team ' + $scope.team.name + ' created successfully!';
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred trying to create your team. Please try again later.';
			});
		}
		
}]);