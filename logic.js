// Visualizing Dayta with Leaflet
// Level 1 & 2: Basic Visualization & More Data (Optional)
// File: logic.js

// Declare the GeoJSON link to get earthquake data
var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log (API_quakes)

// Declare the GeoJSON link to get tectonic plates data
var API_plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log (API_plates)

// Define a function that will give each city a different radius based on the earthquake's magnitude
function markerSize(magnitude) {
    return magnitude * 4;
};

// Create a LayerGroup for earthquakes
var earthquakes = new L.LayerGroup();

// Perform an API call to the GeoJSON API to fletch earthquake data.
d3.json(API_quakes, function (geoJson) {
    // Create a GeoJSON layer with the retrieved data.
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },
        style: function (geoJsonFeature) {
            return {
                fillColor: getColor(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);

    // 
    createMap(earthquakes);
});

// Create a LayerGroup for tectonic plates
var tectonicPlates = new L.LayerGroup();

// Perform an API call to the GeoJSON API to fletch tectonic plates data.
d3.json(API_plates, function (geoJson) {
    // Create a GeoJSON layer with the retrieved data.
    L.geoJSON(geoJson.features, {
        // Style each feature (in this case ?)
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'magenta'
            }
        },
    }).addTo(tectonicPlates);
})

// Create a function that takes “magnitude” as parameter, 
// which takes a specific value from GeoJSON data, 
// and then returns the colour value (in form of colour) after comparison.
function getColor(magnitude) {
    if (magnitude > 5) {
        return 'Red'
    } else if (magnitude > 4) {
        return 'DarkOrange' 
    } else if (magnitude > 3) {
        return 'SandyBrown'
    } else if (magnitude > 2) {
        return 'Yellow'
    } else if (magnitude > 1) {
        return 'PaleGreen '
    } else {
        return 'LawnGreen'
    }
};

// Function to create all maps used in this work.

function createMap() {

    // Add a tile layer that will be the street background of our map.
    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
    });

    // Add a tile layer that will be the stellite background of our map.
    var Satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
    });

    // Create the tile layer that will be the high contrast background of our map.
    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
    });

    // Only one base layer can be shown at a time
    var baseMaps = {
        "Streets": streetMap,
        "Satellite": Satellite,
        "High Contrast": highContrastMap
    };

    // Overlays that may be to toggled on or off.
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates,
    };

    // Create map object.
    var myMap = L.map('mymap', {
        center: [40, -99],
        zoom: 4,
        layers: [streetMap, earthquakes, tectonicPlates] // 
    });

    // Create a layer control, pass in the baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Show the legend section on map,
    var legend = L.control({ position: 'bottomright' });

    // Create an event of adding legends on map.  
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];
        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"
        // HTML element div has styled inside loop having background colour values from getColor() method 
        // and &ndash is HTML entities used for typography.
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // The following statement adds the legends on map.
    legend.addTo(myMap);
}