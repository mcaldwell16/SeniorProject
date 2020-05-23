

$(document).ready(function () {
    if (RouteList.length > 0) {
        $('#indexList').empty();
        addToIndexList();
    }
});

function addToIndexList() {
    if (RouteList.length < loadItems)
        loadItems = RouteList.length
   
    for (var i = paginationPosition; i < paginationPosition + loadItems; i++) {
        $('#indexList').append(`
            <div id="${RouteList[i].SRID}" class= "row" style="border-style: solid; border-color: darkslategrey;"> <div style='width: 5%; height: 30vh;'>${i + 1}.</div>
                
                <div id='rmap${i}' style='width: 60%; height:30vh; border-style: solid; border-color: darkseagreen;'></div>
                <div id="${RouteList[i].routeName}" style='width: 35%; height:30vh; text-align: center; padding-top: 2vh;'><i>By ${RouteList[i].Username} <br /> 
                Route Name: ${RouteList[i].routeName}</i>
                <br> 
                Tags: ${RouteList[i].Tag1}, ${RouteList[i].Tag2} <br /> 
                Stops: <br /> </div>
                <div id="thisID"></div> 
                
               
            
           
            </div>
            `);
        for (var j = 0; j < RouteList[i].Locations.length; j++) {
            $(`#${RouteList[i].routeName}`).append(`${j + 1}. ${RouteList[i].Locations[j].Name} <br />`);
        }
         mainLike(RouteList[i].SRID, RouteList[i].Username);

        console.log(RouteList); 






        showRoute(i, 'rmap' + i);
    }
    console.log(RouteList); 
    paginationPosition += loadItems;

    if (paginationPosition + loadItems > RouteList.length)
        loadItems = RouteList.length - paginationPosition;

    document.querySelector('#loadMore').value = "Load next " + loadItems + " routes [" + (RouteList.length - paginationPosition) + " left]";

    if (loadItems == 0)
        toggleOff("loadMore");


    /*var iy = tryingWork();
    if (iy != null) {
        //console.log(iy);
        var elem = document.getElementById(iy);
        console.log(elem);
        var topPos = elem.offsetTop;


        scrollTo(document.getElementById('indexList'), topPos - 5, 500);

        highlight(iy, "#ffff00");
        setTimeout(function () { highlight(iy, "#FEFD1B"); }, 500);
        setTimeout(function () { highlight(iy, "#FEFA36"); }, 600);
        setTimeout(function () { highlight(iy, "#FDF851"); }, 700);
        setTimeout(function () { highlight(iy, "#FDF56C"); }, 800);
        setTimeout(function () { highlight(iy, "#FCF386"); }, 900);
        setTimeout(function () { highlight(iy, "#FBF0A1"); }, 1000);
        setTimeout(function () { highlight(iy, "#FBEEBC"); }, 1100);
        setTimeout(function () { highlight(iy, "#FAEBD7"); }, 1200);



    }*/
}

function toggleOn(e) {
    var x = document.getElementById(e);
    x.style.display = "block";
}
function toggleOff(e) {
    var x = document.getElementById(e);
    x.style.display = "none";
}

function mainLike(id, name) {
    var source = '/SavedRoutes/CheckLike?ID=' + id;
    var my; 
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            if (response) {

                returnTrue();
                console.log("Returned True");
                $(`#${id}`).append(`<input id="${id}" name = "${name}" type = "button" class="btn btn-primary" value = "Like" onclick = "checkLike(this.id, this.name)" />`)
            }
            else {

                returnFalse();
                console.log("returned false");
                $(`#${id}`).append(`<input name="${id}" type="button" class="btn btn-primary" value="Unlike" onclick="Unlike(this.name)">`) 
            }
        },
        async: false

    });
    
    console.log("returned nothing"); 
}
function returnTrue() {
    return 1; 
}
function returnFalse() {
    return 0; 
}

