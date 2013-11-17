// Controller for the teams page
myezteam.controller('DashboardController', ['$scope', '$http', 'myezteamBase', function($scope, $http, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
    
    //this.$inject = ['highcharts-ng'];
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
	
	// The rsvp responses data
	data = [
		{
			name: 'Yes',
			y: 6,
			url: '#/team/id'
		},
		{
			name: 'Probably',
			y: 4,
			url: '#/team/id'
		},
		{
			name: 'Maybe',
			y: 2,
			url: '#/team/id'
		},
		{
			name: 'No',
			y: 1,
			url: '#/team/id'
		},
		{
			name: 'No Response',
			y: 2,
			url: '#/team/id'
		}
	];
                
	// The colors to be used for the respones in the pie chart
	colors = [
		"#2EE619", "#F0F03C", "#FAA200", "#F24129", "#737373"
	]
                
	// Add a gradient to the pie chart - http://www.highcharts.com/demo/pie-gradient
	Highcharts.getOptions().colors = Highcharts.map(colors, function(color) {
		return {
			radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
				stops: [
					[0, color],
					[1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
				]
		};
	});
	
	// Pie chart configs
	$scope.chartConfig = {
			chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'RSVP Responses for ' + $scope.event
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'RSVPs',
                events: {
            			click: function(e) {
            				console.log(e.point.options.url);
            				//location.href = e.point.options.url;
            			}	
                	},
                data: data
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