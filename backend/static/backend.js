$(function () {

    // Append the csrf-token to each request. Otherwise, the request will be rejected.
    var csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    $.ajaxSetup({
        headers: {
            'X-CSRFToken': csrfToken
        }
    });

    $('.image-input input[type="file"]').on('change', function () {
        var url = this.files[0] ? URL.createObjectURL(this.files[0]) : '';

        $('.image-input img').prop('src', url);
    });
});