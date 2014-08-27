// Controller for the team page
myezteam.controller('TeamController', ['$scope', '$http', '$routeParams', '$rootScope', 'chartService', 'myezteamBase',
	function($scope, $http, $routeParams, $rootScope, chartService, myezteamBase) {

		var me = null;

		myezteamBase.getAuthHeader();
		myezteamBase.getProfile(function(response) {
			$scope.profile = response;
		});

		/**
		 * Sets a boolean value whether or not we are rsvp'ing for another player
		 */
		$scope.setRsvpAsPlayer = function(value) {
			$scope.rsvpAsPlayer = value;
		}

		$scope.getTeam = function() {

			// Get all the players of a specific team
			$http.get(baseUrl + 'v1/teams/' + $routeParams.id + apiKey)
				.success(function(response) {
					$scope.team = response;
					$scope.team.showDelete = false;
					$rootScope.title = 'Team ' + $scope.team.name;
					getPlayers($scope.team);
					$scope.error = null;
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred looking for your team\'s players. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});
		}

		// Get team owner
		$scope.getTeamOwner = function(team_id) {

			// Get all the players of a specific team
			$http.get(baseUrl + 'v1/teams/' + team_id + '/owner' + apiKey)
				.success(function(response) {
					$scope.team_owner = response.first_name + " " + response.last_name;
					$scope.error = null;
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred looking for your team\'s owner. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});

		}

		// Get all the managers for the team
		var getManagers = function(callback) {

			$http.get(baseUrl + 'v1/teams/' + $routeParams.id + '/managers' + apiKey)
				.success(function(managers) {


					// Set the players display_name, based on whether they have a first and last name or not
					for (var i = 0; i < managers.length; i++) {
						if (managers[i].first_name == null && managers[i].last_name == null) {
							managers[i].display_name = managers[i].email;
						} else {
							managers[i].display_name = managers[i].first_name + ' ' + managers[i].last_name;
						}
					}

					$scope.error = null;
					// Somehow this magic little number only calls the callback if it's actually a function
					// http://stackoverflow.com/questions/6792663/javascript-style-optional-callbacks
					typeof callback === 'function' && callback(managers);
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred looking for your team\'s managers. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});
		}

		// Get all the players of a specific team
		var getPlayers = function(team) {

			// Get all the players of a specific team
			$http.get(baseUrl + 'v1/teams/' + team.id + '/players' + apiKey)
				.success(function(response) {
					$scope.teamId = team.id;
					$scope.players = response;

					// Get all the managers for a team
					getManagers(function(managers) {

						$scope.team.managers = managers;
						$scope.getEvents($scope.team.id);
						$scope.getTeamOwner($scope.team.id);

						// Loop through all the players on the team
						for (var i = 0; i < $scope.players.length; i++) {

							// Set a default flag to show the edit/delete buttons 
							$scope.players[i].showDelete = false;

							// Set a flag whether a player is a manager or not
							if ($scope.is_manager($scope.team, $scope.players[i].user.id)) {
								$scope.players[i].manager = true;
							} else {
								$scope.players[i].manager = false;
							}

							// Set a flag whether a player is the owner or not
							if ($scope.is_owner($scope.team.owner_id, $scope.players[i].user.id)) {
								$scope.players[i].owner = true;
							} else {
								$scope.players[i].owner = false;
							}
						}
					});
					
					$scope.players = setDisplayName($scope.players);
					$scope.error = null;
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred looking for your players. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});

		}

		// Get all of a users upcoming events
		$scope.getEvents = function(team_id, callback) {

			$http.get(baseUrl + 'v1/teams/' + team_id + '/events' + apiKey)
				.success(function(response) {

					$scope.events = response;
					$scope.selected = response[0];

					// If there are events, get the players responses
					if ($scope.events != '') {
						var event_id = response[0].id;
						var event_name = response[0].name;
						var team_id = response[0].team_id;
						$scope.getResponses(event_id, event_name, team_id);

						// Loop through all the events to set the logged in user's response on the event object
						// Note: Using angular .forEach instead of javascript for loop because it seems that it handles async in a for loop better than a standard for loop.
						angular.forEach($scope.events, function(event, i) {

							$scope.events[i].showDelete = false;

							// If the logged in user is an owner or manager, get the emails
							if ($scope.is_owner($scope.team.owner_id, me.user_id) || $scope.is_manager($scope.team.owner_id, me.user_id)) {
								$scope.getEmails(event_id);
							}

							// Get the logged in user's response for the current event
							$http.get(baseUrl + 'v1/responses/' + event.id + apiKey)
								.success(function(response2) {

									// If any responses exist, set the logged in user's response to the current event object, 
									// else set their response as the default response
									if (response2.length > 0) {
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
									$("html, body").animate({
										scrollTop: 0
									}, "slow"); // scroll to top of page so success/error message is visible
								});
						});
					}

					$scope.error = null;
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred looking for your events. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});
		}

		// Get all of the responses for a particular event
		$scope.getResponses = function(event_id, event_name, team_id) {

			$http.get(baseUrl + 'v1/events/' + event_id + '/responses' + apiKey)
				.success(function(event_responses) {

					$scope.error = null;
					$scope.responses = event_responses;

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
					for (var i = 0; i < $scope.responses.length; i++) {

						// Set the players display_name, based on whether they have a first and last name or not
						if ($scope.responses[i].player_info.firstName == null && $scope.responses[i].player_info.lastName == null) {
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
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});
		}

		// Get a list of all the emails for a particular event
		$scope.getEmails = function(event_id) {

			// If the logged in user is an owner or manager, get the emails
			if ($scope.is_owner($scope.team.owner_id, me.user_id) || $scope.is_manager($scope.team.owner_id, me.user_id)) {
				$http.get(baseUrl + 'v1/events/' + event_id + '/emails' + apiKey)
					.success(function(response) {
						$scope.error = null;
						$scope.emails = response;
					})
					.error(function(response) {
						$scope.success = null;
						$scope.error = 'An error occurred looking for your event\'s emails. Please try again later.';
						$("html, body").animate({
							scrollTop: 0
						}, "slow"); // scroll to top of page so success/error message is visible
					});
			}
		}
		
		$scope.response = {};	// Need to explicitly set this so that we can clear it due to child inheritance.

		// RSVP to an event
		$scope.rsvp = function(event_id, response_id, comment, player_id) {

			console.log(event_id);
			console.log(response_id);
			console.log(comment);
			console.log(player_id);

			var me = null;

			// Get the logged in user's player_id for the particular team page that the user is on
			$http.get(baseUrl + 'v1/players/team/' + $routeParams.id + '/me' + apiKey)
				.success(function(me) {
					$scope.error = null;

					console.log('player_id = '+player_id);

					// Set the player_id to either the logged in user, or the person being RSVP'd for if we're rsvp'ing for someone else
					player_id = player_id || me.id;
					
					console.log('2player_id = '+player_id);

					// The rsvp response data to be posted
					var rsvp = {
						"response_type_id": response_id,
						"event_id": event_id,
						"player_id": player_id,
						"comment": comment
					}

					// Rsvp the selected event with the logged in user
					$http.post(baseUrl + 'v1/responses' + apiKey, rsvp)
						.success(function(response) {

							// Refresh the responses and the chart
							var selected = $scope.selected;
							$scope.getEvents($routeParams.id, function() {
								$scope.getResponses(selected.id, selected.name);
								$scope.activateEvent(selected);
								$scope.getEmails(selected.id);

								$('#' + selected.id).addClass('active');
							});

							$scope.error = null;
							$scope.response = null;
							$scope.success = 'Your response has been saved';
							$("html, body").animate({
								scrollTop: 0
							}, "slow"); // scroll to top of page so success/error message is visible
							
						})
						.error(function(response) {
							$scope.success = null;
							$scope.error = 'An error occurred looking for your event\'s emails. Please try again later.';
							$("html, body").animate({
								scrollTop: 0
							}, "slow"); // scroll to top of page so success/error message is visible
						});

				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred looking for your player info. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});
		}

		// Get the logged in user's data
		var getMe = function(team_id, callback) {

			$http.get(baseUrl + 'v1/players/team/' + team_id + '/me' + apiKey)
				.success(function(response) {
					me = response;
					$scope.error = null;
					// Somehow this magic little number only calls the callback if it's actually a function
					// http://stackoverflow.com/questions/6792663/javascript-style-optional-callbacks
					typeof callback === 'function' && callback(response);
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred looking for your player info. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
					// Somehow this magic little number only calls the callback if it's actually a function
					// http://stackoverflow.com/questions/6792663/javascript-style-optional-callbacks
					typeof callback === 'function' && callback();
				});
		}

		// Make player a manager of the team
		$scope.add_manager = function(player) {

			var player_id = [player.user_id];

			$http.post(baseUrl + 'v1/teams/' + $scope.team.id + '/managers' + apiKey, player_id)
				.success(function(response) {
					$scope.error = null;

					// If the player has a name
					if (player.user.first_name != null) {
						$scope.success = player.user.first_name + ' ' + player.user.last_name + ' has been promoted to manager';
					} else {
						$scope.success = player.user.email + ' has been promoted to manager';
					}

					getPlayers($scope.team); // Reload the players
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred trying to promote ' + player.user.first_name + ' ' + player.user.last_name + ' to manager. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});
		}

		// Relieve player of manager duties
		$scope.remove_manager = function(player) {

			$http.delete(baseUrl + 'v1/teams/' + $scope.team.id + '/managers/' + player.user_id + apiKey)
				.success(function(response) {
					$scope.error = null;
					$scope.success = player.user.first_name + ' ' + player.user.last_name + ' has been relieved from manager duties';

					getPlayers($scope.team); // Reload the players
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred trying to relieve ' + player.user.first_name + ' ' + player.user.last_name + ' of manager duties. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});
		}

		// Hack/Fix to resize the highcharts graph when the tab is displayed - http://stackoverflow.com/questions/16216722/highcharts-hidden-charts-dont-get-re-size-properly
		$scope.onEventTabClick = function() {
			$(window).resize();
		}

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
			return object.showDelete = !object.showDelete;
		};

		/**
		 * Updates a player's player_type
		 * @param player            - The player to update
		 * @param player_type_id    - The player type to set the new player to.
		 */
		$scope.update_player_type = function(player, player_type_id) {

			// Update a player's type
			$http.put(baseUrl + 'v1/players/' + player.id + '/' + player_type_id + apiKey)
				.success(function(response) {

					// Set the player first/last name to empty strings if they are null
					player.user.first_name = player.user.first_name == null ? '' : player.user.first_name
					player.user.last_name = player.user.last_name == null ? '' : player.user.last_name
					getPlayers($scope.team); // Reload the players
					$scope.error = null;
					$scope.success = player.user.first_name + ' ' + player.user.last_name + '(' + player.user.email + ') has been updated.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				})
				.error(function(response) {

					// Set the player first/last name to empty strings if they are null
					player.user.first_name = player.user.first_name == null ? '' : player.user.first_name
					player.user.last_name = player.user.last_name == null ? '' : player.user.last_name
					$scope.success = null;
					$scope.error = 'An error occurred trying to update ' + player.user.first_name + ' ' + player.user.last_name + '(' + player.user.email + '). Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});
		}

		// Removes a player from a team
		$scope.delete_player = function(player) {
			// Get all the players of a specific team
			$http.delete(baseUrl + 'v1/players/' + player.id + apiKey)
				.success(function(response) {

					// Set the player first/last name to empty strings if they are null
					player.user.first_name = player.user.first_name == null ? '' : player.user.first_name
					player.user.last_name = player.user.last_name == null ? '' : player.user.last_name

					$scope.error = null;
					$scope.success = player.user.first_name + ' ' + player.user.last_name + '(' + player.user.email + ') has been removed from this team';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				})
				.error(function(response) {
					// Set the player first/last name to empty strings if they are null
					player.user.first_name = player.user.first_name == null ? '' : player.user.first_name
					player.user.last_name = player.user.last_name == null ? '' : player.user.last_name

					$scope.success = null;
					$scope.error = 'An error occurred trying to delete ' + player.user.first_name + ' ' + player.user.last_name + '(' + player.user.email + '). Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});

			$scope.getTeam(); // Reload all the info so the players get updated
		};

		// Removes an event email
		$scope.delete_email = function(email) {
			// Get all the players of a specific team
			$http.delete(baseUrl + 'v1/emails/' + email.id + apiKey)
				.success(function(response) {
					$scope.error = null;
					$scope.success = email.title + ' has been removed';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred trying to delete ' + email.title + '. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});

			$scope.getTeam(); // Reload all the info so the emails get updated
		};

		/**
		 * Removes an event
		 */
		$scope.delete_event = function(event) {
			// Get all the players of a specific team
			$http.delete(baseUrl + 'v1/events/' + event.id + apiKey)
				.success(function(response) {
					$scope.error = null;
					$scope.success = event.name + ' has been removed';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred trying to delete ' + event.name + '. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});

			$scope.getTeam(); // Reload all the info so the emails get updated
		};

		/**
		 * Sends an event email now
		 */
		$scope.send_now = function(email) {
			// Get all the players of a specific team
			$http.post(baseUrl + 'v1/emails/' + email.id + '/send' + apiKey)
				.success(function(response) {
					$scope.error = null;
					$scope.success = email.title + ' has been sent';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				})
				.error(function(response) {
					$scope.success = null;
					$scope.error = 'An error occurred trying to send ' + email.title + '. Please try again later.';
					$("html, body").animate({
						scrollTop: 0
					}, "slow"); // scroll to top of page so success/error message is visible
				});
		};

		/**
		 * Sets the current event so that we can use it in a modal
		 */
		$scope.set_current_event = function(event) {
			$scope.current_event = event;
		};

		/**
		 * Checks if the logged in user is the owner of the team
		 *
		 * @param team      - The team we're checking if the user manages
		 * @param user_id   - The user we're checking if they manage the team
		 */
		$scope.is_owner = function(owner_id, user_id) {
			if (owner_id == user_id) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * Checks if the logged in user is a manager of the team
		 *
		 * @param team      - The team we're checking if the user manages
		 * @param user_id   - The user we're checking if they manage the team
		 * @return					- A boolean whether the user is a manager of the team or not
		 */
		$scope.is_manager = function(team, user_id) {

			// If team exists
			if (typeof team !== 'undefined' && typeof team.managers !== 'undefined') {
				for (var i = 0; i < team.managers.length; i++) {
					if (team.managers[i].id == user_id) {
						return true;
					}
				}
			}

			return false;
		}

		/**
		 * Checks if a user is a player on the team. Need this method so that managers of a team can't rsvp if they're only a manager and not a player
		 * 
		 * @param user_id   - The user that we want to check if they're a player of a team
		 * @return					- A boolean whether the user is a player or not
		 */
		$scope.is_player = function(user_id) {

			// Loop through all the players of the team
			for (var i = 0; i < $scope.players.length; i++) {

				// If the current player in the loop's user id matches what was passed in
				if ($scope.players[i].user.id == user_id) {
					return true;
				}
			}

			return false;
		}
		
		/**
		 * Set the players display_name, based on whether they have a first and last name or not
		 *
		 * @param users		- The array of users to set the display names
		 * @return 				- The array of users that now contain the display names
		 */
		var setDisplayName = function(users) {
			
			for (var i = 0; i < users.length; i++) {
				if (users[i].user.first_name == null && users[i].user.last_name == null) {
					users[i].display_name = users[i].user.email;
				} else {
					users[i].display_name = users[i].user.first_name + ' ' + users[i].user.last_name;
				}
			}

			return users;
		}

		// Call on page load
		getMe($routeParams.id, function() {
			$scope.getTeam();
		});
		chartService.set_colors(); // Set the chart's gradients colors

	}
]);
