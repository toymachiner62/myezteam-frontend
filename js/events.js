// Controller for the teams page
myezteam.controller('EventsController', ['$scope', '$http', 'myezteamBase', function($scope, $http, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	//templateFactory.setTitle('My Teams');

	// Get all of a users teams
	$scope.getEvents = function() {
	
		$http.get(baseUrl+'v1/events?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
		
				$scope.events = response;
				
				console.log($scope.events);
				
				for(var i = 0; i < $scope.events.length; i++) {
				//for(event in $scope.events) {
				    console.log($scope.events[i]);
				    console.log($scope.events[i].start);
				    $scope.events[i].start = new Date($scope.events[i].start).toLocaleString();
				    console.log(new Date($scope.events[i].start).toLocaleString());
				    console.log(event.start);
				    event.end = $scope.events[i].end.toLocaleString();
				}
				
				//var players = null;
			
				// Get the details and players of the first team in the list.
				//if(response.manager.length > 0) {
				//	players = response.manager;
				//	$scope.getPlayers(players[0].id, players[0].name, players[0].type, players[0].default_location, players[0].description);
				//	$scope.selected = players[0];
				//} else if(response.player.length > 0) {
				//	players = response.player;
				//	$scope.getPlayers(players[0].id, players[0].name, players[0].type, players[0].default_location, players[0].description);
				//	$scope.selected = players[0];
				//}
			
			})
			.error(function(response) {
				$scope.events = 'An error occurred looking for your events. Please try again later.';
			});
		}
		
	// Get all the players of a specific team
	//$scope.getPlayers = function(team_id, team_name, team_type, team_location, team_description) {
	
		// Get all the players of a specific team
		//$http.get(baseUrl+'v1/players/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		//.success(function(response) {
		//	$scope.teamId = team_id;
		//	$scope.teamName = team_name;
		//	$scope.teamType = team_type;
		///	$scope.teamLocation = team_location;
		//	$scope.teamDescription = team_description;
		//	$scope['players'] = response;
		//})
		//.error(function(response) {
		//	$scope['players'] = 'An error occurred looking for your players. Please try again later.';
		//});

	//}
	
	// Get all the players of a specific team
	//$scope.deleteTeam = function(team_id) {
	
		// Get all the players of a specific team
	//	$http.delete(baseUrl+'v1/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
	//	.success(function(response) {
			
	//	})
	//	.error(function(response) {
	//		$scope['players'] = 'An error occurred looking for your players. Please try again later.';
	//	});

	//}
	
	
	
    //$scope.activateTeam = function(team) {
    //   $scope.selected = team; 
    //};
	
	//$scope.activeClass = function(team) {
	//	return team === $scope.selected ? 'active' : undefined;
	//}
	
	$scope.getEvents();	// Call on page load
	
}]);