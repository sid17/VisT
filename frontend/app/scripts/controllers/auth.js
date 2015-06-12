'use strict';

app.controller('AuthCtrl', function ($scope, $location, AuthService,$rootScope,ngNotify) {
  $scope.register = function (user) {
    var username = user.email ;
    var password = user.password;
    document.getElementById('registerEmail').value="";
    document.getElementById('registerPassword').value="";
    
    if (username && password) {
      AuthService.register(username, password).then(
        function () {
          $rootScope.username=username;
          $rootScope.loggedIn=true;
          ngNotify.set('You are successfully registered',{type:'success',position: 'top'});
          $rootScope.template = { name: 'queryGraph.html', url: 'templates/queryGraph.html'};

        },
        function (error) {
          $scope.registerError = error;
          ngNotify.set($scope.registerError,{type:'error',position: 'top'});
          
        }
      );
    } else {
      $scope.registerError = 'Username and password required';
    }
  };
  $scope.login = function (user) {
    var username = user.email;
    var password = user.password;
    document.getElementById('logInEmail').value="";
    document.getElementById('logInPassword').value="";
    if (username && password) {
      AuthService.login(username, password).then(
        function () {
          $rootScope.username=username;
          $rootScope.loggedIn=true;
          $rootScope.template = { name: 'queryGraph.html', url: 'templates/queryGraph.html'};
          ngNotify.set('You are successfully logged in',{type:'success',position: 'top'});
        },
        function (error) {
          $scope.loginError = error;
          ngNotify.set($scope.loginError,{type:'error',position: 'top'});
        }
      );
    } else {
      $scope.loginError = 'Username and password required';
    }
  };

});
