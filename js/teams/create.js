// Controller for the create team page
myezteam.controller('CreateTeamController', ['$scope', '$http', 'teamsFactory', 'myezteamBase',
	function($scope, $http, teamsFactory, myezteamBase) {

		myezteamBase.getAuthHeader();
		myezteamBase.getProfile(function(response) {
			$scope.profile = response;
		});

		// Get all of a users teams
		$scope.createTeam = function() {

			$http.post(baseUrl + 'v1/teams' + apiKey, $scope.team)
				.success(function(response) {
					$scope.error = null;
					$scope.success = 'Team ' + $scope.team.name + ' created successfully!';

					// Refresh the team list in the menu so it contains the new team
					teamsFactory.get_teams(function(all_teams) {

						$scope.teams = [];

						// Add the teams to $scope.teams, without adding duplicates
						$scope.teams = add_teams($scope.teams, all_teams.owner, "owner", false);
						$scope.teams = add_teams($scope.teams, all_teams.manager, "manager", false);
						$scope.teams = add_teams($scope.teams, all_teams.player, "player", false);

						teamsFactory.broadcast(); // Tell the rest of the controllers there's been a change
					});
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred trying to create your team. Please try again later.';
				});
		}
	}
]);
