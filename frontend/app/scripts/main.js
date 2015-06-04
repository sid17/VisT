
'use strict';
/* global app: true */

var app = angular.module('visualisationTool', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngNotify'
]);

app.config(function ($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  $routeProvider
    .when('/', {
      templateUrl: 'templates/graph.html',
      controller: 'graphCtrl'
    })
    .when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'AuthCtrl'
    })
    .when('/register', {
      templateUrl: 'templates/createuser.html',
      controller: 'AuthCtrl'
    })
    .when('/logout', {
      templateUrl: 'templates/logout.html',
      controller: 'AuthCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.constant('API_SERVER', config.logInEndPoint);