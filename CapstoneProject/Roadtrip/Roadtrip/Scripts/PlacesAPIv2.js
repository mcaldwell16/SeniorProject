$(document).ready(function () {
    toggleOff("saveButton");
    toggleOff("alertboard");
    //document.getElementById('searchmap').innerHTML = "<div id='smap' style='height: 100%; background-color: black;'></div>";

    map = L.map('smap', {
        minZoom: 1,
        maxZoom: 19
    });


    map.setView([0, 0], 0);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            map.setView([position.coords.latitude, position.coords.longitude], 13)
        });
    }

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    searchGroup = L.layerGroup().addTo(map);
    routeGroup = L.layerGroup().addTo(map);

});




function showLikeModal(data) { 
    console.log(data);
    $('#modaly').empty();
    $('#modaly').append('<ul style="margin-left: -20px; margin-right: 20px; margin-top: 15px;" id="likedEstList"></ul>');
    for (var i = 0; i < data.length; i++) {
        $('#likedEstList').append(`
        <li  class="list-group-item list-group-item-dark" class="list-group-item list-group-item-dark" >Name: ${data[i].EstablishmentName} <br /> 
            User Name: ${data[i].UserName} <br /> 
           <input id="${data[i].EstablishmentID}" type="button" value="Get Details" onclick="details(this.id)"> 

        <input id="${data[i].EstablishmentID}" type="button" value="Unlike" onclick="unlikeEst(this.id)">
<br /> </li>
            
            
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
function mainLikeEST(id, name, lat) {
    var source = '/SavedRoutes/CheckLikeEstablishment?ID=' + id;
    var my;
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            if (response) {


                console.log("Returned True");
                $(`#${id}`).append(` <input id="${id}" name="${name}" type="button" value="Like" onclick="checkLikeEstablishment(this.id, this.name)">`)
            }
            else {


                console.log("returned false");
                $(`#${id}`).append(`<input name="${id}" type="button"  value="Unlike" onclick="unlikeEst(this.name)">`)
            }
        },
        async: false

    });


}

function unlikeEst(id) {
    console.log(id);
    var source = '/SavedRoutes/UnlikeEst?ID=' + id;
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {

            setTimeout(function () { alert("Unliked Succeeded"); }, 500);
            appendLiked();
            test(searchedLocations);

        },
        error: errorOnAjax

    });
}


function checkLikeEstablishment(ID, Name) {

    var source = '/SavedRoutes/CheckLikeEstablishment?ID=' + ID;
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            if (response) {
                LikeEstablishment(ID, Name);
                test(searchedLocations);
            }
            else {
                setTimeout(function () { alert("Already Liked"); }, 400);
                console.log("ALREADY LIKED");
            }
        },
        error: errorOnAjax

    });

}

function LikeEstablishment(data1, data2) {
    console.log(data1);
    console.log(data2);
    var source = '/SavedRoutes/SaveLikeEstablishment?ID=' + data1 + "&ID2=" + data2;
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: source,
        success: showSucc,
        error: errorOnAjax
    });



}
function showSucc() {
    console.log("DATA SAVED");
}

