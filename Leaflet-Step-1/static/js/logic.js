
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL

d3.json(queryUrl, function(data) {  
  console.log(data);
  console.log(data.features);
  
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function markerColor(depth) {
    switch (true) {
      // case depth < 0:
      //     return "green";
        case depth < 10:
          return "green";
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


    // Define lightMap, darkMap, and satMap and layers
  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

  var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
});

  var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution:  "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Light Map" : lightMap,
  "Dark Map" : darkMap,
  "Satellite" : satMap
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Quakes : earthquakes
};
// Create our map and give it a starting point
var myMap = L.map('map', {
  center: [15, -90],
  zoom: 2.5,
  layers: [lightMap, earthquakes]
});


  
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  // Create legend
  var legend = L.control({position: "bottomright"});


legend.onAdd = function() {
    
    var div = L.DomUtil.create('div', 'info legend'),
        labels = ["Earthquake Depth"],
        depths = [40, 30, 20, 10, 0];
     
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
});