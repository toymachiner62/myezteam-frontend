// Controller for the login page
myezteamLogin.controller('LoginController', ['$scope', '$http', function($scope, $http) {

	// If a user has check the "remember me" box previously and the email/password is in localStorage, set the email/password
	if(localStorage.getItem("email") != null && localStorage.getItem("password") != null) {
		$scope.user = {
			email: localStorage.getItem("email"),
			password: localStorage.getItem("password"),
			remember: localStorage.getItem("remember")
		}
	} 

	// Login method when the form is submitted
	$scope.login = function() {
	
		// Authenticate the user
		$http.post(baseUrl+'v1/auth/login' + apiKey, $scope.user)
			.success(function(response) {
				sessionStorage.setItem("myezteamToken", response.token);
				$scope.loginError = null;

				// If a user checked the "remember me" box, set their email/password in localStorage
				if($scope.user.remember) {
					localStorage.setItem('myezteamToken', response.token);		// Set this so the user is remembered on the computer					
				} else {
					localStorage.removeItem('myezteamToken');
				}
				
				window.location = 'main.html';
			})
			.error(function(response) {
				$scope.loginError = response.message;
			});
	}
	
	// On page load, check if a user is already logged in
	// If a token exist, that means the user is logged in already so redirect them to the main page.
  if(sessionStorage.getItem("myezteamToken") != null) {
		// Redirect to login page
		window.location.href = "main.html";
  }
	
}]);