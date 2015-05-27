'use strict';

angular.module('visualisationTool')
  .controller('graphCtrl', ['$scope', '$http', function ($scope, $http) {
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
      // var input=document.getElementById('weaver').value;
      var weaverGraphEndpoint = 'http://52.25.65.189:8000/graph/getNode/';

        $.getJSON(weaverGraphEndpoint, 
          {
              query: 'phone',
              number: 100,
              overwrite:'1',
              directionVal: 'F'
          }, 
          function(data) 
          {
              console.log(data);
              var config=$scope.config;
              config.dataSource=data;
              document.getElementById('nodeModalButton').style.display='block';
              document.getElementById('edgeModalButton').style.display='block';
              alchemy = new Alchemy(config);
              return false;
          });

    }

    $scope.initAlchemyConfig= function (config,graphId) {
		config.divSelector="#"+graphId;
		config.edgeTypes = "caption";
    // document.getElementById('myModalNode').style.display='none';
    // document.getElementById('myModalEdge').style.display='none';
		// alchemy = new Alchemy({divSelector:"#"+graphId,graphHeight: function(){ return window.innerHeight-100 },});
		alchemy = new Alchemy(config);
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
        if (key=='mediapath')
        {
          url='http://d1rygkc2z32bg1.cloudfront.net/'+dict[key];
          img = img+  '<div id = \"image"><img src = "'+url+'" style="width:200px;" /></div>';
        }
        else if (key=='handle' || key=='labels')
        {
          img=img+key+" : "+dict[key]+"<br>";
        }
     }
      var UID='node-'+elem['id'];
      elem=document.getElementById(UID);
      $(elem).popover
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
          jsonObj[x[i].value]=x[i+1].value
        }
    }
    var edge=JSON.parse(JSON.stringify(jsonObj));
    alchemy.create.edges(edge);

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
        jsonObj[x[i].value]=x[i+1].value
      }
    }
    jsonObj['id']=$scope.hashFn(jsonObj['handle']);
    jsonObj['root']=true;
    var node=JSON.parse(JSON.stringify(jsonObj));
    alchemy.create.nodes(node);
    document.getElementById('modalFormNode').innerHTML='<div class="form-group"><div class="col-xs-6"><input  class="form-control keyVal" value="handle" disabled></div><div class="col-xs-6"><input  class="form-control keyVal" placeholder="Value"required></div></div>'
    $scope.addPopOver(jsonObj);
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
    console.log(input);
    var weaverGraphEndpoint = 'http://52.25.65.189:8000/graph/getNode/';
    $.getJSON(weaverGraphEndpoint, 
      {
          query: input,
          number: 10,
          overwrite:'0',
          directionVal:'B'
      },function(data) 
      {
        // var config=$scope.config;
        // console.log(config);
        // config.dataSource=data;
        // alchemy = new Alchemy(config);
        // return false;

        alchemy.create.nodes(data['nodes']);
        alchemy.create.edges(data['edges']);
        console.log(typeof data['nodes']);
        console.log(data['nodes']);



      });
  }
  	$scope.editor=$scope.createEditor('weaver');
  	$scope.config = $scope.initAlchemyConfig(config,'graph');
  }]);
