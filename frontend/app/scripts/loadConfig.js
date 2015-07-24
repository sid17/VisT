$(function() 
  {
    jQuery.ajax({
        url:"scripts/config.json", 
        async:false,
        success:function(data) 
           {
                var excludeConfig=['nodeStyle','edgeStyle','graphHeight','weaverIP','weaverPort','angularIP','angularPort','djangoIP','djangoPort'];
                for (var attrname in data) 
                { 
                    if (excludeConfig.indexOf(attrname)<0)
                    {
                        config[attrname] = data[attrname]; 
                    }
                    
                }
                config['nodeStyle']['all']['radius']=function() 
                {
                    return data['nodeStyle']['radius'];
                };
                config['nodeStyle']['all']["borderColor"]=data['nodeStyle']['borderColor'];
                config['nodeStyle']['all']["captionColor"]=data['nodeStyle']['captionColor'];
                config['nodeStyle']['all']["captionBackground"]=data['nodeStyle']['captionBackground'];
                config['nodeStyle']['all']["highlighted"]={"color" : data['nodeStyle']['highlightedColor']};
                config['graphHeight']=function() 
                {
                    return data['graphHeight'];
                };
                config['edgeStyle']['all']["width"]=data['edgeStyle']['width'];
                config['edgeStyle']['all']["color"]=data['edgeStyle']['color'];
                config["graphEndPoint"]='http://'+data['djangoIP']+':'+data['djangoPort']+'/graph/getNode/';
                config['logInEndPoint']='http://'+data['djangoIP']+':'+data['djangoPort']+'/api/';


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

    });