// Controller for the teams page
myezteam.controller('DashboardController', ['$scope', '$http', 'myezteamBase', function($scope, $http, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
    
	// Get all of a users upcoming events
	$scope.getEvents = function(event_id) {
	
		$http.get(baseUrl+'v1/events?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
		
				$scope.events = response;
				
				// if no event_id is passed in, get the responses for the first event in the list
			    event_id = event_id == null ? response[0].id : event_id
				$scope.getResponses(event_id);
			})
			.error(function(response) {
				$scope.events = 'An error occurred looking for your events. Please try again later.';
			});
	}
	
	// Get all of the responses for a particular event
	$scope.getResponses = function(event_id) {
	    
	    $http.get(baseUrl+'v1/events/' + event_id + '/responses?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(event_responses) {
				
				$scope.responses = event_responses;
				
				
				
				// initially set the no_responses to the total number of responses. We'll change this as we loop through the responses
				var no_response = $scope.responses.length;  
				var yes = 0;
				var probably = 0;
				var maybe = 0;
				var no = 0;
				
				// count the response types (2 yes's, 3 maybe's, etc)
				for(response in $scope.responses) {
				    switch (parseInt(response))
                    {
                    case 1:
                      // do nothing
                      break;
                    case 2:
                      yes++;
                      no_response--;
                      break;
                    case 3:
                      probably++;
                      no_response--;
                      break;
                    case 4:
                      maybe++;
                      no_response--;
                      break;
                    case 5:
                        no++;
                      no_response--;
                      break;
                    }
				}

                	// The rsvp responses data
	var data = [
		{
			name: 'Yes (' + yes + ')',
			y: yes,
			url: '#/team/id'
		},
		{
			name: 'Probably (' + probably + ')',
			y: probably,
			url: '#/team/id'
		},
		{
			name: 'Maybe (' + maybe + ')',
			y: maybe,
			url: '#/team/id'
		},
		{
			name: 'No (' + no + ')',
			y: no,
			url: '#/team/id'
		},
		{
			name: 'No Response (' + no_response + ')',
			y: no_response,
			url: '#/team/id'
		}
	];
                
	
	
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
			
			})
			.error(function(response) {
				$scope.events = 'An error occurred looking for your events. Please try again later.';
			});
	}
	

	
	// The colors to be used for the respones in the pie chart
	var colors = [
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
	
	
	
    $scope.activateEvent = function(event) {
       $scope.selected = event; 
    };
	
	$scope.activeClass = function(event) {
		return event === $scope.selected ? 'active' : undefined;
	}
	
	$scope.getEvents();	// Call on page load
	
}]);