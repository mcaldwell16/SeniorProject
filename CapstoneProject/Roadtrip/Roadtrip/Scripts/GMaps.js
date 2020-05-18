function gMapsExport(data) {
    console.log(data)
    var source = 'https://www.google.com/maps/dir/';

    for (var i = 0; i < RouteList[data].Locations.length; i++) {
        source = source + RouteList[data].Locations[i].Latitude + "," + RouteList[data].Locations[i].Longitude + "/";
    }

    window.open(source, '_blank');
}

function gMapsExportCreate() {
    
    var source = 'https://www.google.com/maps/dir/';

    for (var i = 0; i < selectedLocations.name.length; i++) {
        source = source + selectedLocations.latitude[i] + "," + selectedLocations.longitude[i] + "/";
    }

    window.open(source, '_blank');
}