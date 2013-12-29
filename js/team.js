// Controller for the team page
myezteam.controller('TeamController', ['$scope', '$http', '$routeParams', '$rootScope', 'myezteamBase', function($scope, $http, $routeParams, $rootScope, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

    $scope.getTeam = function() {
        
        // Get all the players of a specific team
	    $http.get(baseUrl+'v1/teams/'+$routeParams.id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
            .success(function(response) {
                $scope.team = response;
                $rootScope.title = 'Team ' + response.name;
		    
                $scope.getPlayers(response.id, response.name, response.type, response.default_location, response.description);
                $scope.getEvents(response.id);
                $scope.getTeamOwner(response.id);
                
                $scope.error = null;
            })
            .error(function(response) {
                $scope.success = null;
				$scope.error = 'An error occurred looking for your team\'s players. Please try again later.';
            });
    }
    
    // Get team owner
    $scope.getTeamOwner = function(team_id) {
	
		// Get all the players of a specific team
		$http.get(baseUrl+'v1/teams/'+team_id+'/owner?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		.success(function(response) {
			$scope.teamOwner = response.first_name + " " + response.last_name;
			$scope.error = null;
		})
		.error(function(response) {
			$scope.success = null;
			$scope.error = 'An error occurred looking for your team\'s owner. Please try again later.';
		});

	}
		
	// Get all the players of a specific team
	$scope.getPlayers = function(team_id, team_name, team_type, team_location, team_description) {
	
		// Get all the players of a specific team
		$http.get(baseUrl+'v1/teams/'+team_id+'/players?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		.success(function(response) {
			$scope.teamId = team_id;
			$scope.teamName = team_name;
			$scope.teamType = team_type;
			$scope.teamLocation = team_location;
			$scope.teamDescription = team_description;
			$scope.players = response;
			$scope.error = null;
		})
		.error(function(response) {
			$scope.success = null;
			$scope.error = 'An error occurred looking for your players. Please try again later.';
		});

	}
	
	// Get all of a users upcoming events
	$scope.getEvents = function(team_id, callback) {
	
		$http.get(baseUrl+'v1/teams/' + team_id + '/events?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
		        
				$scope.events = response;
				$scope.selected = response[0];

                // If there are events, get the players responses
				if($scope.events != '') {
                    var event_id = response[0].id;
                    var event_name = response[0].name;
                    var team_id = response[0].team_id;
				    $scope.getResponses(event_id, event_name, team_id);
				    $scope.getEmails(event_id);
				    
				    // Loop through all the events to set the logged in user's response on the event object
				    // Note: Using angular .forEach instead of javascript for loop because it handles async in a for loop out of the box.
				    angular.forEach($scope.events, function(event, i) {

				        // Get the logged in user's response for the current event
                        $http.get(baseUrl+'v1/responses/' + event.id + '?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			                .success(function(response2) {
			                    
			                    // If any responses exist, set the logged in user's response to the current event object, 
			                    // else set their response as the default response
			                    if(response2.length > 0) {
			                        $scope.events[i].my_response = response2[0].response.label;
			                    } else {
			                        $scope.events[i].my_response = event.default_response.label;
			                    }
			                    
			                    // Somehow this magic little number only calls the callback if it's actually a function
				                // http://stackoverflow.com/questions/6792663/javascript-style-optional-callbacks
				                typeof callback === 'function' && callback();
			                })
			                .error(function(response2) {
				                $scope.success = null;
			                    $scope.error = 'An error occurred retrieving your rsvp responses for the events. Please try again later.';
			                });
				    });
				}
				
				$scope.error = null;
			})
			.error(function(response) {
				$scope.success = null;
			    $scope.error = 'An error occurred looking for your events. Please try again later.';
			});
	}
	
	// Get all of the responses for a particular event
	$scope.getResponses = function(event_id, event_name, team_id) {

	    $http.get(baseUrl+'v1/events/' + event_id + '/responses?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(event_responses) {
				
			    $scope.error = null;
				$scope.responses = event_responses;
				$scope.teamId = team_id;
				
				// initially set the no_responses to the total number of responses. We'll change this as we loop through the responses
				var no_response = $scope.responses.length;  
				var yes = 0;
				var probably = 0;
				var maybe = 0;
				var no = 0;
				
				// count the response types (2 yes's, 3 maybe's, etc)
				for(var i = 0; i < $scope.responses.length; i++) {
				    
				    switch ($scope.responses[i].response.id)
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
                        url: '#/team/'+team_id
                    },
                    {
                        name: 'Probably (' + probably + ')',
                        y: probably,
                        url: '#/team/'+team_id
                    },
                    {
                        name: 'Maybe (' + maybe + ')',
                        y: maybe,
                        url: '#/team/'+team_id
                    },
                    {
                        name: 'No (' + no + ')',
                        y: no,
                        url: '#/team/'+team_id
                    },
                    {
                        name: 'No Response (' + no_response + ')',
                        y: no_response,
                        url: '#/team/'+team_id
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
                        text: 'RSVP Responses for ' + event_name
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
            				    $location.path(e.point.options.url);
                            }	
                        },
                        data: data
                    }]
	            }
			
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred looking for your events. Please try again later.';
			});
	}
	
	// Get a list of all the emails for a particular event
	$scope.getEmails = function(event_id) {
	    
	    $http.get(baseUrl+'v1/events/' + event_id + '/emails?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
		        $scope.error = null;
				$scope.emails = response;
			})
			.error(function(response) {
				$scope.success = null;
			    $scope.error = 'An error occurred looking for your event\'s emails. Please try again later.';
			});
	}

	// RSVP to an event
	$scope.rsvp = function(event_id, response_id) {
	    
	    var me = null;
	    
	    // Get the logged in user's player_id for the particular team page that the user is on
	    $http.get(baseUrl+'v1/players/team/' + $routeParams.id + '/me?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
		        $scope.error = null;
				me = response;
				
				// The rsvp response data to be posted
                var rsvp = {
                    "response_type_id":response_id,
                    "event_id":event_id,
                    "player_id":me.id
                }
				
				// Rsvp the selected event with the logged in user
                $http.post(baseUrl+'v1/responses?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d', rsvp)
                    .success(function(response) {
                        
                        // Refresh the responses and the chart
                        var selected = $scope.selected;
                        $scope.getEvents($routeParams.id, function() {
                            $scope.getResponses(selected.id, selected.name); 
                            $scope.activateEvent(selected);
                            $scope.getEmails(selected.id);
                            
                            $('#'+selected.id).addClass('active');
                        }); 
                        
                        $scope.error = null;
				        $scope.success = 'Your response has been saved';
                    })
			        .error(function(response) {
				        $scope.success = null;
			            $scope.error = 'An error occurred looking for your event\'s emails. Please try again later.';
			        });
			
			})
			.error(function(response) {
				$scope.success = null;
			    $scope.error = 'An error occurred looking for your player info. Please try again later.';
			});
	}
	
	// Get all the players of a specific team
	$scope.deleteTeam = function(team_id) {
	
		//delete $http.defaults.headers.common['X-Requested-With'];
		// Get all the players of a specific team
		$http.delete(baseUrl+'v1/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
		//$http({method: 'DELETE', url: baseUrl+'v1/team/'+team_id+'?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d'})
		.success(function(response) {
			
		})
		.error(function(response) {
			$scope['players'] = 'An error occurred looking for your players. Please try again later.';
		});

	}
	
	// Hack/Fix to resize the highcharts graph when the tab is displayed - http://stackoverflow.com/questions/16216722/highcharts-hidden-charts-dont-get-re-size-properly
	$scope.onEventTabClick = function() {
	    $(window).resize();
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

    // Sets the event clicked as the active one
	$scope.activateEvent = function(event) {
       $scope.selected = event; 
    };
	
	// Sets the active class when an event is clicked
	$scope.activeClass = function(event) {
		return event === $scope.selected ? 'active' : '';
	}
	
	$scope.getTeam();	// Call on page load
	
}]);