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

$(document).ready(function () {
    var cookie = getCookie("countries");
    // We will use this variable to create the JSON request
    var jsonUrl = "";
    // Checks if cookie is empty
    // If it's empty, it requests the normal JSON url.
    if (cookie == "") {
        jsonUrl = "/api/engineers/?expand=country";
    } else {
        // If the cookie is not empty it filters the results.
        jsonUrl = "/api/engineers/?expand=country&countries=" + cookie;
    };
    // We initialize the DataTable with the json file required for the engineer page
    var table = $('table').DataTable({
        "sAjaxSource": jsonUrl,
        "sAjaxDataProp": "results",
        "bInfo": false,
        "bPaginate": false,
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "fixedHeader": true,
        "bScrollCollapse": true,
        "scrollY": '64vh',
        // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
        "columns": [
            {data: "first_name",
                "className": 'details-control'},
            {data: "last_name"},
            {render: function () {
                    return '<a class="note">Note</a>';
                }, orderable: false,
                searchable: false},
            {render: function () {
                    return '<a class="skills">Skills</a>';
                }, orderable: false,
                searchable: false},
            {render: function () {
                    return '<a class="edit">Edit</a>';
                }, orderable: false,
                searchable: false}
        ]
    });
    // Makes the search input form-control work on the DataTable
    $('.search-bar').keyup(function () {
        table.search($(this).val()).draw();
    });
    // On click functions for the HTML elements in the DataTable
    // On click they should open the details panel on the right
    $("table").on("click", ".note", function () {
        $("div.panel.panel-default.details").show();
    });
    $("table").on("click", ".skills", function () {
        $("div.panel.panel-default.details").show();
    });
    $("table").on("click", ".edit", function () {
        $("div.panel.panel-default.details").show();
    });
});