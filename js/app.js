var baseUrl = 'http://ws.myezteam.com/';
var apiKey = '?api_key=9c0ba686-e06c-4a2c-821b-bae2a235fd3d';
var token = sessionStorage.getItem("myezteamToken");

// Module for the login page
var myezteamLogin = angular.module('myezteam-login', ['ngRoute', 'chieffancypants.loadingBar', 'ngAnimate']);

// Module for the rest of the pages
var myezteam = angular.module('myezteam', ['ngRoute', 'ngResource', 'highcharts-ng', 'ui.bootstrap', 'md5', 'ui-gravatar', 'chieffancypants.loadingBar', 'ngAnimate']);

/*#################################
* Login Config - Login page configs
*#################################*/
myezteamLogin.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {

  // Setup the routing
	$routeProvider
	    .when('/login',
			{
				title: 'Login',
				controller: 'LoginController',
				templateUrl: 'partials/login.html'
			})
		.when('/signup',
			{
				title: 'Signup',
				controller: 'SignupController',
				templateUrl: 'partials/signup.html'
			})
		.when('/reset',
			{
				title: 'Reset Password',
				controller: 'ResetPasswordController',
				templateUrl: 'partials/reset.html'
			})
		.when('/change-password/:key',
			{
				title: 'Change Password',
				controller: 'ChangePasswordController',
				templateUrl: 'partials/change-password.html'
			})
		.when('/responses/email_rsvp/:event_id/:player_id/:response_type_id/:response_key',
			{
				title: 'RSVP Response',
				controller: 'EmailResponseController',
				templateUrl: 'partials/email_responses/index.html'
			})
		.otherwise({redirectTo: '/login'});

}]);

/*#################################
* Config - Set some configs for the app
*#################################*/
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
				templateUrl: 'partials/profile.html'
			})
		.when('/teams',
			{
				title: 'Create Team',
				controller: 'CreateTeamController',
				templateUrl: 'partials/teams/create.html'
			})
		.when('/teams/:id',
			{
				title: 'Team',
				controller: 'TeamController',
				templateUrl: 'partials/team.html'
			})
		.when('/teams/:id/edit',
			{
				title: 'Edit Team',
				controller: 'EditTeamController',
				templateUrl: 'partials/teams/edit.html'
			})
		.when('/teams/:id/add-player',
			{
				title: 'Add Player',
				controller: 'AddPlayerToTeamController',
				templateUrl: 'partials/players/add.html'
			})
		.when('/teams/:id/events',
			{
				title: 'Create Event',
				controller: 'CreateEventController',
				templateUrl: 'partials/events/create.html'
			})
		.when('/teams/:id/events/:event_id/edit',
			{
				title: 'Edit Event',
				controller: 'EditEventController',
				templateUrl: 'partials/events/edit.html'
			})
		.when('/teams/:id/events/:event_id/emails',
		  {
				title: 'Create Email',
				controller: 'CreateEventEmailController',
				templateUrl: 'partials/emails/create.html'
		  })
		.when('/teams/:id/events/:event_id/emails/:email_id/edit',
		  {
				title: 'Edit Email',
				controller: 'EditEventEmailController',
				templateUrl: 'partials/emails/edit.html'
		  })
		.otherwise({redirectTo: '/dashboard'});

});

/*#################################
* Run - Set some actions to be performed when running the app
*#################################*/
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

    // If a token does not exist, that means the user is not logged in already so redirect them to the login page.
		// OR if the current url is not the result of clicking an rsvp link in an email
    if(sessionStorage.getItem("myezteamToken") == null) {

      // Redirect to login page
      window.location.href = "index.html";
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

/*#################################
* Run - Set some actions to be performed when running the app
*#################################*/
myezteamLogin.run(['$location', '$rootScope', function($location, $rootScope) {

	// This sets the page title
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		if(typeof current.$$route !== 'undefined') {
			$rootScope.title = current.$$route.title;
		}
	});

	// If a user has previously asked to be remembered, set the session storage token and redirect
	if(localStorage.getItem("myezteamToken") != null) {
		sessionStorage.setItem('myezteamToken', localStorage.getItem('myezteamToken'));
		window.location.href = "main.html";
	}

	// If a user clicked any link, except an email rsvp link
	if(!$location.path().startsWith('/responses/email_rsvp/')) {

  	// If a user is logged in (if a sessionStorage token exists), redirect the to the main page.
  	if(sessionStorage.getItem('myezteamToken') != null) {
			sessionStorage.setItem('myezteamToken', localStorage.getItem('myezteamToken'));
  		window.location.href = "main.html";
  	}
	}

}]);

