'use strict';

app.controller('AuthCtrl', function ($scope, $location, AuthService) {
  $scope.register = function (user) {
    var username = user.email ;
    var password = user.password;

    if (username && password) {
      AuthService.register(username, password).then(
        function () {
          $location.path('/');
        },
        function (error) {
          $scope.registerError = error;
        }
      );
    } else {
      $scope.registerError = 'Username and password required';
    }
  };
  $scope.login = function (user) {
    var username = user.email;
    var password = user.password;

    if (username && password) {
      AuthService.login(username, password).then(
        function () {
          $location.path('/');
        },
        function (error) {
          $scope.loginError = error;
        }
      );
    } else {
      $scope.loginError = 'Username and password required';
    }
  };

});