function toggle(e) {
    var x = document.getElementById(e);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function toggleOn(e) {
    var x = document.getElementById(e);
    x.style.display = "block";
}

function toggleOff(e) {
    var x = document.getElementById(e);
    x.style.display = "none";
}


function saveRoute() {
    if (confirm("Are you sure you want to save this route?")) {
        var savedList = new Array();

        var RName = document.getElementById('routeName');

        var routeName = RName.value;

        console.log(routeName);
        var ta = document.getElementById('Tag');
        var tag1 = ta.value;
        var ta2 = document.getElementById('Tag2');
        var tag2 = ta2.value;
        console.log(tag2);


        for (var i = 0; i < selectedLocations.name.length; i++) {
            savedList.push({
                Name: selectedLocations.name[i],
                Latitude: selectedLocations.latitude[i],
                Longitude: selectedLocations.longitude[i],
                Id: selectedLocations.id[i]

            });
        }
        console.log(savedList);

        var source = '/SavedRoutes/SaveRoute?routeName=' + routeName + '&tag1=' + tag1 + '&tag2=' + tag2;
        document.getElementById('alertboard').innerHTML = "<div id='panelinner'>SAVING...</div>";
        toggleOff("panel");
        toggleOn("alertboard");
        $.ajax({
            type: "POST",
            url: source,
            data: JSON.stringify(savedList),
            success: function (response) {
                console.log("Data saved successfully");
                alert("Route saved successfully!");
                document.getElementById('alertboard').innerHTML = "";
                document.getElementById('alertboard').innerHTML = "<div id='panelinner'>SAVED!</div>";
                toggleOn("panel");
                toggleOff("alertboard");
                //if (response.result == 'Redirect')
                //  window.location = response.url;
            },
            error: errorOnAjax,
            dataType: "json",
            contentType: 'application/json',
            traditional: true
        });
    }
}

function establishments() {
    var name1 = document.getElementById('name');
    var radius1 = document.getElementById('numbers');
    var city1 = document.getElementById('city');
    var state1 = document.getElementById('state');
    var name = name1.value;
    var numbers = radius1.value * 1609;
    if (numbers > 40000) {
        numbers = 39999;
    }
    var city = city1.value;
    var state = state1.value;
    console.log(numbers);
    var source = '/Routes/GetEstablishment?name=' + name + '&numbers=' + numbers + '&city=' + city + '&state=' + state;

    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: source,
        success: test,
        error: errorOnAjax
    });
}

function errorOnAjax(data) {
    console.log('Error on AJAX return');
    console.log(data);
}

//function to append all returned establishments to route creation page
function test(data) {

    console.log(data);
    showMap(data);

    $('#establishments').empty();
    $('#establishments').append('<ul id="estList" style="padding: 0;"></ul>');
    for (var i = 0; i < data.total; i++) {
        searchedLocations = data;
        $('#estList').append(`
        <li class="list-group-item list-group-item-dark" id="${data.latitude[i]}">${data.name[i]} <br>
<div id = "${data.id[i]}"> </div> 
        <input id="${data.id[i]}" type="button" value="Get Details" onclick="modalComments1(this.id); details(this.id);">
        <input id="${data.id[i]}" type="button" value="Add Location" onclick="addName(this.id)">

        </li>


`);
        mainLikeEST(data.id[i], data.name[i], data.latitude[i]);
    }
}

//returns detail;s of selected establishment
function details(id) {
    var source = '/Routes/GetDetails?id=' + id;

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: source,
        success: showDetails,
        error: errorOnAjax
    });
}

function showDetails(data) {
    console.log(data);
    $('#details').empty();
    modal.style.display = "block";
    $('#details').append(`<div style="margin-top:50px;margin-bottom:50px;"><img src="${data.image[0]}" style="width:200px;height:150px;"><br> <b>${data.names[0]}</b><br>This business has a rating of ${data.ratings[0]}
    <br> Located at: ${data.addresss[0]}  ${data.citys[0]}, ${data.states[0]} ${data.zipcodes[0]}<br>The phone number for this business is: ${data.phones[0]}
    <input id="${data.id}" type="button" value="MoreDetails" onclick="moreDetails(this.id)">
    <input id="modalButton" name="${data.id}" type="button" value="User Comments" onclick="modalComments1(this.name)"</div>`);
}


var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("modalButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks the button, open the modal and populate with comments for that establishment 
function modalComments(data) {
    console.log(data);
    if (data[0] == null) {
        $('#comments').empty();
        var link = '/Comments/Create/' + data.EstablishmentID;
        modal.style.display = "block";
        $('#createComment').attr("href", link)
    }
    else {
        var link = '/Comments/Create/' + data[0].EstablishmentID;
        console.log(link);
        modal.style.display = "block";
        var length = data.length;
        console.log($('#comments'));
        $('#comments').empty();

        for (var i = 0; i < length; i++) {
            $('#comments').append(`<div class="commentBox"> 
                <a href="/Profiles/details/${data[i].UserName}">${data[i].UserName} ${data[i].DateS}<a/>
                <br/>
                <div>${data[i].Comment1}<div/> 
                <div/> <br />`)
        }
        $('#createComment').attr("href", link)
    }
}

function modalComments1(id) {
    var source = '/Routes/LoadComments?id=' + id;
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: source,
        success: modalComments,
        error: errorOnAjax
    });
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


