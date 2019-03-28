function createMap(){
    //create the map with map options
    var myMap = L.map('map',{
        center: [34.2, -111.6873],
        zoom: 7,
        maxZoom: 10,
        minZoom: 6, 
});
    
 var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'+addToAtt,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoic2ZyYXppZXIiLCJhIjoiY2lzbDZmOXo1MDdtbjJ1cHUzZDFxMGpuayJ9.vyt9QGsmTezFJ1TtrI6Q2w'
}).addTo(myMap);
    
    //load the map when ready
   // $(document).ready(createMap);