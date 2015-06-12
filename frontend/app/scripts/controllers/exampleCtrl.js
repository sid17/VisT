'use strict';
angular.module('visualisationTool')
  .controller('ExampleController', ['$scope','$rootScope', function($scope,$rootScope) {
    $rootScope.template = { name: 'queryGraph.html', url: 'templates/queryGraph.html'};
  }]);