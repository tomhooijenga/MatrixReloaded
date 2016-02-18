// We can get cookies with this function
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}
// This file lists the engineers on the page
$(document).ready(function () {
    var cookie = getCookie("countries");
    // We will use this variable to create the JSON request
    var jsonUrl = "";
    // Checks if cookie is empty
    // If it's empty, it requests the normal JSON url
    if (cookie == "") {
        jsonUrl = "/api/engineers/?expand=country";
    } else {
        // If the cookie is not empty it filters the results.
        jsonUrl = "/api/engineers/?expand=country&countries=" + cookie;
    };
    // We initialize the DataTable with the json file required for the engineer page
    var table = $('.engineerslist').DataTable({
        "sAjaxSource": jsonUrl,
        "sAjaxDataProp": "results",
        "bInfo": false,
        "bPaginate": false,
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "bScrollCollapse": true,
        "scrollY": '45vh',
        // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
        "columns": [
            {data: "first_name",
                "className": 'details-control'},
            {data: "last_name"},
            {render: function () {
                    return 'FSS / ASP';
                }, orderable: false,
                searchable: false},
            {data: "country.code"}
        ]
    });
    // Makes the search input search-bar work on the DataTable
    $('.search-bar').keyup(function () {
        table.search($(this).val()).draw();
    });
});