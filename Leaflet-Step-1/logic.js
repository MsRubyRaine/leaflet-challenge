// Store our API endpoint as link.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the link
d3.json(link).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, magnitude, and depth of the earthquake.
  function feature_popup(feature, layer) {
    layer.bindPopup(
      `<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`
    );
  }

  // set different color for magnitude strength
  function getColor(depth) {
    if (depth > 90) {
      return "#610000";
    }
    if (depth > 70) {
      return "#940000";
    }
    if (depth > 50) {
      return "#C73333";
    }
    if (depth > 30) {
      return "#FA6666";
    }
    if (depth > 10) {
      return "#FF9999";
    }
    return "#FFCCCC"
  }

  //Make new function to style marker radius
  function get_radius(magnitude) {
    return magnitude * 4;
  }

//Loop the data through & create Circle Markers
var earthquakes = L.geoJSON(earthquakeData, {
  pointToLayer: function (feature, layer) {
    console.log(feature);
    return L.circleMarker(layer, {
      radius: get_radius(feature.properties.mag),
      fillOpacity: 0.85,
      color: getColor(feature.geometry.coordinates[2]),
    });
  },
  onEachFeature: feature_popup,
});

//Create Map
createMap(earthquakes);
}

function createMap(earthquakes) {
// Make the base layers.
var street = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

var topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

// Create Overlay
var overlayMaps = {
  Earthquakes: earthquakes,
};

// Create Map. Include Streetmap & Earthquake Layers
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [street, earthquakes],
});


// Set up the legend.
var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Depth</h4>";
    div.innerHTML += '<i style="background: #FFCCCC"></i><span>-10 to 10</span><br>';
    div.innerHTML += '<i style="background: #FF9999"></i><span>10 to 30</span><br>';
    div.innerHTML += '<i style="background: #FA6666"></i><span>30 t0 50</span><br>';
    div.innerHTML += '<i style="background: #C73333"></i><span>50 to 70</span><br>';
    div.innerHTML += '<i style="background: #940000"></i><span>70 to 90</span><br>';
    div.innerHTML += '<i style="background: #610000"></i><span>90+</span><br>';
    return div;
  };

  legend.addTo(myMap);
}