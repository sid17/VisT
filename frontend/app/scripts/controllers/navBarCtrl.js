'use strict';
angular.module('visualisationTool')
  .controller('navBarCtrl', ['$scope','$rootScope', function($scope,$rootScope) {
    
    $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    ;
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

    $scope.changeView=function(val)
    {
    	if (val=='login')
    	{
    	$rootScope.template={ name: 'loginInline.html', url: 'templates/loginInline.html'};
    	}
    	else if (val=='register')
    	{
    	$rootScope.template={ name: 'registerInline.html', url: 'templates/registerInline.html'};
    	}
        else if (val=='addNode')
        {
        $rootScope.template={ name: 'addNode.html', url: 'templates/addNode.html'};
        }
        else if (val=='addEdge')
        {
        $rootScope.template={ name: 'addEdge.html', url: 'templates/addEdge.html'};
        }
        else if (val=='queryGraph')
        {
        $rootScope.template={ name: 'queryGraph.html', url: 'templates/queryGraph.html'};
        }
    }

  }]);