// Controller for the create team page
myezteam.controller('EmailResponseController', ['$scope', '$http', '$routeParams', '$filter', 'myezteamBase', function($scope, $http, $routeParams, $filter, myezteamBase) {

	// TODO: These needed for this controller?
	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
	
	// Stuff here
	

}]);