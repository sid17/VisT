'use strict';
angular.module('visualisationTool')
  .controller('ConfigCtrl', ['$scope','$rootScope','AuthService','ngNotify', function($scope,$rootScope,AuthService,ngNotify) {
   

  	    $scope.setConfig = function (query) 
	  	{
	      query=JSON.stringify(query);
	      AuthService.setConfiguration(query).then(
	      function (retVal) {
	      	console.log(retVal);
	        if (retVal && retVal.data.status && retVal.data.status=='success')
	        {
	          ngNotify.set('Configuration set successfully',{type:'success'});
	          for (var attrname in userConfig) { config[attrname] = userConfig[attrname]; }
	        }
	        else
	        {
	          ngNotify.set('Please log In Error setting the configuration',{type:'error'});
	        }
	      },
	      function (error) {
	        ngNotify.set('An error was encountered to set the configuration parameters, Error type:'+error, {type: 'error'
	      });
	      }
	    );


	  };




  }]);



//   'use strict';
// angular.module('visualisationTool')
//   .controller('ConfigCtrl',['$scope','$rootScope',function($scope,$rootScope) 
//   {

//   ]);


