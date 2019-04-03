// Run showAll function automatically when document loads
//$( document ).ready(function() {
//  showAll();
//});

var refugeBoundary,
    roads,
    trailFeatures;

//function createMap(){
    //create the map with map options
    var myMap = L.map('mapid',{
        center: [47.637078, -117.411275],
        zoom: 14,
        maxZoom: 18,
        minZoom: 6, 
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(myMap);

//move zoomcontrol to topright
myMap.zoomControl.setPosition('topleft');

var sidebar = L.control.sidebar({
    autopan:true,
    closeButton: true,
    container:'sidebar',
    position: 'left',
}).addTo(myMap);

/*
L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
maxZoom: 19}).addTo(myMap);*/

// Function to load the refuge boundary onto the map
function loadRefugeBoundary() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(refugeBoundary)) {
        myMap.removeLayer(refugeBoundary);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    $.getJSON("https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM manitoboundary", function (data) {
              
              // Convert the JSON to a Leaflet GeoJson
              refugeBoundary = L.geoJson(data, {


            // Create an initial style for each feature
            style: function (feature) {
                return {
                    color: '#5c8944', // set stroke color
                    weight: 1.5, // set stroke weight
                    opacity: 1, // set stroke opacity
                    fillOpacity: 0.25, // override default fill opacity
                    fillColor: '#bbe1a4' // set fill color
                };
            }

        }).addTo(myMap);

        // Bring the layer to the back of the layer order
        refugeBoundary.bringToBack();
    });
}


// Function to load the refuge roads onto the map
function loadRoads() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(roads)) {
        myMap.removeLayer(roads);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    $.getJSON('https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q=SELECT* FROM manitostreets', function (data) {

        // Convert the JSON to a Leaflet GeoJson
        roads = L.geoJson(data, {

            // Create an initial style for each feature
            style: function (feature) {
                return {
                    color: '#9e559c', // set stroke color
                    weight: 2.5, // set stroke weight
                    opacity: 1 // set stroke opacity
                };
            },

            // Loop through each feature
            onEachFeature: function (feature, layer) {
                
                // Get the length from the GeoJSON and round it to 2 decimal places
                var length = parseFloat(feature.properties.route_leng).toFixed(2).toLocaleString();

                // Bind the name and length to a popup
                layer.bindPopup(feature.properties.route_name + " (" + length + " mi)");                

            }

        }).addTo(myMap);

        // Bring the layer to the back of the layer order
        //roads.bringToBack();
    });

}

// Function to load the refuge trail features onto the map
//function loadTrailFeatures() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(trailFeatures)) {
        myMap.removeLayer(trailFeatures);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    $.getJSON('https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q=SELECT* FROM manitofeatures', function (data) {

        // Convert the JSON to a Leaflet GeoJson
        trailFeatures = L.geoJson(data, {

            // Create a style for the points
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    fillColor: '#5d0000',
                    fillOpacity: 1,
                    color: '#ffffff',
                    weight: 0.25,
                    opacity: 1,
                    radius: 2.5
                });
            },

            // Loop through each feature
            onEachFeature: function (feature, layer) {

                // Bind the name to a popup
                layer.bindPopup(feature.properties.feature_type);

            }
        }).addTo(myMap)

        //}).addTo(trailFeaturesLayerGroup);

        // Turn the layer off by default
        //map.removeLayer(trailFeaturesLayerGroup);
    });

//}


// Function to load the refuge roads onto the map
function loadTrails() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(roads)) {
        myMap.removeLayer(roads);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    $.getJSON('https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q=SELECT* FROM manitosidewalkstrails', function (data) {

        // Convert the JSON to a Leaflet GeoJson
        roads = L.geoJson(data, {

            // Create an initial style for each feature
            style: function (feature) {
                return {
                    color: '#808080', // set stroke color
                    weight: 2.5, // set stroke weight
                    opacity: 1 // set stroke opacity
                };
            },

            // Loop through each feature
            onEachFeature: function (feature, layer) {
                
                // Get the length from the GeoJSON and round it to 2 decimal places
                var length = parseFloat(feature.properties.route_leng).toFixed(2).toLocaleString();

                // Bind the name and length to a popup
                layer.bindPopup(feature.properties.route_name + " (" + length + " mi)");                

            }

        }).addTo(myMap);

        // Bring the layer to the back of the layer order
        //roads.bringToBack();
    });

}

loadRefugeBoundary();
loadRoads();
loadTrails();
/*
drawnItems = new L.FeatureGroup();
        drawControl = new L.Control.Draw({
        draw: {
                polygon: false,
                polyline: false,
                line: false,
                marker: true,
                rectangle: false,
                circle: false,
                circlemarker: false,
            },
            edit: {
                featureGroup: drawnItems,
                edit: false,
                remove: false
            },
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true
                }
            }
        });

 

myMap.addControl(drawControl);
myMap.addLayer(drawnItems);*/