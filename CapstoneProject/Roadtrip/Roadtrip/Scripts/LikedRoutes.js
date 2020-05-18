


$(document).ready(function () {


    $('#LikedRoutes').empty();
    $('#LikedRoutes').append('<ul id="like">Liked Routes: </ul>');

    for (var i = 0; i < LikedList.length; i++) {
        $('#like').append(`
        <li class="list-group-item list-group-item-dark" id="${LikedList[i].UserName}">Route Created By:  ${LikedList[i].UserName} <br>
       Route ID:  ${LikedList[i].RouteID} <br>
        <input name="${LikedList[i].RouteID}" type="button" value="Show Route" onclick="direct(this.name)">
 <input name="${LikedList[i].RouteID}" type="button" value="Unlike" onclick="Unlike(this.name)">

        </li>


`);
    }

});

function direct(data) {





    document.location.assign("/SavedRoutes/Index?ID=" + data);




   
    //scrollTo(document.getElementById(data), topPos - 5, 500);

}
function tell() {
    location.reload();
   
    console.log("Unliked Worked"); 
}

function Unlike(data) {
    console.log(data);
    var source = '/SavedRoutes/Unlike?ID=' + data;
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: tell,
        error: errorOnAjax

    });
    alert("Unliked Succeeded"); 
}
function errorOnAjax() {
    console.log("error"); 
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
