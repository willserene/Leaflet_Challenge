
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL

d3.json(queryUrl, function(data) {  
  console.log(data.features);
  
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(features, layer) {
    layer.bindPopup("<h3>" + features.properties.place +
      "</h3><hr><p>" + new Date(features.properties.time) + "</p>");
  }

  function markerColor(depth) {
    switch (true) {
      case depth < 0:
          return "green";
        case depth < 10:
          return "lime";
        case depth < 20:
          return "yellow";
        case depth < 30:
          return "orange";
        case depth < 40:
          return "orangered";
        case depth >= 40:
          return "red";
      }
    
  }
  
  function markerSize(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 4;
  }



  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  
  
  var earthquakes = L.geoJSON(earthquakeData, {
    
    pointToLayer: function (earthquakeData, latlng) {

      return L.circleMarker(latlng, {

        opacity: 1,
        fillOpacity: 1,
        radius: markerSize(earthquakeData.properties.mag),
        color: "white",
        weight: 1,
        fillColor: markerColor(earthquakeData.geometry.coordinates[2]),
        stroke: true,

      });
    },
    onEachFeature: onEachFeature
  });


    // pointToLayer: function (earthquakeData, latlng) {
      // return L.circleMarker(latlng, geoJSONMarker)
      // var geoJSONMarker = {
      //     radius: markerSize(earthquakeData.properties.mag),
      //     markerColor: markerColor(earthquakeData.geometry.coordinates[2]),
      //     color: "white",
      //     weight: 1,
      //     opacity: 1,
      //     fillOpacity: 0.8,
      //     stroke: true,
      // }

  //     onEachFeature: onEachFeature
  //   },
  // });
  
  // Sending our earthquakes layer to the createMap function
  
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  
// Create our map and give it a starting point
var myMap = L.map("map", {
  center: [38, -96],
  zoom: 5,
  layers: [streetMap, darkMap, earthquakes]
});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetMap,
    "Dark Map": darkMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  // Create legend
  var legend = L.control({
    position: "bottomright"
});

// The code below is attributed to group member and class teammate 'Sharon'
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var labels = ["Earthquake Depth"];
    var depths = [40, 30, 20, 10, 0];
    var colors = geojson.options.colors;
    
            
    depths.forEach(function(depth, index) {
        div.innerHTML+= 
        labels.push("<i class='rectangle' style = 'background: " + markerColor(depth) + "'>" + depth + " </i> kilometers"
        );           
    });
    div.innerHTML = labels.join("<br>");
    return div;
};

  legend.addTo(myMap)
}

createMap(earthquakes);
};



  // // Set up the legend
  // var legend = L.control({ position: "bottomright" });
  // legend.onAdd = function() {
  //   var div = L.DomUtil.create("div", "info legend");
  //   var limits = geojson.options.limits;
  //   var colors = geojson.options.colors;
  //   var labels = [];

  //   // Add min & max
  //   var legendInfo = "<h1>Median Income</h1>" +
  //     "<div class=\"labels\">" +
  //       "<div class=\"min\">" + limits[0] + "</div>" +
  //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  //     "</div>";

  //   div.innerHTML = legendInfo;

  //   limits.forEach(function(limit, index) {
  //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  //   });

  //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  //   return div;
  // };

  // Adding legend to the map
  // legend.addTo(myMap);
//     var legend = L.control({ position: "bottomright" })
//     legend.onAdd = function () {
//       var div = L.DomUtil.create("div", "info legend");
//       var magnitude = [0, 1.0, 2.0, 3.0, 4.0, 5.0];
//       var limits = geojson.options.limits;
//       var colors = geojson.options.colors;
//       var labels = [];
      
//       var legendInfo = "<h1>Earthquake Depth</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

      
//       div.innerHTML = legendInfo;
// // loop through our magnitude intervals and generate a label with a colored square for each interval
//         for (var i = 0; i < magnitude.length; i++) {
//             div.innerHTML += '<i style= "background:' + fillColor(magnitude[i]) + '"></i> ' +
//             magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
//         }
//         return div;
//     }
//     legend.addTo(myMap)


// function fillColor(magnitude) {
//   switch (true) {
//       case magnitude >= 5.0:
//           return '#d73027';
//       case magnitude >= 4.0:
//           return '#fc8d59';
//       case magnitude >= 3.0:
//           return '#fee08b';
//       case magnitude >= 2.0:
//           return '#d9ef8b';
//       case magnitude >= 1.0:
//           return '#91cf60';
//       case magnitude < 1.0:
//           return '#1a9850';
//   }
// }

// function markerSize(magnitude) {
//     if (magnitude === 0) {
//       return 1;
//     }
//     return magnitude * 4;
// }