$(function () {

    // Append the csrf-token to each request. Otherwise, the request will be rejected.
    var csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    $.ajaxSetup({
        headers: {
            'X-CSRFToken': csrfToken
        }
    });
});