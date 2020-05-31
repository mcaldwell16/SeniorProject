

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
                <div id="${RouteList[i].routeName}" style='width: 35%; height:30vh; text-align: center; padding-top: 2vh;'><i>By <a href="Profiles/Details/${RouteList[i].Username}">${RouteList[i].Username} </a> <br /> 
                Route Name: ${RouteList[i].routeName}</i>
                <br> 

                Tags: ${RouteList[i].Tag1}, ${RouteList[i].Tag2} <br /> 
                Stops: <br /> </div>
                <div id="thisID"></div> 

                
                <br><button type="button" id="Etgm${i}" class="btn btn-primary" onclick="gMapsExport(${i})">Export to Google Maps</button>
                </div>

                
               

            </div>
            `);
        /*Loops to print out the locations that are inside of the route */
        for (var j = 0; j < RouteList[i].Locations.length; j++) {
            $(`#${RouteList[i].routeName}`).append(`${j + 1}. ${RouteList[i].Locations[j].Name} <br />`);
        }
        /*function that calls to see if the route is present in the current users 
         liked Routes list. Appends like or unlike button depending on result*/
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


    
}

function toggleOn(e) {
    var x = document.getElementById(e);
    x.style.display = "block";
}
function toggleOff(e) {
    var x = document.getElementById(e);
    x.style.display = "none";
}
/*Function that checks if the Route is contained inside of the current users liked list*/
function mainLike(id, name) {
    var source = '/SavedRoutes/CheckLike?ID=' + id;
    var my; 
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            if (response) {
                /*If the controller function returns true, the like button is appended to the list*/
                returnTrue();
                console.log("Returned True");
                $(`#${id}`).append(`<input id="${id}" name = "${name}" type = "button" class="btn btn-primary" value = "Like" onclick = "checkLike(this.id, this.name)" />`)
            }
            else {
                /*If controller function returns false, then the unlike button is appeneded to the list*/
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
/*When the like button is pressed, this function is called. It sends back the Route ID 
 and checks it against the current users Like Routes list*/
function checkLike(ID, Username) {
    /*Sends the ID back via URL */
    var source = '/SavedRoutes/CheckLike?ID=' + ID;
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            /*If the function returns true, then the route is not in the list. The like function is 
             called and the route is added to the list*/
            if (response) {
                like(ID, Username)
            }
            /*If it ruturns false, it does nothing*/
            else {
                errorOnAjax
            }
        },
        error: errorOnAjax

    });

}
/*Function that adds the like to the current users liked list in the database*/
function like(SRID, userName) {

    console.log(SRID);
    console.log(userName);
    /*Sends back the userName and the savedRoute ID to add it to the databasea */
    var URL = '/SavedRoutes/SaveLike?userName=' + userName + '&SRID=' + SRID;
    $.ajax({
        type: "POST",
        url: URL,

        success: function (response) {
            /*Reloads the page so the list can updated from the controller*/
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
/*function that is called when the unlike button is pressed. Sends back the Liked Route ID to the contoller, for the entry in the 
database to be deleted*/
function Unlike(data) {
    console.log(data);
    /*building the URL with the Liked Route ID */
    var source = '/SavedRoutes/Unlike?ID=' + data;
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            /*Calls the function to reload the list with the proper buttons*/
            tell();
            setTimeout(function () { alert("Unliked Succeeded"); }, 4000);
           

        },
        error: errorOnAjax

    });
   
}
/*Function that reloads the page*/
function tell() {
    location.reload();

    console.log("Unliked Worked");
    
}
/*Function that is called when the user sorts the routese by tag on the All Routes page */
function sortTag() {
    /*Gets the tag that the user chose to sort by */
    var ta = document.getElementById('sortTag');
    var tag = ta.value;
    console.log(tag); 
   /*empties the indexList so it can be repopulated with the correct information*/
    $('#indexList').empty();
    /*If the tag is null, the page reloads to grab the original content*/
    if (tag == "null") {
        location.reload(); 
    }
    else {
        /*If it doesn't equal null, it calls the printSortedList function passing 
         along the intended tag to sort by*/
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
/*Function that sorts the All Routes list by a specific tag. Called inside of the SortTag() function  */
function printSortedList(tag) {
    /*Loops through all of the routes inside of the RouteList*/
    for (var i = 0; i < RouteList.length; i++) {
        /*If the user inputed tag matches either of the tags on any of the routes
         then that element is appended to indexList*/
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
            /*mainLike is called to check if the like or unlike button should be appended to each item of the list*/
            mainLike(RouteList[i].SRID, RouteList[i].Username);
            /*Calls the map function to show the map with the route on it*/
            showRoute(i, 'rmap' + i);
        }
    }
}
/*Function that is called when the user inputs an item to search for and hits the search button */
function searchRoutes(data) {
    /*If no data is inputed, an alert pops up to prompt an input*/
    if (data == undefined) {
        console.log(data);
        alert("Enter an Input!");
    }
    else {
        /*If the input is not undefined, an Ajax call is made to the controller,
         * to search for the users input*/
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
/*Function that is called after the Ajax call in searchRoutes returns  */
function showSearch(data) {
    /*Populates the data into the console. Used for testing */
    console.log(data); 
    var item = document.getElementById('searchItem');
    var search = item.value;
    /*Empty the Modal so that the new data can be populated*/
    $('#ResultsModal').empty();
   /*Appends the routes that had the users inputed search found in them*/
    $('#ResultsModal').append('<ul style="margin-left: -20px; margin-right: 20px; margin-top: 15px;" id="SearchedList"></ul>');
    /*Loops through the data and appends the routes to the modal*/
    for (var i = 0; i < data.length; i++) {
        /*Appends the route name*/
        $('#SearchedList').append(`
        <li id="${data[i].routeName}" class="list-group-item list-group-item-dark" class="list-group-item list-group-item-dark" >Name: ${data[i].routeName} <br /> Locations: <br />  </li>`);
        /*Loops through to print out all of the locations stored within the route*/
        for (var j = 0; j < data[i].Locations.length; j++) {
            $(`#${data[i].routeName}`).append(`${j+1}. ${data[i].Locations[j].Name} <br />`)
        }
    }
}

/*Appends the liked Establishment list from the current user into a modal on the page. Called inside of the appendLiked() function */
function showLikeModal(data) {
    /*Logs the data to the console. Used for testing*/
    console.log(data);
    /*empties the modal, so the new data can be appended*/
    $('#modaly').empty();
    /*Appends a new list to the modal*/
    $('#modaly').append('<ul style="margin-left: -20px; margin-right: 20px; margin-top: 15px;" id="likedEstList"></ul>');
    /*Loops through and appends each liked Establishment to the modal*/
    for (var i = 0; i < data.length; i++) {
        $('#likedEstList').append(`
        <li  class="list-group-item list-group-item-dark" class="list-group-item list-group-item-dark" >Name: ${data[i].EstablishmentName} <br /> 
            User Name: ${data[i].UserName} <br /> 
            <button type="button" id="${data[i].EstablishmentName}" class="btn btn-primary" data-toggle="modal" style="width:140px; height:60px;" data-target=".bd-example-modal-lg" onclick="searchRoutes(this.id)">Search</button>
           </li>
            
            
`);
    }
}
/*Function makes an Ajax call to the controller to grab the current users 
 * liked establishment list*/
function appendLiked() {
    var source = '/Routes/getLikeEstablishments';
    /*Ajax call that gets the liked establishment list for the current logged in user*/
    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: source,
        success: showLikeModal,
        error: errorOnAjax
    });
}