/*#################################
* myezteamBase - This gets the basic information that is needed for every page like the user's information, logout method, etc
*#################################*/
myezteam.service('myezteamBase', function($http) {

    // Set authorization token so we know the user has logged in.
	this.getAuthHeader = function() {
		return $http.defaults.headers.common.Authorization = 'Bearer ' + sessionStorage.getItem('myezteamToken');
	}

    // Get some profile information
	this.getProfile = function(callback) {
		// Get the logged in users info
		$http.get(baseUrl+'v1/users' + apiKey)
			.success(function(response) {
				callback(response);
			})
			.error(function(response) {
				return 'An error occurred looking for your info. Please try again later.';
			});
	}

    // Logs the user out and redirects to the login page
    this.logout = function() {
        sessionStorage.removeItem("myezteamToken");				// Clear the authenticated session
				localStorage.removeItem('myezteamToken');	// Clear the "remember me"
        window.location = "index.html";
    }

});

/*#################################
* chartService - This sets up all the stuff for the chart service
*#################################*/
myezteam.service('chartService', function() {

	// Count the response types (2 yes's, 3 maybe's, etc)
	this.set_responses = function(responses, rsvps) {

	    for(var i = 0; i < responses.length; i++) {
	        switch (responses[i].response.id)
            {
            case 1:
              // do nothing
              break;
            case 2:
              rsvps.yes++;
              rsvps.no_response--;
              break;
            case 3:
              rsvps.probably++;
              rsvps.no_response--;
              break;
            case 4:
              rsvps.maybe++;
              rsvps.no_response--;
              break;
            case 5:
              rsvps.no++;
              rsvps.no_response--;
              break;
            }
	    }

	    return rsvps;
	}

	// Set the appropriate data for the chart
	this.setup_chart = function(team_id, event_name, rsvps) {

	    // The rsvp responses data
        var data = [
            {
                name: 'Yes (' + rsvps.yes + ')',
                y: rsvps.yes,
                url: '#/team/'+team_id
            },
            {
                name: 'Probably (' + rsvps.probably + ')',
                y: rsvps.probably,
                url: '#/team/'+team_id
            },
            {
                name: 'Maybe (' + rsvps.maybe + ')',
                y: rsvps.maybe,
                url: '#/team/'+team_id
            },
            {
                name: 'No (' + rsvps.no + ')',
                y: rsvps.no,
                url: '#/team/'+team_id
            },
            {
                name: 'No Response (' + rsvps.no_response + ')',
                y: rsvps.no_response,
                url: '#/team/'+team_id
            }
        ];

        // Pie chart configs
        var chart_config = {
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
    				    //$location.path(e.point.options.url);
                    }
                },
                data: data
            }]
        }

        return chart_config;
	}

    // Sets the chart colors and gradients
	this.set_colors = function() {

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
	}

});

/*#################################
* teamsFactory - This gets the teams that a user is associated with.
*#################################*/
myezteam.factory('teamsFactory', ['$rootScope', '$http', function($rootScope, $http) {

    // Get the teams associated with the logged in user
    return {
        all_teams: null,
        // Get the teams
        get_teams: function(callback) {
            if(this.all_teams == null) {
                this.fetch_teams(function(response) {
                    this.all_teams = response;
                    callback(this.all_teams);
                });
            } else {
                callback(this.all_teams);
            }
        },
        // Format's all the teams into 1 nice list regardless of owner/manager/player
        formatTeams: function(teams, showTeamButtons) {

	        var new_teams = [];

            // Add the teams to $scope.teams, without adding duplicates
	        new_teams = add_teams(new_teams, teams.owner, "owner", showTeamButtons);
	        new_teams = add_teams(new_teams, teams.manager, "manager", showTeamButtons);
	        new_teams = add_teams(new_teams, teams.player, "player", showTeamButtons);

	        return new_teams;
	    },
        // Actually get the teams from the db
        fetch_teams: function(callback) {
            $http.get(baseUrl+'v1/teams/all' + apiKey)
		    	.success(function(response) {
		    		this.all_teams = response;
		    		callback(response);
			    })
			    .error(function(response) {
			    	callback('An error occurred looking for your teams. Please try again later.');
			    });
        },
        // Tell all controller's that are watching for an update that the team list has been updated
        broadcast: function() {
            this.all_teams = null;
            this.get_teams(function(teams) {
                $rootScope.$broadcast( 'teamsFactory.update', teams);
            });
        }
    };
}]);

