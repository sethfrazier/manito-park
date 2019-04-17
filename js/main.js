// Run showAll function automatically when document loads
//$( document ).ready(function() {
//  showAll();
//});

var controlOnMap = false;
// $("#urgencyDropdown").change(console.log("urgencyChanged"))
$('#urgencyDropdown').on('change', function() {
    console.log(this.value);
    checkForRequiredFields();
  });

$('#issueDropdown').on('change', function() {
    console.log(this.value);
    checkForRequiredFields();
  });

$('#ui-controls #latitude').on('change', function() {
    console.log(this.value);
    checkForRequiredFields();
  });

$('#ui-controls #longitude').on('change', function() {
    console.log(this.value);
    checkForRequiredFields();
  });

//function createMap(){
    //create the map with map options
    var myMap = L.map('mapid',{
        center: [47.6366, -117.41119],
        zoom: 16,
        maxZoom: 19,
        minZoom: 14, 
});

var wikomidia=L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
            attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
            maxZoom: 18
        }).addTo(myMap);

var Esri_WorldImagery = L.tileLayer('https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '<a href="http://www.arcgis.com/home/item.html?id=da10cf4ba254469caf8016cd66369157">Esri</a>',
    maxNativeZoom: 18,
    maxZoom: 19
});

/*limits to panning*/
    var southWest = L.latLng(47.622, -117.448),
    northEast = L.latLng(47.648, -117.380);
var bounds = L.latLngBounds(southWest, northEast);

 //set bounds and animate the edge of panning area
    myMap.setMaxBounds(bounds);
    myMap.on('drag', function() {
        myMap.panInsideBounds(bounds, { animate: true });
});

/* jquery variables */
var featureSelectBox = $("#filterDropdown");

//Global Variables
var parkBoundary,
    parkFeatures,
    roads,
    userFeatures,
    trails;

//Initilize global variables for feature groups
var trailLayerGroup = L.featureGroup(),
    roadLayerGroup = L.featureGroup(),
    parkboundaryGroup = L.featureGroup(),
    userGroup = L.featureGroup(),
    parkFeaturesGroup = L.featureGroup();


//setup layer control box
    //baseMaps
    var baseMaps = {
        "Streets": wikomidia,
        "Imagery": Esri_WorldImagery
    };
    
    //overlayMaps
    var overlayMaps = {
        //"Boundary": parkboundaryGroup,
        "Park Features": parkFeaturesGroup,
        "Roads": roadLayerGroup,
        "Trails":  trailLayerGroup,
        "User Reports": userGroup,        
};

//Load layercontrol
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false, // keep the list open.
    autoZIndex: true, // Assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off
}).addTo(myMap);

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
    loadParkFeatures(sqlFilteredQueryFeat);
    loadTrails();
    loadUserInput();
    
})

getFeatureList();
/*
L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
maxZoom: 19}).addTo(myMap);*/

function getFeatureList() {
        $.getJSON('https://sfrazier.carto.com/api/v2/sql/?q=SELECT DISTINCT feattype FROM manitofeatures ORDER BY feattype ASC', function(data) {
            $.each(data.rows, function(key, val) {
                if (val.feattype !== '') {
                    featureSelectBox.append($('<option/>', {
                        value: val.feattype,
                        text : val.feattype
                    }));
                }
            });             
        });
}

var sqlQueryParkFeatures ="SELECT* FROM manitofeatures";

var sqlFilteredQueryFeat = sqlQueryParkFeatures;

 // set event listener on neighborhood select box
featureSelectBox.on('change', function() {
    var selectedTheme = $('#filterDropdown option:selected').val();
    
    filterPointsOfInterest(selectedTheme);
    console.log(selectedTheme);
});

// Function to filter the points of interest based on the selected theme
function filterPointsOfInterest(selectedTheme) {

    // All Points of Interest
    if (selectedTheme == "all") {

        // Update the SQL query to the one showing all features
        var sqlQueryAll = sqlQueryParkFeatures

        // Reload the points of interest
        loadParkFeatures(sqlQueryAll);
    }
    
    // Practical Information
    else {

        // Update the SQL query to the one showing all visitor centers
        // 11 - information/visitor center     
        var sql = "SELECT * FROM manitofeatures WHERE feattype LIKE '"+selectedTheme+"'";

        // Reload the points of interest
        loadParkFeatures(sql);
        console.log(selectedTheme);
    }
    // If the screen width is less than or equal to 850 pixels
    if (screen.width <= 850) {
        
        // Collapse the sidebar
        sidebar.close();        
    }
}


