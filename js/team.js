// Controller for the team page
myezteam.controller('TeamController', ['$scope', '$http', '$routeParams', '$rootScope', 'myezteamBase', function($scope, $http, $routeParams, $rootScope, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

    $scope.getTeam = function() {
        
        // Get all the players of a specific team
	    $http.get(baseUrl+'v1/teams/'+$routeParams.id + apiKey)
            .success(function(response) {
                $scope.team = response;
                $scope.team.showDelete = false;
                $rootScope.title = 'Team ' + $scope.team.name;
		    
                getPlayers($scope.team);
                $scope.getManagers();
                $scope.getEvents($scope.team.id);
                $scope.getTeamOwner($scope.team.id);
                
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
		$http.get(baseUrl+'v1/teams/'+team_id+'/owner' + apiKey)
		.success(function(response) {
			$scope.team_owner = response.first_name + " " + response.last_name;
			$scope.error = null;
		})
		.error(function(response) {
			$scope.success = null;
			$scope.error = 'An error occurred looking for your team\'s owner. Please try again later.';
		});

	}
	
	// Get all the managers for the team
	$scope.getManagers = function() {
	    
    	$http.get(baseUrl+'v1/teams/'+$routeParams.id + '/managers' + apiKey)
            .success(function(response) {
                $scope.managers = response;
                $scope.error = null;
            })
            .error(function(response) {
                $scope.success = null;
                $scope.error = 'An error occurred looking for your team\'s managers. Please try again later.';
            });
	}
		
	// Get all the players of a specific team
	var getPlayers = function(team) {
	
		// Get all the players of a specific team
		$http.get(baseUrl+'v1/teams/'+team.id+'/players' + apiKey)
		.success(function(response) {
			$scope.teamId = team.id;
			$scope.players = response;
			
			// Get all the managers for a team
    	    $http.get(baseUrl+'v1/teams/'+$routeParams.id + '/managers' + apiKey)
                .success(function(response) {
                    
                    var managers = response;
                    
                    // Loop through all the players on the team
			        for(var i = 0; i < $scope.players.length; i++) {
			            
			            // Set a default flag to show the edit/delete buttons 
			            $scope.players[i].showDelete = false;
			           
			            // Set a flag whether a player is a manager or not
			            if(contains(managers, $scope.players[i].user.id)) {
			                console.log('setting manager true');
                            $scope.players[i].manager = true;
                        } else {
                            $scope.players[i].manager = false;
                            console.log('setting manager false');
                        }
			        }
                    
                    $scope.error = null;
                })
                .error(function(response) {
                    $scope.success = null;
    				$scope.error = 'An error occurred looking for your team\'s managers. Please try again later.';
                });
			
			$scope.error = null;
		})
		.error(function(response) {
			$scope.success = null;
			$scope.error = 'An error occurred looking for your players. Please try again later.';
		});

	}

	// Get all of a users upcoming events
	$scope.getEvents = function(team_id, callback) {
	
		$http.get(baseUrl+'v1/teams/' + team_id + '/events' + apiKey)
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
				    // Note: Using angular .forEach instead of javascript for loop because it seems that it handles async in a for loop better than a standard for loop.
				    angular.forEach($scope.events, function(event, i) {
				        
				        $scope.events[i].showDelete = false;

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

	    $http.get(baseUrl+'v1/events/' + event_id + '/responses' + apiKey)
			.success(function(event_responses) {
				
			    $scope.error = null;
				$scope.responses = event_responses;
				//$scope.teamId = team_id;
				
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
	
	// Get a list of all the emails for a particular event
	$scope.getEmails = function(event_id) {
	    
	    $http.get(baseUrl+'v1/events/' + event_id + '/emails' + apiKey)
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
	    $http.get(baseUrl+'v1/players/team/' + $routeParams.id + '/me' + apiKey)
			.success(function(response) {
		        $scope.error = null;
				me = response;
				
				console.log(response);
				
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
			            
			            console.log(me);
			            
				        $scope.success = null;
			            $scope.error = 'An error occurred looking for your event\'s emails. Please try again later.';
			        });
			
			})
			.error(function(response) {
				$scope.success = null;
			    $scope.error = 'An error occurred looking for your player info. Please try again later.';
			});
	}
	
	// Make player a manager of the team
	$scope.add_manager = function(player) {
	    
	    var player_id = [player.user_id];
	    
	    $http.post(baseUrl+'v1/teams/' + $scope.team.id + '/managers' + apiKey, player_id)
			.success(function(response) {
		        $scope.error = null;
		        $scope.success = player.user.first_name + ' ' + player.user.last_name + ' has been promoted to manager';
		        
		        getPlayers($scope.team);    // Reload the players
			})
			.error(function(response) {
				$scope.success = null;
			    $scope.error = 'An error occurred trying to promote ' + player.user.first_name + ' ' + player.user.last_name + ' to manager. Please try again later.';
			});
	}
	
	// Relieve player of manager duties
	$scope.remove_manager = function(player) {
	    
	    $http.delete(baseUrl+'v1/teams/' + $scope.team.id + '/managers/' + player.user_id + apiKey)
			.success(function(response) {
		        $scope.error = null;
		        $scope.success = player.user.first_name + ' ' + player.user.last_name + ' has been relieved from manager duties';
		        
		        getPlayers($scope.team);    // Reload the players
			})
			.error(function(response) {
				$scope.success = null;
			    $scope.error = 'An error occurred trying to relieve ' + player.user.first_name + ' ' + player.user.last_name + ' of manager duties. Please try again later.';
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
	
	// Shows/hides the delete button when hovering over a player
	$scope.hover = function(object) {
        return object.showDelete = ! object.showDelete;
    };

    // Removes a player from a team
    $scope.delete = function(player) {
        // Get all the players of a specific team
		$http.delete(baseUrl+'v1/players/' + player.id + apiKey)
            .success(function(response) {
			    
			    // Set the player first/last name to empty strings if they are null
			    player.user.first_name = player.user.first_name == null ? '' : player.user.first_name
			    player.user.last_name = player.user.last_name == null ? '' : player.user.last_name
			    
			    $scope.error = null;
				$scope.success = player.user.first_name + ' ' + player.user.last_name + '(' + player.user.email + ') has been removed from this team';
            })
            .error(function(response) {
                // Set the player first/last name to empty strings if they are null
			    player.user.first_name = player.user.first_name == null ? '' : player.user.first_name
			    player.user.last_name = player.user.last_name == null ? '' : player.user.last_name
			    
			    $scope.success = null;
			    $scope.error = 'An error occurred trying to delete ' + player.user.first_name + ' ' + player.user.last_name + '(' + player.user.email + '). Please try again later.';
		    });
        
        $scope.getTeam();   // Reload all the info so the players get updated
    };
    
    // Checks if the passed in user id is an owner of the team
    $scope.is_owner = function(id) {
        if($scope.team.owner_id == id) {
            return true;
        } else {
            return false;
        }
    }
    
    // Checks if the passed in user id is a manager of the team
    $scope.is_manager = function(id) {
        if(contains($scope.managers, id)) {
            return true;
        } else {
            return false;
        }
    }
	
	$scope.getTeam();	// Call on page load
	
	
	// TEMP METHOD TO TEST THE SENDING OF EMAILS
    $scope.send = function(email) {
	
		// Get all the players of a specific team
		$http.post(baseUrl+'v1/emails/'+email.id+'/send' + apiKey)
		.success(function(response) {
			//$scope.team_owner = response.first_name + " " + response.last_name;
			$scope.error = null;
		})
		.error(function(response) {
			$scope.success = null;
			$scope.error = 'An error occurred sending your event\'s email. Please try again later.';
		});

	}
	
}]);