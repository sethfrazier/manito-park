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
/*
L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
maxZoom: 19}).addTo(myMap);*/

drawnItems = new L.FeatureGroup();
        drawControl = new L.Control.Draw({
        draw: {
                polygon: true,
                polyline: false,
                line: false,
                marker: false,
                rectangle: true,
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
    myMap.addLayer(drawnItems);

// define client
          // We have created a empty dataset with private privacy
          // and we give it insert permission for SQL and select permission for maps
          // So we can display the geometries added on the map when we refresh
        const client = new carto.Client({
            apiKey: '1179d714b3b146401c9e7d6618ba1d043e644f4f',
            username: 'sfrazier'
        });
        let source = new carto.source.SQL(`
            SELECT * FROM manitoboundary
        `);
        
        let cartoCSS = new carto.style.CartoCSS(`
            #layer {
                polygon-fill: blue;
            }`
        );
        let cartoLayer = new carto.layer.Layer(source, cartoCSS);

        client.addLayer(cartoLayer);

        client.getLeafletLayer().addTo(myMap);
 