// // Function to filter the points of interest based on the selected theme
// function filterPointsOfInterest(selectedTheme) {

//     // All Points of Interest
//     if (selectedTheme == "all") {

//         // Update the SQL query to the one showing all features
//         var sqlQueryAll = sqlQueryParkFeatures

//         // Reload the points of interest
//         loadParkFeatures(sqlQueryAll);
//     }
    
//     // Practical Information
//     else if (selectedTheme == "Entrance") {

//         // Update the SQL query to the one showing all visitor centers
//         // 11 - information/visitor center     
//         var sqlEntrance = "SELECT * FROM manitofeatures WHERE feattype ILIKE 'Entrance'";

//         // Reload the points of interest
//         loadParkFeatures(sqlEntrance);
//         console.log(loadParkFeatures);
//     }
    
//      // Practical Information
//     else if (selectedTheme == "Garden") {

//         // Update the SQL query to the one showing all visitor centers
//         // 11 - information/visitor center     
//         var sqlGarden = "SELECT * FROM manitofeatures WHERE feattype ILIKE 'Garden'";

//         // Reload the points of interest
//         loadParkFeatures(sqlGarden);
//         console.log(loadParkFeatures);
//     }
    
//      // Practical Information
//     else if (selectedTheme == "Historic Area") {

//         // Update the SQL query to the one showing all visitor centers
//         // 11 - information/visitor center     
//         var sqlHistoric = "SELECT * FROM manitofeatures WHERE feattype ILIKE 'Historic Area'";

//         // Reload the points of interest
//         loadParkFeatures(sqlHistoric);
//         console.log(loadParkFeatures);
//     }
    
//      // Practical Information
//     else if (selectedTheme == "Natural Area") {

//         // Update the SQL query to the one showing all visitor centers
//         // 11 - information/visitor center     
//         var sqlNatural = "SELECT * FROM manitofeatures WHERE feattype ILIKE 'Natural Area'";

//         // Reload the points of interest
//         loadParkFeatures(sqlNatural);
//         console.log(loadParkFeatures);
//     }
    
//     // Practical Information
//     else if (selectedTheme == "Parking Area") {

//         // Update the SQL query to the one showing all visitor centers
//         // 11 - information/visitor center     
//         var sqlParking = "SELECT * FROM manitofeatures WHERE feattype ILIKE 'Parking Area'";

//         // Reload the points of interest
//         loadParkFeatures(sqlParking);
//         console.log(loadParkFeatures);
//     }
    
//     // Practical Information
//     else if (selectedTheme == "Play Area") {

//         // Update the SQL query to the one showing all visitor centers
//         // 11 - information/visitor center     
//         var sqlPlay = "SELECT * FROM manitofeatures WHERE feattype ILIKE 'Play Area'";

//         // Reload the points of interest
//         loadParkFeatures(sqlPlay);
//         console.log(loadParkFeatures);
//     }
    
//      // Practical Information
//     else if (selectedTheme == "Rest Room") {

//         // Update the SQL query to the one showing all visitor centers
//         // 11 - information/visitor center     
//         var sqlRestroom = "SELECT * FROM manitofeatures WHERE feattype ILIKE 'Rest Room'";

//         // Reload the points of interest
//         loadParkFeatures(sqlRestroom);
//         console.log(loadParkFeatures);
//     }
    
//      // Practical Information
//     else if (selectedTheme == "Structure") {

//         // Update the SQL query to the one showing all visitor centers
//         // 11 - information/visitor center     
//         var sqlStructure = "SELECT * FROM manitofeatures WHERE feattype ILIKE 'Structure'";

//         // Reload the points of interest
//         loadParkFeatures(sqlStructure);
//         console.log(loadParkFeatures);
//     }
    
//      // Practical Information
//     else if (selectedTheme == "Water Feature") {

//         // Update the SQL query to the one showing all visitor centers
//         // 11 - information/visitor center     
//         var sqlWater = "SELECT * FROM manitofeatures WHERE feattype ILIKE 'Water Feature'";

//         // Reload the points of interest
//         loadParkFeatures(sqlWater);
//         console.log(loadParkFeatures);
//     }

//     // If the screen width is less than or equal to 850 pixels
//     if (screen.width <= 850) {
        
//         // Collapse the sidebar
//         sidebar.close();        
//     }

// }

