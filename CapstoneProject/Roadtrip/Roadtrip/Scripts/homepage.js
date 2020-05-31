var slideIndex = 0;
showSlides();

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}
//Homepage slideshow
function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(showSlides, 5000); // Change image every 2 seconds
}


//appends 3 of the users soonest events to the homepage
function events(data) {
    console.log(data);
    $('#upcomingEvents').empty();
    $('#myevents').append(`<h1>My Upcoming Events</h1>`)
        for (var i = 0; i < 3; i++) {
            var date = data[i].Start;
            var nowDate = parseMSDate(date);
            console.log(nowDate);
            $('#upcomingEvents').append(`<div style="background-color:lavenderblush; outline-style: solid;" class="col-lg-4"> 
                <div>Event Name: ${data[i].EventName}<div/> 
                <div>Start: ${nowDate}<div/> 
                <div/>`)
    }
}

//retrieves events to post to homepage
function getEvents(id) {
    var source = '/Home/LoadEvents?id=' + id;
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: source,
        success: events,
        error: errorOnAjax
    });
};

function errorOnAjax(data) {
    console.log('Error on AJAX return');
    console.log(data);
}

//for parsing json date format and return normal date format
function parseMSDate(s) {
    var dregex = /\/Date\((\d*)\)\//;
    return dregex.test(s) ? new Date(parseInt(dregex.exec(s)[1])) : s;
}