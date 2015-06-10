'use strict';

angular.module('visualisationTool')
  .controller('graphCtrl', ['$scope', '$http','$rootScope', '$window','AuthService','$location','ngNotify',function ($scope, $http,$rootScope,$window,AuthService,$location,ngNotify) {
    
    $rootScope.logout = function () {
      // console.log('Logout Called');
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
        
        node._style['color']=color;
        node.setStyles();
        // node.setStyles('borderColor',color);

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
          console.log('TRUE');
  
          edge._style['stroke']='black';
          edge._style['color']='black';
          console.log(edge._style)
          edge.setStyles();

        }
      }
    }    
  }

  
  $('#styleNodeEdge').modal('hide');
}
  $rootScope.writeToLog = function (query) 
  {
      $rootScope.queryContents=query
      query=JSON.stringify(query);
      AuthService.submitToLog().then(
      function (retVal) {
        if (retVal && retVal.data.status && retVal.data.status=='success')
        {
          ngNotify.set('Your Changes were successfully pushed',{type:'success'});
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
      }
    );
  };

$scope.EditPropertyHandlerIm=function(category,Id,handle)
{
  document.getElementById('EditProps').style.display='none';
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

$scope.EditPropertyHandler = function(category,Id,handle)
{
  document.getElementById('SubmitProps').style.display='none';
    var x=document.getElementById('editForm').childNodes;
    var jsonObj={};
    var iden;
    var src;
    var dst;
    var dataCategory;
    for (var i=0;i<x.length;i++)
    {
      if (x[i].childNodes.length>1 )
      {
      dataCategory=$(x[i]).data("category");
      // console.log(dataCategory);
      x[i].childNodes[2].disabled = true;
      var val=x[i].childNodes[2].value;
      var id=(x[i].childNodes[2].id).substring(6,(x[i].childNodes[2].id).length);
      if (dataCategory=='node')
      {
        if (id=='id')
        {
          iden=val;
        }
        else
        {
          jsonObj[id]=val;
        }
      }
      else
      {
        if (id=='source')
        {
          src=val;
        }
        else if (id=='target')
        {
          dst=val;
        }
        else
        {
          jsonObj[id]=val;
        }
      }
      
      }
    }
    var element;
    if (dataCategory=='node')
    {
      element=alchemy._nodes[iden];
    }
    else
    {
      var element;
      for (var i=0;i<alchemy._edges[Id].length;i++)
      {
        
        if (alchemy._edges[Id][i]._properties['handle']==handle)
        {
          element=alchemy._edges[Id][i];
          break;
        }
      }


      // var edgeId="" + src + "-" +dst
      // element=alchemy._edges[edgeId][0];
    }
    for (var key in jsonObj) 
    {
       element._properties[key]=jsonObj[key];
    }
    if (dataCategory=='node')
    {

     var img="";
     var dict=element._properties;
     for (var key in dict)
     {
        str=str+key+" : "+dict[key]+"<br>";
        if ($scope.config.popOverImgElements.indexOf(key) > -1)
        {
          var url=$scope.config.imgPrependURL+dict[key];
          img = img+  '<div id = \"image"><img src = "'+url+'" style="width:200px;" /></div>';
          console.log(url);
        }
        else if ($scope.config.popOverTextElements.indexOf(key) > -1)
        {
          img=img+key+" : "+dict[key]+"<br>";
        }
     }

      $(document.getElementById('node-'+element._properties['id'])).data('bs.popover').options.content=img;
    }
    var query={}
    query['type']='update';
    query['category']=dataCategory;
    query['props']=element._properties;
    $rootScope.writeToLog(query);
    
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
    var elementProps;
      if (category=='node')
      {
        node = alchemy.get.nodes(iden);
        node.remove()
      }
      else
      {
        var element;
        for (var i=0;i<alchemy._edges[Id].length;i++)
        {
          
          if (alchemy._edges[Id][i]._properties['handle']==handle)
          {
            element=alchemy._edges[Id][i];
            break;
          }
        }
        element.remove();
        
      }
      var query={}
      query['type']='Delete';
      query['category']='edge';
      query['props']=elementProps;

      $rootScope.writeToLog(query);
      document.getElementById('insertStuff').innerHTML="";
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

    $scope.queryGraph=function()
    {
      var childNode=document.getElementById('graph').childNodes[0];
      childNode.parentNode.removeChild(childNode);

      var weaverGraphEndpoint = $scope.config.graphEndPoint;
        $scope.config.friction=0.9;
        var retVal=$scope.editor.getValue();
        // console.log(retVal);
        var r1=retVal.split(',');
        var query=r1[0].split(':')[1];
        var direction=r1[1].split(':')[1]
        var number=r1[2].split(':')[1];
        // console.log(query,number,direction);
        $.getJSON(weaverGraphEndpoint, 
          {
              query: query,
              number: number,
              overwrite:'1',
              directionVal: direction
          }, 
          function(data) 
          {
              var config=$scope.config;
              config.dataSource=data;
              // console.log(data);

              alchemy = new Alchemy(config);

            for (var i=0;i<data['nodes'].length;i++)
            {
              $scope.addPopOver(data['nodes'][i]);
            }
            // console.log('hello');
            // alchemy.conf.friction=0.7;

            return false;
          });

    }

    $scope.initAlchemyConfig= function (config,graphId) {
    config.divSelector="#"+graphId;
    config.edgeTypes = "caption";
    alchemy = new Alchemy(config);
    ngNotify.set('The current system is in alpha, Use it carefully! ', {
    type: 'warn',
    position:'top',
    duration: 500
    });
    return config;
  };



  $scope.addKeyValNode=function()
  {
    var text='<div class="form-group"><div class="col-xs-6"><input  data-identity="added" class="form-control keyVal Added" placeholder="Key"> </div><div class="col-xs-6"><input  data-identity="added" class="form-control keyVal Added" placeholder="Value"></div></div>';
    var d = document.createElement('div');
    d.innerHTML = text;
    var element=d.firstChild;
    document.getElementById('modalFormNode').appendChild(element); 
  
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
          console.log(url);
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
    var hash = 0;
    if (str.length == 0) return hash;
    for (var i = 0; i < str.length; i++) 
    {
        var ch = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+ch;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };
  $scope.AddEdges=function()
  {
    var jsonObj = {};
    var x=document.getElementById('modalFormEdge').getElementsByClassName('keyVal');
    for (var i=0;i<x.length;i++)
    {
       if (i%2==0)
        {
          var key=x[i].value;
          key=key.split(' ').join('_');
          jsonObj[key]=x[i+1].value
        }
    }
    var edge=JSON.parse(JSON.stringify(jsonObj));
    
    var edgeId="" + edge.source + "-" +edge.target;
    if (alchemy.get.edges(edgeId).api.length==1)
    {
      ;
    }
    else
    {
      alchemy.create.edges(edge);
    }

    var query={};
    query['type']='create'
    query['category']='edge'
    query['props']=jsonObj
    $rootScope.writeToLog(query)
  document.getElementById('modalFormEdge').innerHTML='<div class="form-group"><div class="col-xs-6"><input  class="form-control keyVal" value="node" disabled></div><div class="col-xs-6"><input  class="form-control keyVal" placeholder="Value"required></div></div><div class="form-group"><div class="col-xs-6"><input  class="form-control keyVal" value="edge" disabled></div><div class="col-xs-6"><input  class="form-control keyVal" placeholder="Value"required></div></div><div class="form-group"><div class="col-xs-6"><input  class="form-control keyVal" value="handle" disabled></div><div class="col-xs-6"><input  class="form-control keyVal" placeholder="Value"required></div></div>'
  };
  $scope.AddNodes=function()
  {
    var jsonObj = {};
    var x=document.getElementById('modalFormNode').getElementsByClassName('keyVal');
    for (var i=0;i<x.length;i++)
    {
      if (i%2==0)
      {
        var key=x[i].value;
        key=key.split(' ').join('_');
        jsonObj[key]=x[i+1].value
      }
    }
    jsonObj['id']=$scope.hashFn(jsonObj['handle']);
    jsonObj['root']=true;
    var node=JSON.parse(JSON.stringify(jsonObj));
    alchemy.create.nodes(node);
    document.getElementById('modalFormNode').innerHTML='<div class="form-group"><div class="col-xs-6"><input  class="form-control keyVal" value="handle" disabled></div><div class="col-xs-6"><input  class="form-control keyVal" placeholder="Value"required></div></div>'
    $scope.addPopOver(jsonObj);
    
    var query={};
    query['type']='create'
    query['category']='node'
    query['props']=jsonObj
    $rootScope.writeToLog(query)

  };
 
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
    
    var retVal=$scope.editor.getValue();
    var r1=retVal.split(',');
    var query=r1[0].split(':')[1];
    var number=r1[2].split(':')[1]
    var direction=r1[1].split(':')[1];


    $.getJSON(weaverGraphEndpoint, 
      {
          query: input,
          number: number,
          overwrite:'0',
          directionVal:direction
      },function(data) 
      {
        for (var i=0;i<data['nodes'].length;i++)
        {
          if (alchemy.get.nodes(data['nodes'][i].id).api.length==1)
          {
            ;
          }
          else
          {
            alchemy.create.nodes(data['nodes'][i]);
            $scope.addPopOver(data['nodes'][i]);
          }
        }

        for (var i=0;i<data['edges'].length;i++)
        {
          var edgeId="" + data['edges'][i].source + "-" +data['edges'][i].target;
          if (alchemy.get.edges(edgeId).api.length==1)
          {
            ;
          }
          else
          {

            alchemy.create.edges(data['edges'][i]);
          }
        }
        alchemy.stats.nodeStats();
        alchemy.stats.edgeStats();


      });
  }
    $scope.editor=$scope.createEditor('weaver');
    $scope.config = $scope.initAlchemyConfig(config,'graph');

    if (!$window.localStorage.username)
    {
      $rootScope.username='Mr. X'
      $rootScope.loggedIn=false
    }
    else
    {
      $rootScope.username=window.localStorage.username
      $rootScope.loggedIn=true
    }
    
    
  }]);
