
﻿$(document).ready(function () {
    populateRouteList();
 });


function checkLike(ID, Username) {

    var source = '/SavedRoutes/CheckLike?ID=' + ID;
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            if (response) {
                like(ID, Username)
            }
            else {
                errorOnAjax
            }
        }
       
    });

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

            </div>
        </div>
</div>
`);
    }


    var iy = tryingWork();
    if (iy != null) {
        //console.log(iy);
        var elem = document.getElementById(iy);
        console.log(elem); 
        var topPos = elem.offsetTop;


        scrollTo(document.getElementById('routeCol'), topPos - 5, 500);

        highlight(iy, "#ffff00");
        setTimeout(function () { highlight(iy, "#FEFD1B"); }, 500);
        setTimeout(function () { highlight(iy, "#FEFA36"); }, 600);
        setTimeout(function () { highlight(iy, "#FDF851"); }, 700);
        setTimeout(function () { highlight(iy, "#FDF56C"); }, 800);
        setTimeout(function () { highlight(iy, "#FCF386"); }, 900);
        setTimeout(function () { highlight(iy, "#FBF0A1"); }, 1000);
        setTimeout(function () { highlight(iy, "#FBEEBC"); }, 1100);
        setTimeout(function () { highlight(iy, "#FAEBD7"); }, 1200);
        
        
        
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
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
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


function like(SRID, userName) {
    
    console.log(SRID);
    console.log(userName);
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
function errorOnAjax(data) {
    console.log('Error on AJAX return');
    console.log(data);
}

function tryingWork() {
    let params = new URLSearchParams(location.search);
    var my = params.get("ID");
    
    return my; 
}
function scrollTo(element, to, duration) {
    console.log(element);
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function () {
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();

}

Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

function highlight(name, color) {
    var a = document.getElementById(name);
    console.log(a);
    a.style.backgroundColor = color;
}