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
        ajax: {
            url: jsonUrl,
            dataSrc: ''
        },
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

    table.on('click', 'tr', function (e) {
        var data = table.row(this).data();
         // Fill the card with data and make the card read-only
        $('#engineer-carousel').form(data).form('editable', false).carousel(2);
        //}
    });
});