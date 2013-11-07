function LoginController($scope, $http) {

	$scope.username = null;
	$scope.password = null;

	$scope.login = function() {
		$scope.username = "m089269"
		$scope.password = "mypassword"
	}
}