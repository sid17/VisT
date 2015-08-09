'use strict';

angular.module('visualisationTool')
  .controller('graphCtrl', ['$scope', '$http','$rootScope', '$window','AuthService','$location','ngNotify','$log','$compile',function ($scope, $http,$rootScope,$window,AuthService,$location,ngNotify,$log,$compile) {

$scope.dropVal='';
$scope.dropValLimit='10';


  $scope.searchBrain=function()
  {
    $scope.queryGraph();
  }
  
    $rootScope.logout = function () {
      AuthService.logout().then(
      function () {
        $location.path('/');
      },
      function (error) {
        $scope.error = error;
      }
    );
  };

$scope.styleNodeEdge =function()
{
  var str=$window.currentStyleElementType;
  var x=str.substring(0,str.indexOf('-')); 
  var y=str.substring(str.indexOf('-')+1,str.length); 
  var color=document.getElementById('full').value;
  var dict;
  if (x=='legend')
  {
    dict=alchemy._nodes;
    for (var key in dict)
    {
      var node=dict[key];
      if (node._properties['type']==y)
      {
        
        $window.nodeColorMap[node.id]=color;
        node.setStyles();
      }
      
    }
  }
  else
  {
     dict=alchemy._edges;
     for (var key in dict)
    {
      for (var i=0;i<dict[key].length;i++)
      {
        var edge=dict[key][i];
        if (edge._properties['type']==y)
        {
          $window.edgeColorMap[edge.id+edge._index]=color;
          edge.setStyles();

        }
      }
    }    
  }

  
  $('#styleNodeEdge').modal('hide');
}
  $rootScope.writeToLog = function (query,element,jsonObj,val) 
  {
      $rootScope.queryContents=query
      query=JSON.stringify(query);
      AuthService.submitToLog().then(
      function (retVal) {
        if (retVal && retVal.data.status && retVal.data.status=='success')
        {
          ngNotify.set('Your Changes were successfully pushed',{type:'success'});
          console.log(retVal.data.handle);
          if (val=='edge' && element)
          {
            element['__weaver__handle__']=retVal.data.handle;
            alchemy.create.edges(element);
          } 
          if (val=='node' && element)
          {
            alchemy.create.nodes(element);
           $scope.addPopOver(jsonObj);
          }
          
          if (val=='delete' && element)
          {
             element.self.remove();
          }
  
          }
        else
        {
          ngNotify.set('Changes Not Pushed, Please Log In', {
          type: 'error'
      });
        }
      
      },
      function (error) {
        ngNotify.set('An error was encountered to push the chages to the server, Error type:'+error, {
          type: 'error'
      });
        $scope.error = error;
        if (edge)
        {
          alchemy.create.edges(edge);
        }
      }
    );
  };

$scope.EditPropertyHandlerIm=function(category,Id,handle)
{
  // document.getElementById('EditProps').style.display='none';
    if (category!='node')
      document.getElementById('DeleteProps').style.display='none';
    document.getElementById('SubmitProps').style.display='block';
    var x=document.getElementById('editForm').childNodes;

    for (var i=0;i<x.length;i++)
    {

      if (x[i].childNodes.length>1 )
        if (x[i].childNodes[2].id!='props-id')
        {
         document.getElementById(x[i].childNodes[2].id).disabled = false;
        }
    }
};

$scope.DeleteHandler=function(category,Id,handle)
{
  
  var iden="";
    var x=document.getElementById('editForm').childNodes;
    for (var i=0;i<x.length;i++)
    {
      if (x[i].childNodes.length>1 )
      {
        if (x[i].childNodes[2].id=='props-id')
        {
          iden=x[i].childNodes[2].value
        }
      x[i].childNodes[2].disabled = true;
      }
    }
   
};

    $scope.createEditor = function (sourceId) 
    {
      return CodeMirror.fromTextArea(document.getElementById(sourceId), {
        parserfile: ["codemirror-cypher.js"],
        path: "scripts",
        stylesheet: "styles/codemirror-neo.css",
        autoMatchParens: true,
        lineNumbers: true,
        enterMode: "keep",
        value: "some value"
      });
    }; 

    $scope.removeDuplicates=function(data)
    {
      var edges=[];
      var nodes=[];
      for (var i=0;i<data['edges'].length;i++)
      {
        if ($scope.inViewEdges.indexOf(data['edges'][i]['__weaver__handle__']) < 0)
        {
          $scope.inViewEdges.push(data['edges'][i]['__weaver__handle__'])
          data['edges'][i]['source']=$scope.hashFn(data['edges'][i]['source']);
          data['edges'][i]['target']=$scope.hashFn(data['edges'][i]['target']);
          edges.push(data['edges'][i]);

           if ('type' in data['edges'][i])
          {
            for (var key in config['edgeCategory'])
            {
              if (config['edgeCategory'][key].indexOf(data['edges'][i]['type'])<0)
            {
                config['edgeCategory'][key].push(data['edges'][i]['type']);
            }
            }
            
          }


        }
      }


      for (var i=0;i<data['nodes'].length;i++)
      {
        if ($scope.inViewNodes.indexOf(data['nodes'][i]['__weaver__handle__']) < 0)
        {
          $scope.inViewNodes.push(data['nodes'][i]['__weaver__handle__'])
          var uniqueId=$scope.hashFn(data['nodes'][i]['__weaver__handle__']);
          data['nodes'][i]['id']=uniqueId;
          nodes.push(data['nodes'][i]);
            if ('type' in data['nodes'][i])
          {
            for (var key in config['nodeTypes'])
            {
              if (config['nodeTypes'][key].indexOf(data['nodes'][i]['type'])<0)
            {
                config['nodeTypes'][key].push(data['nodes'][i]['type']);
            }
            }
            
          }

          // console.log(data['nodes'][i]);
          // console.log(data['nodes'][i]['handle']);
          // console.log();
        }
      }
      // console.log(nodes);
      // console.log(edges);
      data['nodes']=nodes;
      data['edges']=edges;

      console.log(config['nodeTypes']);
      console.log(config['edgeCategory']);
      console.log(alchemy.conf);
      for (var key in config)
      {
        if (key in alchemy.conf)
        {
          alchemy.conf[key]=config[key];
        }
      }
      return data;
    };


    $scope.isEmptyObj=function(obj) 
    {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
    }


    $scope.queryGraph=function()
    {
      $scope.inViewEdges=[];
      $scope.inViewNodes=[];
      var weaverGraphEndpoint = $scope.config.graphEndPoint;
      var searchVal=document.getElementById('dropVal').value;
        $.getJSON(weaverGraphEndpoint, 
          {
              query:searchVal ,
              number: $scope.dropValLimit,
              overwrite:'1',
              directionVal: 'U'
          }, 
          function(data) 
          {
              
              if (!$scope.isEmptyObj(data))
              {
                  var childNode=document.getElementById('graph').childNodes[0];
                  childNode.parentNode.removeChild(childNode);
                  data=$scope.removeDuplicates(data)
                  var config=$scope.config;
                  config.dataSource=data;
                  alchemy = new Alchemy(config);
                  for (var i=0;i<data['nodes'].length;i++)
                  {
                    $scope.addPopOver(data['nodes'][i]);
                  }
              }
              else
              {
                var str='Either database connection is broken or node not exist';
                ngNotify.set(str, {
                type: 'error',
                position:'top',
                sticky: false,
                html: true,
                duration:1000
                });

              }
              
            return false;
          });
    }

    $scope.initAlchemyConfig= function (config,graphId) {
    config.divSelector="#"+graphId;
    config.edgeTypes = "caption";
    alchemy = new Alchemy(config);
    $scope.alchemy=alchemy

    var str='The current system is in beta. Use it carefully';
    ngNotify.set(str, {
    type: 'warn',
    position:'top',
    sticky: false,
    html: true,
    duration:700
    });
    return config;
  };

  $scope.addKeyValNode=function(val)
  {
    $scope.editElementProperties[val]="";
    $scope.refreshContent();
    $scope.keyValPairHandle="";
  };

  $scope.addPopOver=function(elem)
  {
     var str="";
     var img="";
     var dict=elem;
     for (var key in dict)
     {
        str=str+key+" : "+dict[key]+"<br>";
        if ($scope.config.popOverImgElements.indexOf(key) > -1)
        {
          var url=$scope.config.imgPrependURL+dict[key];
          img = img+  '<div id = \"image"><img src = "'+url+'" style="width:200px;" /></div>';
        }
        else if ($scope.config.popOverTextElements.indexOf(key) > -1)
        {
          img=img+key+" : "+dict[key]+"<br>";
        }
     }
    
      var UID='node-'+elem['id'];
      var elem1=document.getElementById(UID);
      $(elem1).popover
      ({
        'show': true,
        'trigger': 'hover',
        'container':'body',
        'placement': 'right',
        'content': img,
         'html': true,
      });

  };
  $scope.hashFn=function(str)
  {
    return murmurHash3.x86.hash32(str);
  };
 
  $scope.CreateNode=function(node)
  {
    var jsonObj = {};
    jsonObj['__weaver__handle__']=node.src;

    jsonObj['id']=$scope.hashFn(jsonObj['__weaver__handle__']);
    var nodeObj=JSON.parse(JSON.stringify(jsonObj));
    

    var query={};
    query['type']='create'
    query['category']='node'
    query['props']=jsonObj
    $rootScope.writeToLog(query,nodeObj,jsonObj,'node')

  };

  $scope.CreateEdge=function(edge)
  {
    var jsonObj = {};
    jsonObj['source']=edge.src;
    jsonObj['target']=edge.dst
    var edge=JSON.parse(JSON.stringify(jsonObj));
    edge['source']=$scope.hashFn(edge['source']);
    edge['target']=$scope.hashFn(edge['target']);

    var query={};
    query['type']='create'
    query['category']='edge'
    query['props']=jsonObj
    $rootScope.writeToLog(query,edge,null,'edge')
    
  };

$scope.editProperties=function(element)
{
  // console.log(element);
  $('#myModalNode').modal('show');
}

$scope.deleteProperty=function(key)
{
  
  key=key.substring(key.indexOf('!@')+2,key.length);
  // console.log(key);
  delete $scope.editElementProperties[key];
  $scope.refreshContent();

}

$scope.SaveProperties=function()
{
  for (var val in $scope.editElementProperties)
  {
    $scope.editElementProperties[val]=document.getElementById('editProperty!@'+val).value;
  }
  $scope.editElement.self._properties=jQuery.extend(true, {}, $scope.editElementProperties);
  if ($scope.editElementType=='node')
    {
     var img="";
     var dict=$scope.editElementProperties;
     for (var key in dict)
     {
        if ($scope.config.popOverImgElements.indexOf(key) > -1)
        {
          var url=$scope.config.imgPrependURL+dict[key];
          img = img+  '<div id = \"image"><img src = "'+url+'" style="width:200px;" /></div>';
          // console.log(url);
        }
        else if ($scope.config.popOverTextElements.indexOf(key) > -1)
        {
          img=img+key+" : "+dict[key]+"<br>";
        }
     }
      $(document.getElementById('node-'+$scope.editElementProperties['id'])).data('bs.popover').options.content=img;
    }
    var query={}
    query['type']='update';
    query['category']=$scope.editElementType;
    query['props']=$scope.editElementProperties;
    // console.log($scope.editElementProperties);
    $rootScope.writeToLog(query,null,null,null);
}

$scope.deleteEdges=function(element)
{
  element.self.remove();
}


$scope.deleteEdge=function(element)
{
  var props=element.self._properties;
 

  var query={}
  query['type']='Delete';
  query['category']='edge';
  query['props']=props;
  $rootScope.writeToLog(query,element,null,'delete');
  document.getElementById('insertStuff').innerHTML="";
  $scope.inViewEdges.splice($scope.inViewEdges.indexOf(element.self._properties['__weaver__handle__']),1);
  // console.log(element.self._properties['handle'])
  alchemy.create.edges([]);
  alchemy.stats.edgeStats();
}


$scope.PropertyModify=function(element,type)
{
  // console.log(element.self._properties);
  $scope.editElementProperties=jQuery.extend(true, {}, element.self._properties);
  $scope.editElement=element;
  $scope.editElementType=type;
  $scope.refreshContent();
  // $('#myModalNode').modal('show');


}



$scope.refreshContent=function()
{

var str="";
for (var key in $scope.editElementProperties)
{
  // console.log(key,$scope.editElementProperties[key]);
   str=str+"<div class='form-group'><div class='col-xs-5'> \
      <input  class='form-control keyVal' value='"+key+"' disabled> \
    </div> \
    <div class='col-xs-5'> \
      <input  class='form-control keyVal' id='editProperty!@"+key+"' value='"+$scope.editElementProperties[key]+"'>  \
    </div> \
    <div class='col-xs-2'> \
      <i class='glyphicon glyphicon-trash' style='cursor:pointer' id='deleteProperty!@"+key+"'></i> \
    </div> \
    </div>";
    
    

  // $scope.editElementProperties.$apply();
}
str=str+"<button type='submit'  class='btn btn-primary'>Save changes</button>";
// var elmnt = $compile(str)($scope);
// console.log(elmnt);
document.getElementById('modalFormNode').innerHTML=str;
// $(document.getElementById('modalFormNode')).append()str;

for (var key in $scope.editElementProperties)
{
  var id="deleteProperty!@"+key;
  // console.log(id);
document.getElementById(id).onclick = function() 
    { 
    (angular.element(document.getElementById('graphcontain').parentNode)).scope().deleteProperty(this.id);
    };
}

}
$scope.isVisible=function(key,type)
{
  if (type=='node' && $scope.config.editGraphPropsNode.indexOf(key) > -1)
    return true;
  else if (type=='edge' && $scope.config.editGraphPropsEdge.indexOf(key) > -1)
    return true;
  else return false;
}

 
  $scope.addKeyValEdge=function()
  {
    var text='<div class="form-group"><div class="col-xs-6"><input  data-identity="added" class="form-control keyVal Added" placeholder="Key"> </div><div class="col-xs-6"><input  class="form-control keyVal Added" data-identity="added" placeholder="Value"></div></div>';
    var d = document.createElement('div');
    d.innerHTML = text;
    var element=d.firstChild;
    document.getElementById('modalFormEdge').appendChild(element); 
  
  };
  $scope.addMoreNodes=function(input)
  {
    var weaverGraphEndpoint = $scope.config.graphEndPoint;

    $.getJSON(weaverGraphEndpoint, 
      {
          query: input,
          number: $scope.dropValLimit,
          overwrite:'0',
          directionVal:'U'
      },function(data) 
      {
        data=$scope.removeDuplicates(data);
        alchemy.create.graph(data);
        
        // if (data['nodes'].length>0)
        // {
        //   console.log('>0 Nodes');
        //   alchemy.create.nodes(data['nodes']);
        // }
        // if (data['edges'].length>0)
        // {
        //   console.log('>0 Edges');
        //   alchemy.create.graph(data['edges']);
        // }
        

        for (var i=0;i<data['nodes'].length;i++)
        {
          $scope.addPopOver(data['nodes'][i]);
          // console.log(data['nodes'][i]);
        }
          
 
        alchemy.stats.nodeStats();
        alchemy.stats.edgeStats();


      });
  }
    
    $scope.config = $scope.initAlchemyConfig(config,'graph');
    $scope.inViewEdges=[];
    $scope.inViewNodes=[];
    $rootScope.items123 = {'adam':10, 'amalie':12};
    $scope.editElementProperties={};
    $scope.editElementProperties['caption']='acb';
    $scope.editElementType='node';
    $scope.alchemy={};


    if (!$window.localStorage.username)
    {
      $rootScope.username=''
      $rootScope.loggedIn=false
    }
    else
    {
      $rootScope.username=window.localStorage.username
      $rootScope.loggedIn=true
    }
    
    
  }]);