/*function addName(id) {
    
    var bool = true; 
    */

function moreDetails(id) {
    var source = '/Routes/GetMoreDetails?id=' + id;

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: source,
        success: showMoreDetails,
        error: errorOnAjax
    });
}

function showMoreDetails(data) {
    console.log(data);
    $('#comments').empty();
    for (var i = 0; i < 3; i++) {

        $('#comments').append(`<div style="margin-top:50px;margin-bottom:50px;"><img src="${data.image[i]}" style="width:200px;height:150px;"><br><b>${data.name[i]}</b><br>${data.text[i]}<br><b>This user has a rating of</b> ${data.rating[i]}<br></div>`);
    }
}

function addName(id) {

    var bool = true;

    for (var i = 0; i < selectedLocations.name.length; i++) {
        if (id == selectedLocations.id[i]) {
            bool = false;
        }


    }
    console.log(bool);



    if (bool == true) {
        var source = '/Routes/GetDetails?id=' + id;
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: source,
            success: showName,
            error: errorOnAjax
        });
        for (let i = 0; i < searchedLocations.indexs.length; i++) {
            if (searchedLocations.id[i] == id) {
                selectedLocations.name.push(searchedLocations.name[i]);
                selectedLocations.rating.push(searchedLocations.rating[i]);
                selectedLocations.indexs.push(searchedLocations.indexs[i]);
                selectedLocations.latitude.push(searchedLocations.latitude[i]);
                selectedLocations.longitude.push(searchedLocations.longitude[i]);
                selectedLocations.id.push(searchedLocations.id[i]);
            }
        }
        if (selectedLocations.name.length > 1) {
            toggleOn("saveButton");
            toggleOn("exportButton");
        }


        showMap(searchedLocations);
    }

}

function reOrder() {
    //var elements = document.getElementsByClassName("test");
    var elements = document.getElementById("sortable").getElementsByTagName("li");
    //var names = '';
    var names = {
        name: [],
        rating: [],
        indexs: [],
        latitude: [],
        longitude: [],
        id: []
    };



    for (var i = 0; i < elements.length; i++) {
        names.name.push(elements[i].id);
    }

    for (var i = 0; i < names.name.length; i++) {
        for (var j = 0; j < selectedLocations.indexs.length; j++) {
            if (names.name[i] == selectedLocations.name[j]) {
                names.latitude.push(selectedLocations.latitude[j]);
                names.longitude.push(selectedLocations.longitude[j]);
                names.id.push(selectedLocations.id[j]);

            }
        }
    }

    for (var i = 0; i < selectedLocations.indexs.length; i++) {
        selectedLocations.name[i] = names.name[i];
        selectedLocations.latitude[i] = names.latitude[i];
        selectedLocations.longitude[i] = names.longitude[i];
        selectedLocations.id[i] = names.id[i];

    }
    console.log(names);
    console.log(selectedLocations);

    establishments();

}

function showName(data) {



    $('#sortable').append(`<li class="list-group-item list-group-item-dark" id="${data.names[0]}">${data.names[0]}<div data-toggle="tooltip" data-placement="top" title="Delete"><input id="${data.names[0]}" type="button" value="❌" onclick="removeElement(this.id)"></div></li>`);

}

function removeElement(elementId) {
    for (let i = selectedLocations.name.length; i >= 0; i--) {
        if (elementId == selectedLocations.name[i]) {



            selectedLocations.name.splice(i, 1);
            selectedLocations.latitude.splice(i, 1);
            selectedLocations.longitude.splice(i, 1);
            selectedLocations.indexs.splice(i, 1);
            selectedLocations.id.splice(i, 1);

            var element = document.getElementById(elementId);
            element.parentNode.removeChild(element);
            //delete selectedLocations.latitude[i];
            //delete selectedLocations.longitude[i]; 
            if (selectedLocations.name.length < 2) {
                toggleOff("saveButton");
                toggleOff("exportButton");
            }
            console.log(selectedLocations);
            showMap(searchedLocations);
        }
    }

}