// Function to load the park boundary onto the map
function loadParkBoundary() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(parkBoundary)) {
        myMap.removeLayer(parkBoundary);
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
                    weight: 2, // set stroke weight
                    opacity: 2, // set stroke opacity
                    fillOpacity: 0.25, // override default fill opacity
                    fillColor: '#bbe1a4' // set fill color
                };
            }
        }).addTo(myMap);
        //}).addTo(parkboundaryGroup);

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
                // console.log(feature.properties)
                
                // Get the length from the GeoJSON and round it to 2 decimal places
                var length = parseFloat(feature.properties.route_leng).toFixed(2).toLocaleString();

                // Bind the name and length to a popup
                layer.bindPopup(feature.properties.name + " (" + length + " mi)");                

            }

        }).addTo(roadLayerGroup);

        // Bring the layer to the back of the layer order
        roads.bringToBack();
    });

}



// Function to load the park features onto the map
function loadParkFeatures(sqlFilteredQueryFeat) {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(parkFeatures)) {
        myMap.removeLayer(parkFeatures);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    $.getJSON("https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q="+ sqlFilteredQueryFeat, function (data) {
        console.log(sqlFilteredQueryFeat);
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
                // console.log(feature.properties)

                // Bind the name to a popup
                layer.bindPopup('<b>'+feature.properties.feattype+'</b> <br>'+feature.properties.featname);

            }
        //}).addTo(myMap)

        }).addTo(parkFeaturesGroup);

        // Turn the layer off by default
        //map.removeLayer(trailFeaturesLayerGroup);
    });

}


// Function to load the park trails onto the map
function loadTrails() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(trails)) {
        myMap.removeLayer(trails);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    $.getJSON('https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q=SELECT* FROM manitosidewalkstrails', function (data) {

        // Convert the JSON to a Leaflet GeoJson
        trails = L.geoJson(data, {

            // Create an initial style for each feature
            style: function (feature) {
                return {
                    color: '#333333', // set stroke color
                    weight: 2.5, // set stroke weight
                    opacity: 1 // set stroke opacity
                };
            },

            // Loop through each feature
            onEachFeature: function (feature, layer) {
                // console.log(feature.properties)
                
                // Get the length from the GeoJSON and round it to 2 decimal places
                var length = parseFloat(feature.properties.route_leng).toFixed(2).toLocaleString();

                // Bind the name and length to a popup
                layer.bindPopup(feature.properties.name + " (" + length + " mi)");                

            }

        }).addTo(trailLayerGroup);

        // Bring the layer to the back of the layer order
        //roads.bringToBack();
    });
}


// Function to load the park features onto the map
function loadUserInput() {

    // If the layer is already shown on the map, remove it
    if (myMap.hasLayer(userFeatures)) {
        myMap.removeLayer(userFeatures);
    }

    // Run the specified sqlQuery from CARTO, return it as a JSON, convert it to a Leaflet GeoJson, and add it to the map with a popup

    // For the data source, enter the URL that goes to the SQL API, including our username and the SQL query
    //      Added clause to exclude blank reports.
    $.getJSON("https://sfrazier.carto.com/api/v2/sql?format=GeoJSON&q=SELECT* FROM user_input WHERE userreport !=''", function (data) {

        // Convert the JSON to a Leaflet GeoJson
        userFeatures = L.geoJson(data, {

            // Create a style for the points
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    fillColor: '#0000ff',
                    fillOpacity: 1,
                    color: '#ffffff',
                    weight: 0.25,
                    opacity: 1,
                    radius: 2.5
                });
            },

            // Loop through each feature
            onEachFeature: function (feature, layer) {
                // console.log(feature.properties)

                // Bind the name to a popup
                layer.bindPopup(feature.properties.userreport);

            }

        }).addTo(userGroup);

        // Turn the layer off by default
        // myMap.removeLayer(userGroup);
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

// myMap.addControl(drawControl);
// Removed the above so it doesn't draw until called

myMap.addLayer(drawnItems);


            //apiKey: '1179d714b3b146401c9e7d6618ba1d043e644f4f',
            //username: 'sfrazier'

      
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

// /*//-----------------------------------------------------------------------------------------------------

