var config = {
  popOverTextElements:['handle','labels'],
  popOverImgElements:['mediapath'],
  imgPrependURL:'http://d1rygkc2z32bg1.cloudfront.net/',
  graphEndPoint:'http://127.0.0.1:5000/graph/getNode/',
  logInEndPoint:'http://127.0.0.1:5000/api/',
  editGraphPropsEdge:["source","target", "handle","id"],
  editGraphPropsNode:["handle","mediapath", "labels","id"],
  dataSource: '',                      
  nodeCaption:"",
  edgeCaption:"handle",
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
  nodeTypes:{type: ["Concept", "Media"]},
  edgeCategory:{type: ["SAME_SYNSET", "HAS_MEDIA","SPATIALLY_DISTRIBUTED_AS"]},
  nodeMouseOver:null,
  captionToggle: true,
  edgesToggle: true,
  nodesToggle: true,
  nodeOverlap:50,
  zoomControls: true,
  curvedEdges:false,
  forceLocked : false,
  alpha : 0.1,
  showEditor:true,
  removeElement:true,
  search:true,
  graphEdit:true,
  directedEdges:true,
  searchMethod:'begins',
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

