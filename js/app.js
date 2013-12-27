var baseUrl = 'http://myezteam-webservices.herokuapp.com/';

// Module for the login page
var myezteamLogin = angular.module('myezteam-login', []);

// Module for the rest of the pages
var myezteam = angular.module('myezteam', ['highcharts-ng', 'ui.bootstrap', 'md5', 'ui-gravatar']);

// Set some configs
myezteam.config(function($routeProvider, $httpProvider) {
    
    // Setup the routing
	$routeProvider
	    .when('/dashboard', 
			{
				title: 'My Dashboard',
				controller: 'DashboardController',
				templateUrl: 'partials/dashboard.html',
				activetab: 'dashboard'
			})
		.when('/profile', 
			{
				title: 'My Profile',
				controller: 'ProfileController',
				templateUrl: 'partials/profile.html',
				activetab: 'profile'
			})
		.when('/teams',
			{
				title: 'Create Team',
				controller: 'CreateTeamController',
				templateUrl: 'partials/create-team.html',
				activetab: 'teams'
			})
		.when('/teams/:id',
			{
				title: 'Team',
				controller: 'TeamController',
				templateUrl: 'partials/team.html',
				activetab: 'team'
			})
		.when('/teams/:id/add-player',
			{
				title: 'Add Player',
				controller: 'AddPlayerToTeamController',
				templateUrl: 'partials/add-player-to-team.html',
				activetab: 'teams'
			})
		.when('/teams/:id/events', 
			{
				title: 'Create Event',
				controller: 'CreateEventController',
				templateUrl: 'partials/create-event.html',
				activetab: 'events'
			})
		.when('/teams/:id/events/:event_id/emails',
		    {
		        title: 'Create Email',
		        controller: 'CreateEventEmailController',
		        templateUrl: 'partials/create-event-email.html',
		        activetab: 'teams'
		    })
		.otherwise({redirectTo: '/dashboard'});
		
		// This loads the ajax loading image when necessary
		var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {
            var error;

            function success(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                if($http.pendingRequests.length < 1) {
                    $('#loadingWidget').hide();
                    $('#loadingBackdrop').hide();
                }
                return response;
            }

            function error(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                if($http.pendingRequests.length < 1) {
                    $('#loadingWidget').hide();
                    $('#loadingBackdrop').hide();
                }
                return $q.reject(response);
            }

            return function (promise) {
                $('#loadingWidget').show();
                $('#loadingBackdrop').show();
                return promise.then(success, error);
            }
        }];

    $httpProvider.responseInterceptors.push(interceptor);
});

// Set some actions to be performed when running the app
myezteam.run(['$location', '$rootScope', function($location, $rootScope) {
	
	// This sets the page title
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		if(typeof current.$$route !== 'undefined') {
			$rootScope.title = current.$$route.title;
		}
	});
    
    // Register listener to watch route changes. 
    // We use this to make sure a user is logged in when they try to retrieve data
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        
        // If there is no token, that means the user is not logged in.
        if(sessionStorage.getItem("token") == null) {
           
            // Redirect to login page
            window.location.href = "login.html";
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

// This gets the basic information that is needed for every page like the user's information, logout method, etc
myezteam.service('myezteamBase', function($http) {

    // Set authorization token so we know the user has logged in.
	this.getAuthHeader = function() {
		return $http.defaults.headers.common.Authorization = 'Bearer ' + sessionStorage.getItem('token');
	}
	
    // Get some profile information
	this.getProfile = function(callback) {
		// Get the logged in users info
		$http.get(baseUrl+'v1/users?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
				callback(response);
			})
			.error(function(response) {
				return 'An error occurred looking for your info. Please try again later.';
			});	
	}
    
    // Logs the user out and redirects to the login page
    this.logout = function() {
        sessionStorage.removeItem("token");
        window.location = "login.html";
    }
	
});


// This gets the teams that a user is associated with
myezteam.service('teams', function($http) {
    
    // Get the teams associated with the logged in user
    this.getTeams = function(callback) {
        
        $http.get(baseUrl+'v1/teams/all?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d')
			.success(function(response) {
				callback(response);
			})
			.error(function(response) {
				return 'An error occurred looking for your teams. Please try again later.';
			});	
    }
});

// This controller is used to set the user profile links
myezteam.controller('TemplateProfileController', ['$scope', 'myezteamBase', 'teams', function($scope, myezteamBase, teams) {

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});
    
    $scope.logout = function() {
        myezteamBase.logout();   
    }
	
	teams.getTeams(function(response) {
	    $scope.teams = response;    
	});
	
}]);

