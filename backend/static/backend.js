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
            // Determine the type of image (landscape or portrait)
            var width = $img.prop('naturalWidth'),
                height = $img.prop('naturalHeight'),
                type;

            $img.removeClass('image-vertical image-horizontal image-square');

            // Only add a direction if the image is not square
            if (width === height) {
                type = 'image-square';
            } else {
                type = width > height ? 'image-horizontal' : 'image-vertical';
            }

            $img.addClass(type);

            // Revoke the url, so the file object can be cleaned up when the image's source changes
            URL.revokeObjectURL(url);
        }, 50);
    });
});