function highlight(name, color) {
    var a = document.getElementById(name);
    console.log(a);
    a.style.backgroundColor = color;
}

function jumpTo(data, id) {

    var elem = document.getElementById(data);
    console.log(elem);
    var topPos = elem.offsetTop;


    scrollTo(document.getElementById('establishments'), topPos - 5, 500);

    highlight(data, "#ffff00");
    setTimeout(function () { highlight(data, "#f6f622"); }, 500);
    setTimeout(function () { highlight(data, "#eced43"); }, 600);
    setTimeout(function () { highlight(data, "#e3e465"); }, 700);
    setTimeout(function () { highlight(data, "#d9da87"); }, 800);
    setTimeout(function () { highlight(data, "#d0d1a8"); }, 900);
    setTimeout(function () { highlight(data, "#c6c8ca"); }, 1000);


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

function checkSelected(id) {
    for (var i = 0; i < selectedLocations.name.length; i++) {
        if (id == selectedLocations.id[i])
            return true;
    }
    return false;
}

function showMap(data) {

    //map.setView([data.latitude[0], data.longitude[0]], 13);
    if (map != null) {
        searchGroup.clearLayers();
        routeGroup.clearLayers();
    }

    var array = [];

    for (var i = 0; i < data.total; i++) {
        if (!checkSelected(data.id[i])) {
            array.push(L.marker([data.latitude[i], data.longitude[i]], { icon: locIcon }).bindPopup(`<b>${data.name[i]}</b>
        </br><input id="${data.id[i]}" type="button" value="Add" onclick="addName(this.id)"><input id="${data.name[i]}" type="button" value="Show" onclick="jumpTo(${data.latitude[i]})">`).addTo(searchGroup));

        }
    }
    var group = new L.featureGroup(array);
    map.fitBounds(group.getBounds().pad(0.5));

    if (selectedLocations.name.length > 0) {
        array = [];
        routewps = [];

        for (var i = 0; i < selectedLocations.name.length; i++) {
            //L.marker([selectedLocations.latitude[i], selectedLocations.longitude[i]]).bindPopup("<b>" + selectedLocations.name[i] + "</b>").addTo(routeGroup);
            routewps.push(L.latLng([selectedLocations.latitude[i], selectedLocations.longitude[i]]));
        }


        //group = new L.featureGroup(array);

        if (control != null) {
            map.removeControl(control);
            control = null;
        }

        
        control = L.Routing.control({
            waypoints: routewps,
            lineOptions: {
                styles: [{ color: 'white', opacity: 1, weight: 5 }, { color: 'blue', opacity: 1, weight: 3 }]
            },
            createMarker: function (i, wp, nWps) {
                if (i === 0) {
                    return L.marker(wp.latLng, { icon: startIcon });
                } else if (i === nWps - 1) {
                    return L.marker(wp.latLng, { icon: finishIcon });
                }
                    else {
                    return L.marker(wp.latLng, { icon: markerIcon });
                }
            },
            addWaypoints: false,
            units: 'imperial',
            fitSelectedRoutes: false,
            //createMarker: function () { return null; },
            router: L.Routing.mapbox('pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')
        }).addTo(map);
        control.hide();
        //map.fitBounds(group.getBounds().pad(0.5));
    }
}

function getDistance(rwp1, rwp2) {
    var source = 'https://router.project-osrm.org/route/v1/driving/' + rwp1[1] + ',' + rwp1[0] + ';' + rwp2[1] + ',' + rwp2[0] + '?overview=false';

    return JSON.parse($.ajax({
        type: 'GET',
        dataType: 'application/json',
        url: source,
        async: false
    }).responseText).routes[0].distance;
}


function newA(arr, x) {
    arr = new Array();
    for (var i = 0; i < x; i++) {
        arr[i] = new Array();
    }
    return arr;
}

function getType(o) {
    var _t;
    return ((_t = typeof (o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
}
function extend(destination, source) {
    for (var p in source) {
        if (getType(source[p]) == "array" || getType(source[p]) == "object") {
            destination[p] = getType(source[p]) == "array" ? [] : {};
            arguments.callee(destination[p], source[p]);
        }
        else {
            destination[p] = source[p];
        }
    }
}

function totalR(r) {
    var s = 0;
    var l = r.length;
    for (var i = 0; i < l; i++) {
        s += r[i];
    }
    return s;
}

function ACS() {
    var cn = selectedLocations.name.length;
    var an = 10;
    var p = 0.7;
    var iter = 1;
    var itermax = 10;
    var dis;
    dis = newA(dis, cn);
    var Ax;
    Ax = newA(Ax, cn);
    var Rx;
    Rx = newA(Rx, cn);
    var shortdis = 999999999;
    var shortestR = new Array();
    shortestR[0] = new Array();

    for (var i = 0; i < cn; i++) {
        for (var j = i + 1; j < cn; j++) {
            var distance = getDistance([selectedLocations.latitude[i], selectedLocations.longitude[i]], [selectedLocations.latitude[j], selectedLocations.longitude[j]]);
            dis[i][j] = distance;
            dis[j][i] = dis[i][j];
        }
        dis[i][i] = 0;
    }

    for (var i = 0; i < cn; i++) {
        for (var j = i + 1; j < cn; j++) {
            Ax[i][j] = 1 / (cn * (cn - 1));
            Ax[j][i] = Ax[i][j];
        }
        Ax[i][i] = 0;
    }

    extend(Rx, Ax);

    while (iter <= itermax) {

        var road = new Array();

        road[0] = new Array();

        road[0][0] = new Array();

        for (var k = 0; k < an; k++) {
            road[k] = new Array();
            for (var k5 = 0; k5 < cn; k5++) {
                road[k][k5] = new Array();
                for (var k3 = 0; k3 < 1; k3++) {
                    road[k][k5][k3] = 0;
                    road[k][k5][k3 + 1] = 1;
                }

            }
        }
        console.log(road);
        for (var h = 0; h < an; h++) {
            for (var h1 = 0; h1 < cn - 1; h1++) {
                road[h].shift();

            }
        }

        for (var ai = 0; ai < an; ai++) {
            extend(Ax, Rx);
            var route = new Array();
            for (var j = 0; j < cn; j++) {
                route[j] = j;
            }
            var pre = 0;
            var next = 0;




            while (totalR(route) != 0) {

                var temp = Ax[pre];
                var result = new Array();
                var s = 0;
                for (var i = 1; i < cn; i++) {
                    s += temp[i];
                }
                for (var j = 1; j < cn; j++) {
                    if (j == 1) {
                        result[j] = temp[j] / s;

                    } else {
                        result[j] = result[j - 1] + temp[j] / s;
                    }
                }



                var k = Math.random();

                var ri = 0;
                for (ri = 0; ri < cn; ri++) {
                    if (result[ri] > k) {
                        next = ri;
                        break;
                    }
                }




                road[ai].push([pre, next]);

                route[next] = 0;

                for (var i = 0; i < cn; i++) {
                    Ax[i][next] = 0;
                }
                pre = next;
            }

            next = 0;

            road[ai].shift();



        }

        var rd = new Array();
        for (var i = 0; i < an; i++) {
            rd[i] = 0;
        }

        for (var i = 0; i < an; i++) {
            for (var j = 0; j < cn - 1; j++) {

                rd[i] += dis[road[i][j][0]][road[i][j][1]];

            }
        }



        var min = rd[0];
        var temp1 = 0;
        var shorter = min;
        for (var i = 0; i < an; i++) {
            if (min > rd[i]) {
                shorter = rd[i];
                temp1 = i;
            }
        }


        if (shortdis > shorter) {
            shortdis = shorter;
            shortestR = road[temp1];
        }

        for (var i = 0; i < cn - 1; i++) {
            Rx[road[temp1][i][0]][road[temp1][i][1]] = Rx[road[temp1][i][0]][road[temp1][i][1]] * (1 - p) + p * (1 / shorter);
        }
        for (var i = 0; i < cn - 1; i++) {
            for (var j = 0; j < cn - 1; j++) {
                if (j != road[temp1][i][1]) {
                    Rx[i][j] = Rx[i][j] * (1 - p);
                }
            }
        }
        iter++;
    }
    //shortestR.shift();
    console.log(shortestR);

    var unsortedLocations = [];
    var sortedLocations = {
        name: [],
        rating: [],
        indexs: [],
        latitude: [],
        longitude: [],
        id: []
    };

    var text = "";
    var kk = 2;
    for (var i = 0; i < cn - 1; i++) {

        text += "#distance:" + dis[shortestR[i][0]][shortestR[i][1]] + "<br>" + "(" + kk + ")" + selectedLocations.name[shortestR[i][1]] + "<br>"
        unsortedLocations[kk - 1] = selectedLocations.name[shortestR[i][1]];
        kk++;
    }
    document.getElementById("short").innerHTML = "(1)" + selectedLocations.name[shortestR[0][0]] + "<br>" + text;
    unsortedLocations[0] = selectedLocations.name[shortestR[0][0]];

    $('#sortable').empty();
    for (var i = 0; i < unsortedLocations.length; i++) {
        for (var j = 0; j < selectedLocations.name.length; j++) {
            if (unsortedLocations[i] == selectedLocations.name[j]) {
                sortedLocations.name[i] = selectedLocations.name[j];
                sortedLocations.rating[i] = selectedLocations.rating[j];
                sortedLocations.indexs[i] = selectedLocations.indexs[j];
                sortedLocations.latitude[i] = selectedLocations.latitude[j];
                sortedLocations.longitude[i] = selectedLocations.longitude[j];
                sortedLocations.id[i] = selectedLocations.id[j];
            }
        }
    }

    console.log(unsortedLocations);
    console.log(sortedLocations.name);
    console.log(sortedLocations.id);
    console.log(selectedLocations.id);

    selectedLocations = {
        name: [],
        rating: [],
        indexs: [],
        latitude: [],
        longitude: [],
        id: []
    };

    console.log(unsortedLocations);
    console.log(sortedLocations.name);
    console.log(sortedLocations.id);
    console.log(selectedLocations.id);

    for (var i = 0; i < sortedLocations.name.length; i++) {
        addName(sortedLocations.id[i]);
    }

    //selectedLocations = sortedLocations;


    



    //Reload the map
    establishments();

    /*
    document.getElementById('routemap').innerHTML = "<div id='rmap' style='width: 100%; height: 100%;'></div>";
    var mymap = L.map('rmap').setView([selectedLocations.latitude[shortestR[0][0]], selectedLocations.longitude[shortestR[0][0]]], 13);


    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    var array = [];
    routewps = [];

    array.push(L.marker([selectedLocations.latitude[shortestR[0][0]], selectedLocations.longitude[shortestR[0][0]]]).bindPopup("<b>" + selectedLocations.name[shortestR[0][0]] + "</b>").addTo(mymap));
    routewps.push(L.latLng([selectedLocations.latitude[shortestR[0][0]], selectedLocations.longitude[shortestR[0][0]]]));

    for (var i = 0; i < cn - 1; i++) {
        array.push(L.marker([selectedLocations.latitude[shortestR[i][1]], selectedLocations.longitude[shortestR[i][1]]]).bindPopup("<b>" + selectedLocations.name[shortestR[i][1]] + "</b>").addTo(mymap));
        routewps.push(L.latLng([selectedLocations.latitude[shortestR[i][1]], selectedLocations.longitude[shortestR[i][1]]]));
    }




    var control = L.Routing.control({
        waypoints: routewps,
        units: 'imperial',
        router: L.Routing.mapbox('pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')
    }).addTo(mymap);
    control.hide();
    var group = new L.featureGroup(array);
    mymap.fitBounds(group.getBounds().pad(0.5));
    */
}

