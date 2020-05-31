﻿$(document).ready(function () {
    //if (sessionStorage.aboutMeAlert) {
    //    alert("About Me updated successfully.");
    //    sessionStorage.aboutMeAlert = false;
    //}
    var t = setInterval(checkAboutMe, 100);
});

function getImageLink(eid, uid) {
    var source = '/Profiles/GetImageLink?id=' + uid;

    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: source,
        success: function (response) {
            document.getElementById(eid).innerHTML = `<img src="` + response + `" style="width: 30px; height: 30px; display: block; border: 1px solid black;" />`;

        },
        error: function () {

        },
        async: false
    });
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function checkAboutMe()
{
    if (document.getElementById("AboutMe") != null) {
        if (document.getElementById("AboutMe").value == decodeHtml(origText)) {
            document.getElementById("AboutMe").style.backgroundColor = "#cfffcc";
            toggleOff("AboutMeButton");

        }
        else {
            document.getElementById("AboutMe").style.backgroundColor = "#ffcccc";
            toggleOn("AboutMeButton");
        }
    }
}

function toggleOn(e) {
    var x = document.getElementById(e);
    x.style.visibility = "visible";
}

function toggleOff(e) {
    var x = document.getElementById(e);
    x.style.visibility = "hidden";
}

function requestFollow(id) {
    if (confirm("Request to follow this user?")) {
        var source = '/Profiles/RequestFollow?id=' + id;

        $.ajax({
            url: source,
            error: function (response) {
                location.reload(true);

            },
            dataType: "json",
            contentType: 'application/json',
        });

    }
}

function confirmFollow(id) {
    if (confirm("Confirm this follow request?")) {
        var source = '/Profiles/ConfirmFollow?id=' + id;

        $.ajax({
            url: source,
            error: function (response) {
                location.reload(true);

            },
            dataType: "json",
            contentType: 'application/json',
        });

    }
}

function denyFollow(id) {
    if (confirm("Deny this follow request?")) {
        var source = '/Profiles/DenyFollow?id=' + id;

        $.ajax({
            url: source,
            error: function (response) {
                location.reload(true);

            },
            dataType: "json",
            contentType: 'application/json',
        });

    }
}

function unfollow(id) {
    if (confirm("Unfollow this user?")) {
        var source = '/Profiles/Unfollow?id=' + id;

        $.ajax({
            url: source,
            error: function (response) {
                location.reload(true);

            },
            dataType: "json",
            contentType: 'application/json',
        });

    }
}


function updateAboutMe(id) {
    if (confirm("Update About Me?")) {
        var text = document.getElementById("AboutMe").value;
        var source = '/Profiles/UpdateAboutMe?text=' + text;
        
        $.ajax({
            url: source,
            error: function (response) {
                //sessionStorage.aboutMeAlert = true;
                location.reload(true);
                
            },
            dataType: "json",
            contentType: 'application/json',
        });
    }
}

function submitReply(id) {
    if (confirm("Post comment?")) {
        var text = document.getElementById("ReplyContent").value;
        var source = '/Profiles/SubmitReply?text=' + text + "&id=" + id;

        $.ajax({
            url: source,
            error: function (response) {
                //sessionStorage.aboutMeAlert = true;
                location.reload(true);

            },
            dataType: "json",
            contentType: 'application/json',
        });
    }
}

function deleteReply(id, un, ts) {
    if (confirm("Delete comment?")) {
        var source = '/Profiles/DeleteReply?id=' + id + "&un=" + un + "&ts=" + ts;

        $.ajax({
            url: source,
            error: function (response) {
                //sessionStorage.aboutMeAlert = true;
                location.reload(true);

            },
            dataType: "json",
            contentType: 'application/json',
        });
    }
}

function togglePrivacy(id, privacyFlag) {

    var opFlag = "Public";
    if (privacyFlag == "Public")
        opFlag = "Private";

    if (confirm("Are you sure you want to make your profile " + opFlag + "?")) {
        var source = '/Profiles/TogglePrivacy?id=' + id;

        $.ajax({
            url: source,
            error: function (response) {
                location.reload(true);

            },
            dataType: "json",
            contentType: 'application/json',
        });

    }
}