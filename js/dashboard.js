// Controller for the teams page
myezteam.controller('DashboardController', ['$scope', '$http', '$location', 'myezteamBase', function($scope, $http, $location, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
    
	// Get all of a users upcoming events
	$scope.getEvents = function(callback) {
	
		$http.get(baseUrl+'v1/events' + apiKey)
			.success(function(response) {
				$scope.error = null;
				$scope.events = response;
				$scope.teamId = $scope.events[0].team_id;
				
			    var event_id = $scope.events[0].id;
			    var event_name = $scope.events[0].name;
			    var team_id = $scope.events[0].team_id;
			    
			    $scope.selected = $scope.events[0];
				$scope.getResponses(event_id, event_name, team_id);
				
				// Loop through all the events to set the logged in user's response on the event object
				// Note: Using angular .forEach instead of javascript for loop because it handles async in a for loop out of the box.
				angular.forEach($scope.events, function(event, i) {

				    // Get the logged in user's response for the current event
                    $http.get(baseUrl+'v1/responses/' + event.id + apiKey)
			            .success(function(response2) {
			                    
			                // If any responses exist, set the logged in user's response to the current event object, 
			                // else set their response as the default response
			                if(response2.length > 0) {
			                    $scope.events[i].my_response = response2[0].response.label;
			                } else {
			                    $scope.events[i].my_response = event.default_response.label;
			                }   
			                 
                             // Get all the players on a given team
                            $http.get(baseUrl+'v1/teams/'+event.team_id+'/players' + apiKey)
                            	.success(function(players) {
                        			
                        			$scope.events[i].players = players;
                        			
                        			getMe(event.team_id, function(me) {
                        			
                            			// Set a flag whether to show the rsvp buttons for a particular event
                        			    if(contains($scope.events[i].players, me.id)) {
                                            $scope.events[i].show_rsvp = true;
                                        } else {
                                            $scope.events[i].show_rsvp = false;
                                        }
                            			
            			                // Somehow this magic little number only calls the callback if it's actually a function
            				            // http://stackoverflow.com/questions/6792663/javascript-style-optional-callbacks
            				            typeof callback === 'function' && callback();
                        			});
                        		})
                        		.error(function(response3) {
                        			$scope.success = null;
                        			$scope.error = 'An error occurred looking for a teams players. Please try again later.';
                        		}); 
			            })
			            .error(function(response2) {
			                $scope.success = null;
			                $scope.error = 'An error occurred retrieving your rsvp responses for the events. Please try again later.';
			            });
				});
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred looking for your events. Please try again later.';
			});
	}
	
	// Get all of the responses for a particular event
	$scope.getResponses = function(event_id, event_name, team_id) {

	    $http.get(baseUrl+'v1/events/' + event_id + '/responses' + apiKey)
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
				
				// Loop through all the responses
				for(var i = 0; i < $scope.responses.length; i++) {
				    
				    // count the response types (2 yes's, 3 maybe's, etc)
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
                    
                    // Set the players display_name, based on whether they have a first and last name or not
                    if($scope.responses[i].player_info.firstName == null && $scope.responses[i].player_info.lastName == null) {
                        $scope.responses[i].display_name = $scope.responses[i].player_info.email;
                    } else {
                        $scope.responses[i].display_name = $scope.responses[i].player_info.firstName + ' ' + $scope.responses[i].player_info.lastName;
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
	
	// Get the logged in user's data
	var getMe = function(team_id, callback) {
	    
	    $http.get(baseUrl+'v1/players/team/' + team_id + '/me' + apiKey)
			.success(function(response) {
			    $scope.error = null;
			    // Somehow this magic little number only calls the callback if it's actually a function
                // http://stackoverflow.com/questions/6792663/javascript-style-optional-callbacks
            	typeof callback === 'function' && callback(response);
			})
			.error(function(response) {
				$scope.success = null;
			    $scope.error = 'An error occurred looking for your player info. Please try again later.';
			    // Somehow this magic little number only calls the callback if it's actually a function
                // http://stackoverflow.com/questions/6792663/javascript-style-optional-callbacks
            	typeof callback === 'function' && callback();
			});
	}
	
	// RSVP to an event
	$scope.rsvp = function(event_id, team_id, response_id) {
	    
	    var me = null;
	    
	    // Get the logged in user's player_id for the particular team page that the user is on
	    $http.get(baseUrl+'v1/players/team/' + team_id + '/me' + apiKey)
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
                $http.post(baseUrl+'v1/responses' + apiKey, rsvp)
                    .success(function(response) {
                        
                        // Refresh the responses and the chart
                        var selected = $scope.selected;
                        $scope.getEvents(function() {
                            $scope.getResponses(selected.id, selected.name); 
                            $scope.activateEvent(selected);
                            
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

    $scope.activateEvent = function(event) {
       $scope.selected = event; 
    };
	
	// Sets the active class when an event is clicked
	$scope.activeClass = function(event) {
		return event === $scope.selected ? 'active' : undefined;
	}
	
	$scope.getEvents();	// Call on page load
	//getMe();
	
}]);