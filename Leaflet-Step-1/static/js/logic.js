// Perform an API call to the tectonic data endpoint
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(tectonicData){
    // Perform an API call to the earthquake data endpoint
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
      
    var earthquakeMarkers=[];
    // loop through earthquake data to get the depths of earthquakes
    for (var i=0;i<data.features.length;i++){
        var color="";
        // set marker color according to the depth of the earthquake
        if(data.features[i].geometry.coordinates[2]>=90){
            color="#FF0D0D";
        }
        else if(data.features[i].geometry.coordinates[2]<90&&data.features[i].geometry.coordinates[2]>=70){
            color="#FF4E11";
        }
        else if(data.features[i].geometry.coordinates[2]<70&&data.features[i].geometry.coordinates[2]>=50){
            color="#FF8E15";
        }
        else if(data.features[i].geometry.coordinates[2]<50&&data.features[i].geometry.coordinates[2]>=30){
            color="#FAB733";
        }
        else if(data.features[i].geometry.coordinates[2]<30&&data.features[i].geometry.coordinates[2]>=10){
            color="#ACB334";
        }
        else if(data.features[i].geometry.coordinates[2]<10&&data.features[i].geometry.coordinates[2]>=-10){
            color="#69B34C";
        }
        // create circle marker for each earthquake location
        earthquakeMarkers.push(
        L.circleMarker([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]],{
            radius:data.features[i].properties.mag*5,
            color:"black",
            opacity:0.9,
            weight:1,
            fillColor:color,
            fillOpacity:0.9,
            stroke:false
            // create popup for each earthquake
        }).bindPopup("<h>"+data.features[i].properties.place+
        "</h3><hr><p>"+ new Date(data.features[i].properties.time)+"</p>"));
      
    }
    var tectonicLine=[];
    // loop through tectonic data to get the coordinates
    for (i=0;i<tectonicData.features.length;i++){
        
            var line=tectonicData.features[i].geometry.coordinates;
            // reverse the latitude and longitude of the coordinates
            for (j=0;j<line.length;j++){
                
                var line1=[line[j][1],line[j][0]];
                // create polygon for tectonic plate boundaries
                tectonicLine.push(
                    L.polygon([line1],{
                        color:"orange",
                        fillcolor:"orange",
                        fillOpacity:'0.95',
                        weight:'10',  
                    }))
            }   
    }
    //  create the tile layer that will be the background of the map
    var satellitemap=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize:512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "satellite-v9",
            accessToken: API_KEY
          });
    // create the tile layer for background of the mao
    var grayscalemap=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "light-v10",
            accessToken: API_KEY
          });
    // create the tile layer that will be the background of the map
    var outdoorsmap=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "outdoors-v10",
            accessToken: API_KEY
          });
    //Define a baseMap object to hold base layers
    var baseMaps={
            "Satellite":satellitemap,
            "Grayscale":grayscalemap,
            "Outdoors":outdoorsmap
    
        };
    // Create overlay objects to hold overlay layer
    var earthquake=L.layerGroup(earthquakeMarkers);
    var tectonic=L.layerGroup(tectonicLine);
    var overlayMaps={
            'Tectonic Plates' :tectonic,
            Earthquakes:earthquake
        };
    // Create the map, giving it satellitemap, earthquake and tectonic layers to display
    var myMap=L.map("map",{
            center:[37.09,-95.71],
            zoom:5,
            layers:[satellitemap,earthquake,tectonic]
        });
    //Create a layer control, pass in baseMaps and overlay layers 
    L.control.layers(baseMaps,overlayMaps,{
            collapsed:false
        }).addTo(myMap);
    // Create legend to indicate the color of the circle marker
    var legend=L.control({position:"bottomright"});
    legend.onAdd=function(){
        
        var div=L.DomUtil.create("div","info legend");
       
        var categories=["#69B34C","#ACB334","#FAB733","#FF8E15","#FF4E11","#FF0D0D"];
        var labels=[];
        var legendInfo="<div class=\"labels\">"+"</div>";
        div.innerHTML=legendInfo;
       
            labels.push(
            "<li style=\"background-color:"+categories[0]+"\"></li>   "+"-10--10"+"<br>"
            +"<li style=\"background-color:"+categories[1]+"\"></li>  "+"10--30"+"<br>"
            +"<li style=\"background-color:"+categories[2]+"\"></li>  "+"30--50"+"<br>"
            +"<li style=\"background-color:"+categories[3]+"\"></li>  "+"50--70"+"<br>"
            +"<li style=\"background-color:"+categories[4]+"\"></li>  "+"70--90"+"<br>"
            +"<li style=\"background-color:"+categories[5]+"\"></li>  "+"90+"+"<br>");

        
        
         div.innerHTML="<ul>"+labels.join("")+"</ul>";   
        return div;
    };
    legend.addTo(myMap);
    
});


});
