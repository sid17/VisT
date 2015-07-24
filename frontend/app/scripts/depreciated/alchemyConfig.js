var config = {
  logInEndPoint:'http://127.0.0.1:5000/api/',
  dataSource: '.',                      
  nodeCaptionsOnByDefault:true,
  rootNodeRadius: 36,
  maxIterStart:200,
  maxIterUpdate:200,
  updateAfterTick:0,
  fixNodes:false,  // nodes cannot be dragged if this is set to true
  fixRootNodes:false,
  graphHeight: function(){ return 440; },
  // graphWidth: function(){ return window.innerWidth },
  showControlDash: true,
  nodeStats: true,
  edgeStats: true,
  friction:0.5,
  nodeMouseOver:null,
  captionToggle: true,
  nodeCaption: 'caption',
  edgeCaption: 'caption',
  edgesToggle: true,
  nodesToggle: true,
  nodeOverlap:50,
  zoomControls: true,
  forceLocked : false,
  alpha : 0.1,
  showEditor:true,
  removeElement:true,
  search:true,
  graphEdit:true,
  directedEdges:true,
  nodeStyle:{
    "all": 
          {
              "borderColor": "#127DC1",
              "borderWidth": function(d, radius) 
              {
                  return radius / 8
              },
              "color": function(d) 
              { 
                  return "rgb(135, 206, 250)"  
              }, 
              "radius": function(d) 
              {
                  if(d.getProperties().root)
                  return 32; else return 28
              }, 
              "captionColor": "#000000",
              "captionBackground": null,
              "captionSize": 20,
              "highlighted": {
                  "color" : "#1FBED6"
              },
          }
  },
  edgeStyle: {   // default edge configuration can be modified
    "all": {
      "width": 4,
      "color": "#006400",
      "opacity": 0.5,
      "selected": {
          "opacity": 1
        },
      "highlighted": {
          "opacity": 1
        },
      "hidden": {
          "opacity": 0
        }
    }
  }


};

