$("document").ready(function () {
    var source = '/Profiles/GetImageLink';

    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: source,
        success: function (response) {
            document.getElementById("navbarProfilePic").innerHTML = `<img src="` + response + `" class="profilepic-navbar" />`;
        },
        error: function () {
            alert("Failed");
        },
        async: false
    });
});