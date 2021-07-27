//var eq_url= 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

//var earthquakes = new L.LayerGroup();

var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var myMap = L.map("mapid", {
 center: [37.09, -95.71],
 zoom: 5,
 
});

graymap_background.addTo(myMap);

// satellite background.
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);
// outdoors background.
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);
// map object to an array of layers we created.

// adding one 'graymap' tile layer to the map.
graymap_background.addTo(myMap);
// layers for two different sets of data, earthquakes and tectonicplates.
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();
// base layers
var baseMaps = {
 Satellite: satellitemap_background,
 Grayscale: graymap_background,
 Outdoors: outdoors_background
};
// overlays
var overlayMaps = {
 "Tectonic Plates": tectonicplates,
 "Earthquakes": earthquakes
};
// control which layers are visible.
L
 .control
 .layers(baseMaps, overlayMaps)
 .addTo(myMap);
// retrieve earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {
 function styleInfo(feature) {
   return {
     opacity: 1,
     fillOpacity: 1,
     fillColor: getColor(feature.properties.mag),
     color: "#000000",
     radius: getRadius(feature.properties.mag),
     stroke: true,
     weight: 0.5
   };
 }
 // Define the color of the marker based on the magnitude of the earthquake.
 function getColor(magnitude) {
   switch (true) {
     case magnitude > 5:
       return "#EA2C2C";
     case magnitude > 4:
       return "#EA822C";
     case magnitude > 3:
       return "#EE9C00";
     case magnitude > 2:
       return "#EECC00";
     case magnitude > 1:
       return "#D4EE00";
     default:
       return "#98EE00";
   }
 }
 // define the radius of the earthquake marker based on its magnitude.
 function getRadius(magnitude) {
   if (magnitude === 0) {
     return 1;
   }
   return magnitude * 3;
 }
 // add GeoJSON layer to the map
 L.geoJson(data, {
   pointToLayer: function(feature, latlng) {
     return L.circleMarker(latlng);
   },
   style: styleInfo,
   onEachFeature: function(feature, layer) {
     layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
   }
 }).addTo(earthquakes);
 earthquakes.addTo(myMap);
 var legend = L.control({
   position: "bottomright"
 });
 legend.onAdd = function() {
   var div = L
     .DomUtil
     .create("div", "info legend");
   var grades = [0, 1, 2, 3, 4, 5];
   var colors = [
     "#98EE00",
     "#D4EE00",
     "#EECC00",
     "#EE9C00",
     "#EA822C",
     "#EA2C2C"
   ];
   for (var i = 0; i < grades.length; i++) {
     div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
       grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
   }
   return div;
 };
 legend.addTo(myMap);
});

 // retrive Tectonic Plate geoJSON data.
 d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
   function(platedata) {
     L.geoJson(platedata, {
       color: "orange",
       weight: 2
     })
     .addTo(tectonicplates);
     // add the tectonicplates layer to the map.
     tectonicplates.addTo(myMap);
   });


