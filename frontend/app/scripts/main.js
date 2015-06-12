
'use strict';
/* global app: true */

var app = angular.module('visualisationTool', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngNotify',
  'ui.bootstrap',
  'ngAnimate'
]);

app.config(function ($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  $routeProvider
    .when('/', {
      templateUrl: 'templates/graph.html',
      controller: 'graphCtrl'
    })
    .when('/configure', {
      templateUrl: 'templates/config.html',
      controller: 'ConfigCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.constant('API_SERVER', config.logInEndPoint);