/*#################################
* TemplateProfileController
*#################################*/
myezteam.controller('TemplateProfileController', ['$scope', '$http', 'myezteamBase', 'teamsFactory', function($scope, $http, myezteamBase, teamsFactory) {

    var showTeamButtons = false;

	myezteamBase.getAuthHeader();
	myezteamBase.getProfile(function(response) {
		$scope.profile = response;
	});

    // Logs a user out
    $scope.logout = function() {
        myezteamBase.logout();
    }

	// Gets all of a user's teams
	var getTeams = function() {
	    teamsFactory.get_teams(function(all_teams) {
	        $scope.teams = teamsFactory.formatTeams(all_teams, showTeamButtons);
	    });
	}

	// If an update is broadcasted with the new updated team list, re-format them.
	$scope.$on( 'teamsFactory.update', function( event, teams ) {
        $scope.teams = teamsFactory.formatTeams(teams);
    });

    // Shows/hides the edit/delete buttons
    $scope.toggleTeamButtons = function() {

        showTeamButtons = !showTeamButtons;

        // Loop through all the teams to set a default flag to show the edit/delete buttons
		for(var i = 0; i < $scope.teams.length; i++) {
            $scope.teams[i].showDelete = showTeamButtons;
        }
    }

    // Deletes a team
    $scope.delete = function(team) {

        // Get all the players of a specific team
		$http.delete(baseUrl+'v1/teams/' + team.id + apiKey)
            .success(function(response) {

			    getTeams();   // Reload all the info so the players get updated

			    $scope.error = null;
				$scope.success = team.name + ' has been deleted';
            })
            .error(function(response) {
			    $scope.success = null;
			    $scope.error = 'An error occurred trying to delete ' + team.name + '. Please try again later.';
		    });
    };

    getTeams();  // Call on page load

}]);

/*#################################
* Helpers
*#################################*/

/**
 * Adds an array of teams to another array. Does NOT add duplicate teams
 *
 * @param team_list  - The list of teams to be added to
 * @param teams_to_add - The list of teams to add
 * @param association    - The logged in user's association to the team (owner, manager, or player)
 * @param buttons_visible_flag   - A flag on whether the show the edit/delete buttons
 */
function add_teams(team_list, teams_to_add, association, buttons_visible_flag) {

    if(typeof teams_to_add !== 'undefined') {

        // Loop through all the teams to be added
        for(var i = 0; i < teams_to_add.length; i++) {

            // Add a flag to show the edit/delete buttons and a user association (player, owner, manager) to these objects
            teams_to_add[i].showDelete = buttons_visible_flag;
            teams_to_add[i].association = association;

            // If the array doesn't already contain the team, add it
            if(!contains(team_list, teams_to_add[i].id)) {
                team_list.push(teams_to_add[i]);
            }
        }
    }

    return team_list;
}

/**
 * Checks if an object exists in an array of objects. They are considered equal if the id's of the objects match
 * @param arr       - The array to look in
 * @param id        - The id of the object we're looking for
 */
function contains(arr, id) {

    var i = arr.length;
    while (i--) {
        if (arr[i].id == id) return true;
    }
    return false;
}

/**
* Determines whether a string starts with another string
*
* @param str	- The string to check if exists
* @returns 	- True or false whether the string starts with the other string
*/
String.prototype.startsWith = function(str) {
	return str.lastIndexOf(str, 0) === 0;
}