function showRoute(id, divid) {

var mymap = L.map(divid).setView([45, -123], 13);

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
        },
        error: errorOnAjax

    });

}
function like(SRID, userName) {

    console.log(SRID);
    console.log(userName);
    var URL = '/SavedRoutes/SaveLike?userName=' + userName + '&SRID=' + SRID;
    $.ajax({
        type: "POST",
        url: URL,

        success: function (response) {
            location.reload();
            console.log("Data saved successfully");

        },
        error: errorOnAjax1,
        dataType: "json",
        contentType: 'application/json',
        traditional: true
    });
   // location.reload();

}
function errorOnAjax() {
    console.log("Error"); 
}
function errorOnAjax1() {
    console.log("Error number 1");
}
function Unlike(data) {
    console.log(data);
    var source = '/SavedRoutes/Unlike?ID=' + data;
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            tell();
            setTimeout(function () { alert("Unliked Succeeded"); }, 4000);
           

        },
        error: errorOnAjax

    });
   
}
function tell() {
    location.reload();

    console.log("Unliked Worked");
    
}
function sortTag() {
    var ta = document.getElementById('sortTag');
    var tag = ta.value;
    console.log(tag); 
   
    $('#indexList').empty();
    if (tag == "null") {
        location.reload(); 
    }
    else {
        toggleOff("loadMore");
        printSortedList(tag); 
    }
}
function printEntireList() {

    if (RouteList.length < loadItems)
        loadItems = RouteList.length

    for (var i = paginationPosition; i < paginationPosition + loadItems; i++) {
        $('#indexList').append(`
            <div id="${RouteList[i].SRID}" class= "row" style="border-style: solid; border-color: darkslategrey;"> <div style='width: 5%; height: 30vh;'>${i + 1}.</div>
                <div id='rmap${i}' style='width: 60%; height:30vh; border-style: solid; border-color: darkseagreen;'></div>
                <div style='width: 35%; height:30vh; text-align: center; padding-top: 13vh;'><i>By ${RouteList[i].Username} <br> 
                Route Name: ${RouteList[i].routeName}</i>
                <br> 
                Tags: ${RouteList[i].Tag1}, ${RouteList[i].Tag2}</div>
                <div id="thisID"></div> 
                
               
            
           
            </div>
            `);
        mainLike(RouteList[i].SRID, RouteList[i].Username);
        showRoute(i, 'rmap' + i);
    }
    console.log(RouteList);
    paginationPosition += loadItems;

    if (paginationPosition + loadItems > RouteList.length)
        loadItems = RouteList.length - paginationPosition;

    document.querySelector('#loadMore').value = "Load next " + loadItems + " routes [" + (RouteList.length - paginationPosition) + " left]";

    if (loadItems == 0)
        toggleOff("loadMore");

}
function printSortedList(tag) {
    for (var i = 0; i < RouteList.length; i++) {
        if (tag == RouteList[i].Tag1 || tag == RouteList[i].Tag2) {
            $(`#indexList`).append(`
            <div id="${RouteList[i].SRID}" class= "row" style="border-style: solid; border-color: darkslategrey;"> <div style='width: 5%; height: 30vh;'>${i + 1}.</div>
                <div id='rmap${i}' style='width: 60%; height:30vh; border-style: solid; border-color: darkseagreen;'></div>
                <div style='width: 35%; height:30vh; text-align: center; padding-top: 13vh;'><i>By ${RouteList[i].Username} <br> 
                Route Name: ${RouteList[i].routeName}</i>
                <br> 
                Tags: ${RouteList[i].Tag1}, ${RouteList[i].Tag2}</div>
                <div id="thisID"></div> 
                
               
            
           
            </div>
            `);
            mainLike(RouteList[i].SRID, RouteList[i].Username);
            showRoute(i, 'rmap' + i);
        }
    }
}
function searchRoutes(data) {
    if (data == null) {
        var item = document.getElementById('searchItem');
        var search = item.value;
        console.log(search);
        var source = '/SavedRoutes/SearchSaved?ID=' + search;
        $.ajax({
            type: 'GET',
            datatype: 'json',
            url: source,
            success: showSearch,
            error: errorOnAjax
        });
    }
    else {
        var source = '/SavedRoutes/SearchSaved?ID=' + data;
        $.ajax({
            type: 'GET',
            datatype: 'json',
            url: source,
            success: showSearch,
            error: errorOnAjax
        });

    }
}
function showSearch(data) {
    console.log(data); 
    var item = document.getElementById('searchItem');
    var search = item.value;
    $('#ResultsModal').empty();
   // $('#ResultsModal').append(`<div style="color:white; margin-left: 20px;"> All Routes that include ${search} </div>`);
    $('#ResultsModal').append('<ul style="margin-left: -20px; margin-right: 20px; margin-top: 15px;" id="SearchedList"></ul>');
    for (var i = 0; i < data.length; i++) {
        $('#SearchedList').append(`
        <li id="${data[i].routeName}" class="list-group-item list-group-item-dark" class="list-group-item list-group-item-dark" >Name: ${data[i].routeName} <br /> Locations: <br />  </li>`);
        for (var j = 0; j < data[i].Locations.length; j++) {
            $(`#${data[i].routeName}`).append(`${j+1}. ${data[i].Locations[j].Name} <br />`)
        }
    }
}


function showLikeModal(data) {
    console.log(data);
    $('#modaly').empty();
    $('#modaly').append('<ul style="margin-left: -20px; margin-right: 20px; margin-top: 15px;" id="likedEstList"></ul>');
    for (var i = 0; i < data.length; i++) {
        $('#likedEstList').append(`
        <li  class="list-group-item list-group-item-dark" class="list-group-item list-group-item-dark" >Name: ${data[i].EstablishmentName} <br /> 
            User Name: ${data[i].UserName} <br /> 
            <button type="button" id="${data[i].EstablishmentName}" class="btn btn-primary" data-toggle="modal" style="width:140px; height:60px;" data-target=".bd-example-modal-lg" onclick="searchRoutes(this.id)">Search</button>
           </li>
            
            
`);
    }
}

function appendLiked() {
    var source = '/Routes/getLikeEstablishments';
    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: source,
        success: showLikeModal,
        error: errorOnAjax
    });
}