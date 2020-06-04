//Adds comments under Event/Details/ 
function eventComments(data) {
    $('#comments').empty();
    console.log(data);
    if (data[0] == null) {
        var link = '/Comments/Create/' + data.EstablishmentID;
        $('#createComment').attr("href", link)
    }
    else {
        var link = '/Comments/Create/' + data[0].EstablishmentID;
        console.log(link);
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
        $('#createComment').attr("href", link) //create link for adding comment to this event
    }
}

function EventComments(id) {
    var source = '/Events/LoadCommentsEvents?id=' + id;
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: source,
        success: eventComments,
        error: errorOnAjax
    });
}

function errorOnAjax() {
    console.log('you messed up');
}