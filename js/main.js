// Run showAll function automatically when document loads
//$( document ).ready(function() {
//  showAll();
//});

var refugeBoundary,
    roads,
    trailFeatures;

//Initilize global variables for feature groups
var trailFeaturesLayerGroup = L.featureGroup()

//function createMap(){
    //create the map with map options
    var myMap = L.map('mapid',{
        center: [47.637078, -117.411275],
        zoom: 14,
        maxZoom: 18,
        minZoom: 6, 
});

var wikomidia=L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(myMap);

var Esri_WorldImagery = L.tileLayer('https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '<a href="http://www.arcgis.com/home/item.html?id=da10cf4ba254469caf8016cd66369157">Esri</a>',
    maxNativeZoom: 18,
    maxZoom: 19
});

//setup layer control box
    //baseMaps
    var baseMaps = {
        "Streets": wikomidia,
        "Grayscale": Esri_WorldImagery
    };
    
    //overlayMaps
    var overlayMaps = {
        "Trails": trailFeaturesLayerGroup,
        //"County Boundary": county,
};

//Load layercontrol
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

//move zoomcontrol to topright
myMap.zoomControl.setPosition('topleft');

var sidebar = L.control.sidebar({
    autopan:true,
    closeButton: true,
    container:'sidebar',
    position: 'left',
}).addTo(myMap);

//Run the load data functions when the document loads
$(document).ready(function(){
    //load all carto data
    loadParkBoundary();
    loadRoads();
    loadParkFeatures();
    loadTrails();
    loadUserInput();
})

/*
L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
maxZoom: 19}).addTo(myMap);*/

// Function to load the park boundary onto the map
function loadParkBoundary() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(refugeBoundary)) {
        myMap.removeLayer(refugeBoundary);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    $.getJSON("https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM manitoboundary", function (data) {
              
              // Convert the JSON to a Leaflet GeoJson
              parkBoundary = L.geoJson(data, {


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
        parkBoundary.bringToBack();
    });
}


// Function to load the park roads onto the map
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

        }).addTo(trailFeaturesLayerGroup);

        // Bring the layer to the back of the layer order
        //roads.bringToBack();
    });

}

// Function to load the park features onto the map
function loadParkFeatures() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(trailFeatures)) {
        myMap.removeLayer(trailFeatures);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    $.getJSON('https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q=SELECT* FROM manitofeatures', function (data) {

        // Convert the JSON to a Leaflet GeoJson
        parkFeatures = L.geoJson(data, {

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

}


// Function to load the park trails onto the map
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

// Function to load the park features onto the map
function loadUserInput() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(trailFeatures)) {
        myMap.removeLayer(trailFeatures);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    $.getJSON('https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q=SELECT* FROM user_input', function (data) {

        // Convert the JSON to a Leaflet GeoJson
        parkFeatures = L.geoJson(data, {

            // Create a style for the points
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    fillColor: 'pink',
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

}

//INSERT INTO user_input (userinit, userreport, comments, the_geom) VALUES ('this is a string', '11', 'ggg' ST_SetSRID(ST_Point(-112, 47),4326))


drawnItems = new L.FeatureGroup();
drawControl = new L.Control.Draw({
draw: {
    polygon: false,
    polyline: false,
    line: false,
    marker: true,
    rectangle: false,
    circle: false,
    circlemarker: false
},
    edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: false
},
    position: 'topleft'
});

 

myMap.addControl(drawControl);
myMap.addLayer(drawnItems);


            //apiKey: '1179d714b3b146401c9e7d6618ba1d043e644f4f',
            //username: 'sfrazier'
        
        
        
     /*   // Convert the JSON to a Leaflet GeoJson
        parkFeatures = L.geoJson(data, {

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
        
        }).addTo(myMap)
        */

      

myMap.addControl(drawControl);

// define client
          // We have created a empty dataset with private privacy
          // and we give it insert permission for SQL and select permission for maps
          // So we can display the geometries added on the map when we refresh
        const client = new carto.Client({
            apiKey: '1179d714b3b146401c9e7d6618ba1d043e644f4f',
            username: 'sfrazier'
        });
/*source = new carto.source.SQL(`
            SELECT * FROM user_input
        `);

cartoCSS = new carto.style.CartoCSS(`
            #layer {
                marker-fill: green;
            }`
        );

cartoLayer = new carto.layer.Layer(source, cartoCSS);

        client.addLayer(cartoLayer);

        client.getLeafletLayer().addTo(myMap);*/

myMap.on(L.Draw.Event.CREATED, function (e) {
            let layer = e.layer;
            myMap.addLayer(layer);
            let layerAdded = JSON.stringify(layer.toGeoJSON().geometry)
            
            // use Fetch API to send request
            fetch(`https://sfrazier.carto.com/api/v2/sql?q=
                    INSERT INTO user_input(userreport, comments, the_geom) VALUES('test', 'moreTest', St_SetSRID(St_GeomFromGeoJSON('${layerAdded}'), 4326))&api_key=1179d714b3b146401c9e7d6618ba1d043e644f4f`,
                    {
                        headers: new Headers({
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*'
                        }),
                        method: 'get',
                        mode: 'no-cors'
                    }
            ).then(function(response){
                console.log(response)
            }).catch(function(err){
                console.log(err)
            })
    refreshLayer();

            
        });

// Function to refresh the layers to show the updated dataset
function refreshLayer() {
    
    // Remove the existing wildlife observations layer
    if (myMap.hasLayer(loadUserInput)) {
        myMap.removeLayer(loadUserInput);
    }
    
    // Reload the wildlife observations layer with the new point
    //loadWildlifeObservations();
    
    // If the screen width is less than or equal to 850 pixels
    if (screen.width <= 850) {
        
        // Collapse the sidebar
        sidebar.close();        
    }
}

//https://sfrazier.carto.com/api/v2/sql?q=INSERT INTO test_table (column_name, column_name_2, the_geom) VALUES ('this is a string', 11, ST_SetSRID(ST_Point(-110, 43),4326))&api_key={api_key}