// Function that will run when the location of the user is found
function locationFound(e) {

    // Get the current location
    myLocation = e.latlng;

    // If the current location is outside the bounds of the map, reset the map to the refuge bounds
    if (myLocation.lat < bounds[0][0] || myLocation.lat > bounds[1][0] ||
        myLocation.long < bounds[0][1] || myLocation.long > bounds[1][1]) {

        alert("You are outside of the refuge");

        // Reset the map to the refuge bounds
        myMap.fitBounds(bounds);

        // Disable the Use Current Location button, so observations can only be submitted by clicking a point
        $('#ui-controls #currentLocationButton').attr("disabled", true);

    
    // The current location is within the bounds of the map
    } else {

        // Remove the locationMarker if it's already on the map
        if (myMap.hasLayer(locationMarker)) {
            myMap.removeLayer(locationMarker);
        }

        // Add the locationMarker layer to the map at the current location
        locationMarker = L.marker(e.latlng, {
            icon: myLocationIcon
        });

        // Bind a popup
        locationMarker.bindPopup("You are here");

        // Add the location marker to the map
        locationMarker.addTo(map);

        // Initialize a variable to store an array of filter dropdown values
        var filterDropdownArray = [];

        // Loop through the existing filter dropdown values
        $('#filterDropdown > option').each(function () {
            
            // Get the current value
            var value = $(this).val();
            
            // Push it into the filter dropdown array
            filterDropdownArray.push(value);

        });

        // Initialize a new dropdown value for the nearby filter value
        var nearbyTheme = $('<option value="nearby">Within 1/2 mile of my location</option>');

        // If the filter dropdown array does not yet include the nearby filter, add it
        if (!filterDropdownArray.includes("nearby")) {
            $('#filterDropdown').append(nearbyTheme);
        }
        
        // Create a variable to store the value of the selected theme
        var selectedTheme = $("#filterDropdown option:selected").val();
        
        // If the selected theme is features within 0.5 miles from the current location update the points of interest based on the new current location
        if (selectedTheme == "nearby") {
            
            // Update the points of interest based on the selected theme
            filterPointsOfInterest(selectedTheme);
            
        }
    
    }
}

// Function that will run if the location of the user is not found
function locationNotFound(e) {

    // Display the default error message from Leaflet
    alert(e.message);
    
    // Disable the Use Current Location button, so observations can only be submitted by clicking a point
    $('#ui-controls #currentLocationButton').attr("disabled", true);    

}

// Function to add the draw control to the map to start editing
function startEdits() {

    // Remove the drawnItems layer from the map
    myMap.removeLayer(drawnItems);
    
    // Create a new empty drawnItems feature group to capture the next user-drawn data
    drawnItems = new L.FeatureGroup();  
    
    // Clear the latitude and longitude textboxes and species family and species dropdowns
    $('#ui-controls #latitude').val("");
    $('#ui-controls #longitude').val("");
    $('#speciesFamilyDropdown').val('default').attr('selected');
    $('#speciesDropdown').val('default').attr('selected');    

    // If the draw control is already on the map remove it and set the controlOnMap flag back to false
    if (controlOnMap === true) {
        myMap.removeControl(drawControl);
        controlOnMap = false;
    }

    // Add the draw control to the map and set the controlOnMap flag to true
    myMap.addControl(drawControl);
    controlOnMap = true;
    
    // If the screen width is less than or equal to 850 pixels
    if (screen.width <= 850) {
        
        // Collapse the sidebar
        sidebar.close();        
    }

}


// Function to remove the draw control from the map
function stopEdits() {

    // Remove the draw control from the map and set the controlOnMap flag back to false
    myMap.removeControl(drawControl);
    controlOnMap = false;
}

// Function to run when the Current Location button is clicked
function addPointAtCurrentLocation() {

    // Get the user's current location
    locateUser();
    
    // Remove the drawnItems layer from the map
    myMap.removeLayer(drawnItems);
    
    // Create a new empty drawnItems feature group to capture the next user-drawn data
    drawnItems = new L.FeatureGroup();    

    // When a feature is created on the map, a layer on which it sits is also created.
    // Create the locationMarker layer from the current location
    locationMarker = L.marker(myLocation, {
        icon: myLocationIcon
    });
    
    // Get the latitude and longitude
    var latitude = myLocation.lat;
    var longitude = myLocation.lng;   
    
    // Populate the latitude and longitude textboxes with the coordinates of the current location
    $('#ui-controls #latitude').val(latitude);
    $('#ui-controls #longitude').val(longitude);
    
    // Add the new layer to the drawnItems feature group
    drawnItems.addLayer(locationMarker);

    // Add the drawnItems feature group to the map
    myMap.addLayer(drawnItems);

    // Expand the sidebar and show the submit tab for the user to enter attributes about the new feature
    sidebar.open('submitTab');

}


