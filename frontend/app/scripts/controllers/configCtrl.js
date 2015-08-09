'use strict';
angular.module('visualisationTool')
  .controller('ConfigCtrl', ['$scope','$rootScope','AuthService','ngNotify', function($scope,$rootScope,AuthService,ngNotify) {
   

  	    $scope.setConfig = function (query) 
	  	{
	      query=JSON.stringify(query);
	      console.log(query);
	      AuthService.setConfiguration(query).then(
	      function (retVal) {
	      	console.log(retVal);
	      	if (!retVal)
	      	{
	      		 alert('Error Setting Configuration, check if you are logged In');
	      	}
	        if (retVal && retVal.data.status && retVal.data.status=='success')
	        {
	          ngNotify.set('Configuration set successfully',{type:'success'});
	  
	        }
	        else
	        {
	          ngNotify.set('Please log In Error setting the configuration',{type:'error'});
	        }
	      },
	      function (error) {
	        ngNotify.set('An error was encountered to set the configuration parameters, Error type:'+error, {type: 'error'});
	      }
	    );


	  };


	  $scope.checkDict=function(value)
	  {
	  	// console.log(value);

	  	if(value.constructor == Array)
	  	{
	  		return false;
		}
		else if(value.constructor == Object)
		{
			return true;
		}
		else
		{
			return false;
		}


	  	
	  }



	  $scope.checkSpecialConfig=function(value)
	  {
	  	if (value=='nodeType' || value=="edgeCategory")
	  	{
	  		return true;
	  	}
	  	else
	  	{
	  		return false;
	  	}
	  	
	  }


	 $scope.onConfig=function()
	 {
	 	jQuery.ajax({
        url:"scripts/config.json", 
        async:true,
        success:function(data) 
           {
               $scope.configSettings=data;
               console.log($scope.configSettings);
               $scope.$apply();
           }})
            .done(function() 
            {
                console.log( "success loaded configurations" );
            })
          .fail(
            function( jqxhr, textStatus, error ) 
            {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });

	 } 



  }]);



//   'use strict';
// angular.module('visualisationTool')
//   .controller('ConfigCtrl',['$scope','$rootScope',function($scope,$rootScope) 
//   {

//   ]);


