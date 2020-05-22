$("document").ready(function () {

    $('input[type=file]').on("change", function () {

        var $files = $(this).get(0).files;

        const file = this.files[0];
        const fileType = file['type'];
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (!validImageTypes.includes(fileType)) {
            alert("File is not a valid image type. Image must be a png, jpg or gif.");
            return false;
        }

        if ($files.length) {

            var filesizemb = $files[0].size / 1000000;

            // Reject big files
            if ($files[0].size > $(this).data("max-size") * 1000000) {
                alert("File must be under 10MB. Your file is " + filesizemb.toFixed(2) + "MB.");
                return false;
            }

            // Replace ctrlq with your own API key
            var apiUrl = 'https://api.imgur.com/3/image';

            var formData = new FormData();
            formData.append("image", $files[0]);

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": apiUrl,
                "method": "POST",
                "datatype": "json",
                "headers": {
                    "Authorization": "Client-ID " + apiKey
                },
                "processData": false,
                "contentType": false,
                "data": formData,
                beforeSend: function (xhr) {
                    console.log("Uploading");
                },
                success: function (res) {
                    console.log(res);
                    saveImageLink(res.data.link)
                },
                error: function () {
                    alert("Failed");
                }
            }
            $.ajax(settings).done(function (response) {
                console.log("Done");
            });
        }
    });
});

function saveImageLink(link) {
    var source = '/Profiles/SaveImageLink?ID=' + link;

    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: source,
        success: function (response) {
            alert('Profile picture uploaded successfully.')
            location.reload(true);
        },
        async: false
    });
}