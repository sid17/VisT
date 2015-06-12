'use strict';

angular.module('visualisationTool')
  .controller('graphCtrl', ['$scope', '$http','$rootScope', '$window','AuthService','$location','ngNotify','$log','$compile',function ($scope, $http,$rootScope,$window,AuthService,$location,ngNotify,$log,$compile) {
    

$scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/300',
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide();
  }



$scope.dropVal='phone';
$scope.dropValLimit='10';

$scope.items = [
    'watching',
    'human',
    'standing_human',
    'sitting_human',
    'phone',
    'ceiling',
    'pen'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {

    // $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.searchBrain=function()
  {
    console.log('searching');
    $scope.queryGraph();

  }
  $scope.record=function(val)
  {
   $scope.dropVal=val;
  }






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
        
        $window.nodeColorMap[node.id]=color;
        node.setStyles();
        // node._style['color']=color;
        
        // node.setStyles('borderColor',color);

      }
      
    }
    console.log($window.nodeColorMap);
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
          // console.log('TRUE');
          console.log(edge);
          // edge._style['stroke']='black';
          // edge._style['color']='black';
          // console.log(edge._style)
          // console.log(edge.id);
          $window.edgeColorMap[edge.id+edge._index]=color;
          edge.setStyles();

        }
      }
      console.log($window.edgeColorMap);
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
    // var elementProps;
    //   if (category=='node')
    //   {
    //     node = alchemy.get.nodes(iden);
    //     node.remove()
    //   }
    //   else
    //   {
    //     var element;
    //     for (var i=0;i<alchemy._edges[Id].length;i++)
    //     {
          
    //       if (alchemy._edges[Id][i]._properties['handle']==handle)
    //       {
    //         element=alchemy._edges[Id][i];
    //         break;
    //       }
    //     }
    //     element.remove();
        
    //   }
    //   var query={}
    //   query['type']='Delete';
    //   query['category']='edge';
    //   query['props']=elementProps;

    //   $rootScope.writeToLog(query);
    //   document.getElementById('insertStuff').innerHTML="";
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
      console.log(data);
      for (var i=0;i<data['edges'].length;i++)
      {
        if ($scope.inViewEdges.indexOf(data['edges'][i]['handle']) < 0)
        {
          $scope.inViewEdges.push(data['edges'][i]['handle'])
          edges.push(data['edges'][i]);
        }
      }


      for (var i=0;i<data['nodes'].length;i++)
      {
        if ($scope.inViewNodes.indexOf(data['nodes'][i]['handle']) < 0)
        {
          $scope.inViewNodes.push(data['nodes'][i]['handle'])
          nodes.push(data['nodes'][i]);
        }
      }
      // console.log(nodes);
      // console.log(edges);
      data['nodes']=nodes;
      data['edges']=edges;
      return data;
    };
    $scope.queryGraph=function()
    {
      console.log('query');
      var childNode=document.getElementById('graph').childNodes[0];
      childNode.parentNode.removeChild(childNode);
      $scope.inViewEdges=[];
      $scope.inViewNodes=[];
      var weaverGraphEndpoint = $scope.config.graphEndPoint;
        
        $.getJSON(weaverGraphEndpoint, 
          {
              query: $scope.dropVal,
              number: $scope.dropValLimit,
              overwrite:'1',
              directionVal: 'U'
          }, 
          function(data) 
          {
              console.log(data);
              data=$scope.removeDuplicates(data)
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
    $scope.alchemy=alchemy

// document.getElementById('test')

    // var str='<div style="height:100%"><b style="font-size:1.5em">Search Brain</b> <br><img src="images/s1.png" height=150 width=400/><br> <b style="font-size:1.5em">Hover over Nodes to view properties</b> <br><img src="images/s2.png" height=150 width=400/><br><b style="font-size:1.5em">Expand the side menu to edit properties</b> <br><img src="images/s3.png" height=150 width=400/> </div>';
    // ngNotify.set(str, {
    // theme: 'pastel',
    // type: 'success',
    // position:'top',
    // sticky: true,
    // html: true,
    // duration: 500
    // });
    return config;
  };





  $scope.addKeyValNode=function(val)
  {
    $scope.editElementProperties[val]="";
    // var text='<div class="form-group"><div class="col-xs-6"><input  data-identity="added" class="form-control keyVal Added" placeholder="Key"> </div><div class="col-xs-6"><input  data-identity="added" class="form-control keyVal Added" placeholder="Value"></div></div>';
    // var d = document.createElement('div');
    // d.innerHTML = text;
    // var element=d.firstChild;
    // document.getElementById('modalFormNode').appendChild(element); 
  
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
          // console.log(url);
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


  $scope.CreateNode=function(node)
  {
    console.log(node.src);
    var jsonObj = {};
    jsonObj['handle']=node.src;

    jsonObj['id']=$scope.hashFn(jsonObj['handle']);
    var nodeObj=JSON.parse(JSON.stringify(jsonObj));
    alchemy.create.nodes(nodeObj);
    $scope.addPopOver(jsonObj);

    var query={};
    query['type']='create'
    query['category']='node'
    query['props']=jsonObj
    $rootScope.writeToLog(query)

  };

  $scope.CreateEdge=function(edge)
  {
    console.log(edge.src);
    console.log(edge.dst);
    var jsonObj = {};
    jsonObj['source']=edge.src;
    jsonObj['target']=edge.dst
    
    var edge=JSON.parse(JSON.stringify(jsonObj));
    alchemy.create.edges(edge);
    
    var query={};
    query['type']='create'
    query['category']='edge'
    query['props']=jsonObj
    $rootScope.writeToLog(query)



    
  };

$scope.editProperties=function(element)
{
  console.log(element);
  $('#myModalNode').modal('show');
}

$scope.deleteProperty=function(key)
{
  
  key=key.substring(key.indexOf('!@')+2,key.length);
  console.log(key);
  delete $scope.editElementProperties[key];
  $scope.refreshContent();

}

$scope.SaveProperties=function()
{
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
          console.log(url);
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
    $rootScope.writeToLog(query);
}

$scope.deleteEdges=function(element)
{
  
  element.self.remove()
}

$scope.PropertyModify=function(element,type)
{
  console.log(element.self._properties);
  $scope.editElementProperties=jQuery.extend(true, {}, element.self._properties);
  $scope.editElement=element;
  $scope.editElementType=type;
  $scope.refreshContent()


}



$scope.refreshContent=function()
{

var str="";
for (var key in $scope.editElementProperties)
{
  console.log(key,$scope.editElementProperties[key]);
   str=str+"<div class='form-group'><div class='col-xs-5'> \
      <input  class='form-control keyVal' value='"+key+"' disabled> \
    </div> \
    <div class='col-xs-5'> \
      <input  class='form-control keyVal' onchange='alert(\" hello world \");'  value='"+$scope.editElementProperties[key]+"'>  \
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
  console.log(id);
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
        

      //   for (var i=0;i<data['nodes'].length;i++)
      //   {
          
      // if (alchemy.get.nodes(data['nodes'][i].id).api.length==1)
      //     {
      //       ;
      //     }
      //     else
      //     {
      //       alchemy.create.nodes(data['nodes'][i]);
      //       $scope.addPopOver(data['nodes'][i]);
      //     }
      //   }

        // for (var i=0;i<data['edges'].length;i++)
        // {
        //   var edgeId="" + data['edges'][i].source + "-" +data['edges'][i].target;
        //   if (alchemy.get.edges(edgeId).api.length==1)
        //   {
        //     ;
        //   }
        //   else
        //   {

        //     alchemy.create.edges(data['edges'][i]);
        //   }
        // }
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
