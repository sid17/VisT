var app = angular.module('visualisationTool', [
  'ngRoute'
]);
app.config(['$routeProvider', function ($routeProvider) 
  {
    $routeProvider
        .when("/", {templateUrl: "templates/graph.html", controller: "graphCtrl"}); 
  }
]);

