var config = {
  dataSource: 'data/arctic.json',                      
  nodeCaption:"",
  edgeCaption:"handle",
  rootNodeRadius: 30,
  fixNodes:false,  // nodes cannot be dragged if this is set to true
  fixRootNodes:false,
  graphHeight: function(){ return window.innerHeight-280; },
  // graphWidth: function(){ return window.innerWidth },
  showControlDash: true,
  // showStats: false,
  nodeStats: true,
  edgeStats: true,
  nodeTypes:{type: ["Concept", "Media"]},
  edgeCategory:{type: ["SAME_SYNSET", "HAS_MEDIA","SPATIALLY_DISTRIBUTED_AS"]},
  // showFilters: true,
  // nodeFilters: true,
  nodeMouseOver:null,
  captionToggle: true,
  edgesToggle: true,
  nodesToggle: true,
  nodeOverlap:70,
  zoomControls: true,
  curvedEdges:false,
  forceLocked : false,
  alpha : 0.2,
  showEditor:true,
  removeElement:true,
  // backgroundColour:'black',
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
                  return radius / 4
              },
              "color": function(d) 
              { 
                  return "rgb(135, 206, 250)"  
              }, 
              "radius": function(d) 
              {
                  if(d.getProperties().root)
                  return 25; else return 20
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

