// Controller for the teams page
myezteam.controller('DashboardController', ['$scope', '$http', '$location', 'teamsFactory', 'chartService', 'myezteamBase', function($scope, $http, $location, teamsFactory, chartService, myezteamBase) {

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
				
				// If any events exist
				if($scope.events.length > 0) {
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
    			                
    			                // Get the players teams
    			                getTeams(function(the_teams) {
    			                    
    			                    // Loop through the teams
        			                for(var j = 0; j < the_teams.length; j++) {
        			                    
        			                    // If the current event's team_id matches the current team's team_id, set the team name on the event object
        			                    if($scope.events[i].team_id == the_teams[j].id) {
        			                        $scope.events[i].team_name = the_teams[j].name;
        			                        break;
        			                    }
        			                }
    			                });
    			                
    			                
    			                 
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
		                                $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
                            		}); 
			                })
			            .error(function(response2) {
			                $scope.success = null;
			                $scope.error = 'An error occurred retrieving your rsvp responses for the events. Please try again later.';
		                    $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
			            });
				});
				}
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred looking for your events. Please try again later.';
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
			});
	}
	
	// Gets all of a user's teams
	function getTeams(callback) {
	    
	    teamsFactory.get_teams(function(response) {
	        
	        
	        //console.log('app teams = ');
	        //console.log(teamsFactory.get_teams());
	        
	        //var all_teams = teamsFactory.get_teams(); 
	        //var all_teams = teams.get_teams();
	        var all_teams = response;
	        
	        //console.log('all_teams');
	        //console.log(all_teams);
	        
	        var unique_teams = [];
	        
	        // Add the teams to $scope.teams, without adding duplicates
	        unique_teams = add_teams(unique_teams, all_teams.owner, "owner", false);
	        unique_teams = add_teams(unique_teams, all_teams.manager, "manager", false);
	        unique_teams = add_teams(unique_teams, all_teams.player, "player", false);
	        
	        // Somehow this magic little number only calls the callback if it's actually a function
            // http://stackoverflow.com/questions/6792663/javascript-style-optional-callbacks
            typeof callback === 'function' && callback(unique_teams);
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
				var rsvp_responses = {
				    no_response: $scope.responses.length,
				    yes: 0,
				    probably: 0,
				    maybe: 0,
				    no: 0
				}
				
				rsvp_responses = chartService.set_responses($scope.responses, rsvp_responses);
				
				// Loop through all the responses
				for(var i = 0; i < $scope.responses.length; i++) {
				    
                    // Set the players display_name, based on whether they have a first and last name or not
                    if($scope.responses[i].player_info.firstName == null && $scope.responses[i].player_info.lastName == null) {
                        $scope.responses[i].display_name = $scope.responses[i].player_info.email;
                    } else {
                        $scope.responses[i].display_name = $scope.responses[i].player_info.firstName + ' ' + $scope.responses[i].player_info.lastName;
                    }
				}
                	
                $scope.chartConfig = chartService.setup_chart($scope.teamId, event_name, rsvp_responses);
			})
			.error(function(response) {
				$scope.success = null;
				$scope.error = 'An error occurred looking for your events. Please try again later.';
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
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
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
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
		                $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
                    })
			        .error(function(response) {
				        $scope.success = null;
			            $scope.error = 'An error occurred looking for your event\'s emails. Please try again later.';
		                $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
			        });
			
			})
			.error(function(response) {
				$scope.success = null;
			    $scope.error = 'An error occurred looking for your player info. Please try again later.';
		        $("html, body").animate({ scrollTop: 0 }, "slow");  // scroll to top of page so success/error message is visible
			});
	}

    $scope.activateEvent = function(event) {
       $scope.selected = event; 
    };
	
	// Sets the active class when an event is clicked
	$scope.activeClass = function(event) {
		return event === $scope.selected ? 'active' : undefined;
	}
	
	// Call on page load
	$scope.getEvents();	
	chartService.set_colors();  // Set the chart's gradients colors
	
}]);