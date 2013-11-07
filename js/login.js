function LoginController($scope, $http) {

	$scope.user = {
		email: null,
		password: null
	}

	$scope.login = function() {
		$http.post('http://myezteam-webservices.herokuapp.com/v1/auth/login?api_key=a344ba35-e9b1-4360-9335-1c200f8f8d4d', $scope.user).success(function(response) {
			console.log(response);
		})
	}
}