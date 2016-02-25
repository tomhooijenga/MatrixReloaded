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

        // Revoke the old url.
        URL.revokeObjectURL($img.prop('src'));

        $img.prop('src', url);

        // The dimensions of an image are sometimes incorrectly reported as 0x0. If we add
        // a tiny timeout, we can retrieve the correct size
        window.setTimeout(function () {
            // Determine the type of image (landscape or portrait)
            var isHorizontal = $img.width() > $img.height();

            $img.removeClass('image-vertical image-horizontal')
                .addClass(isHorizontal ? 'image-horizontal' : 'image-vertical');
        }, 50);
    });

    $('.add-new').on('click', function () {
        $('#card').show();
    });

    $('.table').on('click', 'tr, .edit', function () {
        $('#card').show();
    })
});