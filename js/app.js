var token = sessionStorage.getItem("token");
var baseUrl = 'http://myezteam-webservices.herokuapp.com/';

var myezteam = angular.module('myezteam', []);

myezteam.config(function($routeProvider) {
	$routeProvider
		.when('/profile', 
			{
				title: 'My Profile',
				controller: 'ProfileController',
				templateUrl: 'partials/profile.html'
			})
		.when('/teams',
			{
				title: 'My Teams',
				controller: 'TeamsController',
				templateUrl: 'partials/teams.html'
			})
		.when('/teams/:team_id',
			{
				title: 'My Teams',
				controller: 'TeamsController',
				templateUrl: 'partials/teams.html'
			})
		.otherwise({redirectTo: '/profile'});
});

// Sets the page title
myezteam.run(['$location', '$rootScope', function($location, $rootScope) {
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		if(typeof current.$$route !== 'undefined') {
			$rootScope.title = current.$$route.title;
		}
	});
}]);

// This factory allows us to set the page title and the active nav menu
/*myezteam.factory('templateFactory', function(){
	var title = 'default';
  	return {
    	getTitle: function() { return title; },
    	setTitle: function(newTitle) { title = newTitle; }
  	};
}); */

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

// This controller is used to set some elements in the actual template like the page title, active menu item, etc
/*myezteam.controller('TemplateController', ['$scope', 'templateFactory', function($scope, templateFactory) {

	$scope.pageTitle = templateFactory;
	
	console.log($scope.pageTitle.getTitle());
}]); */