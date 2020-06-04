
﻿$(document).ready(function () {
    populateRouteList();
 });

/*Function that makes an Ajax call to check if a route is already in a liked list*/
function checkLike(ID, Username) {

    var source = '/SavedRoutes/CheckLike?ID=' + ID;
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            if (response) {
                /*If the controller function returns true, the like function is called*/
                like(ID, Username)
            }
            else {
                errorOnAjax
            }
        }
       
    });

}
/*Function that sends the SRID back to controller to be set to the users current route */
function setToCurrent(data) {
    var source = '/SavedRoutes/SetToCurrent?ID=' + data;
    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: source,
        success: showSucc,
        error: errorOnAjax
    });





    
}
/*Simple function that returns success to the console. Used for testing */
function showSucc() {
    console.log("success"); 
    location.reload(true);
}
function populateRouteList() {
    if (RouteList.length > 0)
        $('#routeCol').empty();

    for (var i = 0; i < RouteList.length; i++) {

        $('#routeCol').append(`
<div style="display:table; width:100%">
        <div style="display: table-row">

            <div  id="${RouteList[i].SRID}" style="width: 100%; display: table-cell; background-color:antiquewhite; border:1px solid black;">
                <div  style="font-size: 20px;">Route Name: ${RouteList[i].routeName}</div>
                
                <div  style="font-size: 15px;">Start: ${RouteList[i].Locations[i].Name}</div>
                <div  style="font-size: 15px;">End: ${RouteList[i].Locations[RouteList[i].Locations.length - 1].Name}</div>
                <div  style="font-size: 10px;">Created By: ${RouteList[i].Username}</div>



                <p style="font-size: 10px;">Created on ${ moment(RouteList[i].Timestamp).format('MMMM Do YYYY, h:mm a')}</p>
                <div  style="font-size: 10px;">Tags: ${RouteList[i].Tag1} , ${RouteList[i].Tag2} </div>
                 

                 <input id="${RouteList[i].SRID}" name="${RouteList[i].Username}" type="button" value="Like" onclick="checkLike(this.id, this.name)">

                <input name="${i}" type="button" value="Show Route" onclick="showRoute(this.name)">
                <button type="button" id="Etgm${i}" class="btn btn-primary" onclick="gMapsExport(${i})">Export to Google Maps</button>
                

                <input id="${RouteList[i].SRID}" type="button" value="Delete Route" onclick="deleteRoute(this.id)">
                 
                <input id="createEvent" name="${RouteList[i].SRID}" type="button" value="Create Event" onclick="location.href = '/Events/Create?id=${RouteList[i].SRID}';">
                <input id="${RouteList[i].SRID}" type="button" value="Current" onclick="setToCurrent(this.id)">

            </div>
        </div>
</div>
`);
    }


   
        
        
    
}

function removeItem(srid) {
    var pos = 0;
    for (var i = 0; i < RouteList.length; i++) {
        if (RouteList[i].SRID == srid)
            pos = i;
    }
    RouteList.splice(pos, 1);
    populateRouteList();
    $('#routemap').empty();
    $('#routemap').append(`<p style="padding-top: 20%;">Check out a route by clicking "Show Route" in the left panel.</p>`);
    alert("Route deleted successfully.");
}

function deleteRoute(id) {
    if (confirm("Are you sure you want to delete this route?")) {
        var source = '/SavedRoutes/DeleteRoute?id=' + id;

        $.ajax({
            url: source 
        });

        removeItem(id);
    }
}


function showRoute(id) {

    document.getElementById('routemap').innerHTML = "<div id='rmap' style='width: 100%; height:80vh;'></div>";
    var mymap = L.map('rmap').setView([45, -123], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    var route = [];
    routewps = [];

    for (var i = 0; i < RouteList[id].Locations.length; i++) {
        routewps.push(L.latLng([RouteList[id].Locations[i].Latitude, RouteList[id].Locations[i].Longitude]));
    }

    var control = L.Routing.control({
        waypoints: routewps,
        units: 'imperial',
        router: L.Routing.mapbox('pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')
    }).addTo(mymap);
    control.hide();

    for (var i = 0; i < RouteList[id].Locations.length; i++) {
        route.push(L.marker([RouteList[id].Locations[i].Latitude, RouteList[id].Locations[i].Longitude]).bindPopup("<b>" + RouteList[id].Locations[i].Name + "</b>").addTo(mymap));
    }

    var group = new L.featureGroup(route);

    mymap.fitBounds(group.getBounds());
}

/*Function that makes an Ajax call to the controller to add a route to the liked list */
function like(SRID, userName) {
    
    console.log(SRID);
    console.log(userName);
    /*Builds the URL to go to the correct controller function  */
    var URL = '/SavedRoutes/SaveLike?userName=' + userName + '&SRID=' + SRID;
    $.ajax({
        type: "POST",
        url: URL,
       
        success: function (response) {
            console.log("Data saved successfully");
           
        },
        error: errorOnAjax,
        dataType: "json",
        contentType: 'application/json',
        traditional: true
    });

}
/*Simple function that returns error on AJAX return to the console. Used for testing */
function errorOnAjax(data) {
    console.log('Error on AJAX return');
    console.log(data);
}

