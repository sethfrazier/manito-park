function createMap(){
    //create the map with map options
    var myMap = L.map('map',{
        center: [34.2, -111.6873],
        zoom: 7,
        maxZoom: 10,
        minZoom: 6, 
});
    
  //Map tiles streets and greyscale
    var streets = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
    maxZoom: 19
    }).addTo(myMap); 
    
    //load the map when ready
    $(document).ready(createMap);