$(function () {

    // Append the csrf-token to each request. Otherwise, the request will be rejected.
    var csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    $.ajaxSetup({
        headers: {
            'X-CSRFToken': csrfToken
        }
    });

    $('.image-input input[type="file"]').on('change', function () {
        // Create an url of the file object, then set that url to the image's src
        var url = this.files[0] ? URL.createObjectURL(this.files[0]) : '',
            $img = $('.image-input img');

        $img.prop('src', url);

        // The dimensions of an image are sometimes incorrectly reported as 0x0. If we add
        // a tiny timeout, we can retrieve the correct size
        window.setTimeout(function () {
            var width = $img.prop('naturalWidth'),
                height = $img.prop('naturalHeight'),
                type;

            $img.removeClass('image-vertical image-horizontal image-square');

            if (width === height) {
                type = 'image-square';
            } else {
                type = width > height ? 'image-horizontal' : 'image-vertical';
            }

            $img.addClass(type);

            // Revoke the url directly, so the file it links to can be cleaned
            //  up whenever the image's source changes
            URL.revokeObjectURL(url);
        }, 50);
    });

    $('.add-new').on('click', function () {
        $('#card').show();
    });

    $('.table').on('click', 'tr, .edit', function () {
        $('#card').show();
    });

    $(':input[title]').tooltip();
});