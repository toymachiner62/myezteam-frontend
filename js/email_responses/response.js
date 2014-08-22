// Controller for the create team page
myezteamLogin.controller('EmailResponseController', ['$scope', '$rootScope', '$http', '$routeParams', '$filter', function($scope, $rootScope, $http, $routeParams, $filter) {

	// NOTE: NEED TO HAVE THE CREDENTIALS REQUIRED RESTRICTION REMOVED TO GET THE DATA WITHOUT BEING LOGGEDIN
	// Fetch the data for the event being RSVP'ed to
	//$http.get(baseUrl + 'v1/events/' + $routeParams.event_id)
	//	.success(function(event) {

	//		$scope.event = event;

			// Record the users RSVP for this event
			$http.get(baseUrl + 'v1/responses/email_rsvp/' + $routeParams.event_id + '/' + $routeParams.player_id + '/' + $routeParams.response_type_id + '/' + $routeParams.response_key)
				.success(function(response) {
					$scope.error = null;
					$scope.response = $routeParams.response_type_id.getTextResponse();
				})
				.error(function(response) {
					$scope.error = response.message;
				});

	//	})
	//	.error(function(response) {
	//		$scope.error = response.message;
	//	});



	/**
	 * Gets a textual representation of a response_type_id
	 *
	 * @returns	- The textual representation of a response_type_id. i.e. 2 returns "Yes", 3 returns "Maybe", etc
	 */
	String.prototype.getTextResponse = function() {

		switch (this[0])
			{
			case "2":
				return "Yes";
				break;
			case "3":
				return "Probably";
				break;
			case "4":
				return "Maybe";
				break;
			case "5":
				return "No";
				break;
			default:
				return undefined;
			}

	}

}]);
