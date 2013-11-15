// Controller for the teams page
myezteam.controller('DashboardController', ['$scope', '$http', 'myezteamBase', function($scope, $http, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	//templateFactory.setTitle('My Teams');

	// Get all of a users upcoming events
	$scope.getEvents = function() {
	
		$http.get(baseUrl+'v1/events?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
		
				$scope.events = response;

			
			})
			.error(function(response) {
				$scope.events = 'An error occurred looking for your events. Please try again later.';
			});
	}
	
	$scope.chartConfig = {
			options: {
				chart: {
                	type: 'column'
                }
            },
            title: {
                text: 'Monthly Average Rainfall'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Rainfall (mm)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Tokyo',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    
            }, {
                name: 'New York',
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
    
            }, {
                name: 'London',
                data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
    
            }, {
                name: 'Berlin',
                data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
    
            }]	
	}
		
	// Get all the players of a specific team
	//$scope.getPlayers = function(team_id, team_name, team_type, team_location, team_description) {
	
		// Get all the players of a specific team
	//	$http.get(baseUrl+'v1/players/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
	//	.success(function(response) {
	//		$scope.teamId = team_id;
	//		$scope.teamName = team_name;
	//		$scope.teamType = team_type;
	//		$scope.teamLocation = team_location;
	//		$scope.teamDescription = team_description;
	//		$scope['players'] = response;
	//	})
	//	.error(function(response) {
	//		$scope['players'] = 'An error occurred looking for your players. Please try again later.';
	//	});

	//}
	
	// Get all the players of a specific team
	//$scope.deleteTeam = function(team_id) {
	
		// Get all the players of a specific team
	//	$http.delete(baseUrl+'v1/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
	//	.success(function(response) {
	//		
	//	})
	//	.error(function(response) {
	//		$scope['players'] = 'An error occurred looking for your players. Please try again later.';
	//	});

	//}
	
	
	
    //$scope.activateTeam = function(team) {
    //    $scope.selected = team; 
    //};
	
	//$scope.activeClass = function(team) {
	//	return team === $scope.selected ? 'active' : undefined;
	//}
	
	$scope.getEvents();	// Call on page load
	
}]);