// Function to run when a feature is drawn on the map
// Add the feature to the drawnItems layer and get its coordinates
myMap.on('draw:created', function (e) {

    // Remove the point tool
    stopEdits();
    
    // Expand the sidebar and show the submit tab for the user to enter attributes about the new feature
    sidebar.open('submitTab');

    // When a feature is created on the map, a layer on which it sits is also created. Create a new layer from this automatically created layer.
    var layer = e.layer;

    // Get the latitude and longitude
    var latitude = layer.getLatLng().lat;
    var longitude = layer.getLatLng().lng;

    // Add the new layer to the drawnItems feature group
    drawnItems.addLayer(layer);

    // Add the drawnItems feature group to the map
    myMap.addLayer(drawnItems);

    // Expand the sidebar and show the submit tab for the user to enter attributes about the new feature
    sidebar.open('submitTab');
    
    // Populate the latitude and longitude textboxes with the coordinates of the clicked point
    $('#ui-controls #latitude').val(latitude);
    $('#ui-controls #longitude').val(longitude);
    
    // Enable the Submit button if the required fields are populated
    checkForRequiredFields();

});

// Function to check for required fields
function checkForRequiredFields() {
    
    // Create variables to store the latitude and longitude
    var latitude = $('#ui-controls #latitude').val();
    var longitude = $('#ui-controls #longitude').val();
    
    // Create a variable to store the selected species family
    selectedUrgency = $("#urgencyDropdown").val();

    // Create a variable to store the selected species family
    selectedIssue = $("#issueDropdown").val();

    // If the latitude, longitude, species family, and species are all populated
    if (latitude !== "" && longitude !== "" && selectedUrgency !== "" && selectedIssue !== "") {
        // Enable the Submit button
        $('#submitButton').prop("disabled", false);
    }
    else {
        // Disable the Submit button
        $('#submitButton').prop("disabled", true);
    }
}

// Function to cancel the newly drawn points
function cancelData() {
    
    // Remove the drawnItems layer from the map
    myMap.removeLayer(drawnItems);
    
    // Create a new empty drawnItems feature group to capture the next user-drawn data
    drawnItems = new L.FeatureGroup();
    
    // Clear the latitude and longitude textboxes and species family and species dropdowns
    $('#ui-controls #latitude').val('');
    $('#ui-controls #longitude').val('');
    $('#urgencyDropdown').val('default').attr('selected');
    $('#issueDropdown').val('default').attr('selected');
    
    // Disable the Submit button
    $('#submitButton').attr("disabled", true);
}

//-----------------------------------------------------------------------------------------------------*/

function setData(){
    // get the variables from teh fields
    // Create variables to store the latitude and longitude
    var latitude = $('#ui-controls #latitude').val();
    var longitude = $('#ui-controls #longitude').val();
    
    // Create a variable to store the selected species family
    urgency = $("#urgencyDropdown").val();

    // Create a variable to store the selected species family
    issue = $("#issueDropdown").val();

    // use Fetch API to send request
    fetch(`https://sfrazier.carto.com/api/v2/sql?q=
        INSERT INTO user_input(userreport, importance, the_geom) VALUES(${issue}, ${urgency}, St_GeomFromTEXT('POINT(${longitude} ${latitude})', 4326))&api_key=1179d714b3b146401c9e7d6618ba1d043e644f4f`,
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
    
    refresh();
    cancelData();
            
}


myMap.on(L.Draw.Event.CREATED, function (e) {
    let layer = e.layer;
    myMap.addLayer(layer);
    let layerAdded = JSON.stringify(layer.toGeoJSON().geometry)
            
    // use Fetch API to send request
    fetch(`https://sfrazier.carto.com/api/v2/sql?q=
        INSERT INTO user_input(userreport, importance, the_geom) VALUES('Dead Animal', 'High', St_SetSRID(St_GeomFromGeoJSON('${layerAdded}'), 4326))&api_key=1179d714b3b146401c9e7d6618ba1d043e644f4f`,
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
    
    refresh();
            
        });

//refreshLayer();

// Function to refresh the layers to show the updated dataset
function refresh() {
    
    // Remove the existing wildlife observations layer
    if (myMap.hasLayer(userFeatures)) {
        myMap.removeLayer(userFeatures);
    }
    
    // Reload the wildlife observations layer with the new point
    loadUserInput();
    
    // If the screen width is less than or equal to 850 pixels
    //if (screen.width <= 850) {
        
        // Collapse the sidebar
        //sidebar.close();        
    //}
}


//https://sfrazier.carto.com/api/v2/sql?q=INSERT INTO test_table (column_name, column_name_2, the_geom) VALUES ('this is a string', 11, ST_SetSRID(ST_Point(-110, 43),4326))&api_key={api_key}

