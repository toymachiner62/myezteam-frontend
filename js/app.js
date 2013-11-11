var token = sessionStorage.getItem("token");
var baseUrl = 'http://myezteam-webservices.herokuapp.com/';

var myezteam = angular.module('myezteam', []);

myezteam.config(function($routeProvider) {
	$routeProvider
		.when('/profile', 
			{
				title: 'My Profile',
				controller: 'ProfileController',
				templateUrl: 'partials/profile.html',
				activetab: 'profile'
			})
		.when('/teams',
			{
				title: 'My Teams',
				controller: 'TeamsController',
				templateUrl: 'partials/teams.html',
				activetab: 'teams'
			})
		.when('/teams/create',
			{
				title: 'Create Team',
				controller: 'CreateTeamController',
				templateUrl: 'partials/create-team.html',
				activetab: 'teams'
			})
		.when('/teams/add-player',
			{
				title: 'Add Player',
				controller: 'AddPlayerToTeamController',
				templateUrl: 'partials/add-player-to-team.html',
				activetab: 'teams'
			})
		.otherwise({redirectTo: '/teams'});
});

// Sets the page title
myezteam.run(['$location', '$rootScope', function($location, $rootScope) {
	
	// This sets the page title
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		if(typeof current.$$route !== 'undefined') {
			$rootScope.title = current.$$route.title;
		}
	});
	
	// This gives the nav link that the user is currently on, the class 'active'
	var path = function() {
		return $location.path();
	};
	$rootScope.$watch(path, function(newVal, oldVal) {
		$rootScope.activetab = newVal;
	});
}]);

// This gets the basic information that is needed for every page like the user's information, etc
myezteam.service('myezteamBase', function($http) {

	this.getAuthHeader = function() {
		// Set authorization token so we know the user has logged in.
		return $http.defaults.headers.common.Authorization = 'Bearer ' + token;
	}
	
	this.getProfile = function(callback) {
		// Get the logge din users info
		$http.get(baseUrl+'v1/users?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
				callback(response);
			})
			.error(function(response) {
				return 'An error occurred looking for your info. Please try again later.';
			});	
	}
	
});

// This controller is used to set the user profile links
myezteam.controller('TemplateProfileController', ['$scope', 'myezteamBase', function($scope, myezteamBase) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
}]);