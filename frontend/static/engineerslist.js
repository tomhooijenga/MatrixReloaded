// This file lists the engineers on the page
$(document).ready(function () {
    // Clipboard copy
    var clipboard = new Clipboard('.fa-copy');
    clipboard.on('success', function(e) {
        // Toast pop-up function
        $.toast({
        text: "Copy Succesful!", // Text that is to be shown in the toast

        showHideTransition: 'fade', // fade, slide or plain
        allowToastClose: true, // Boolean value true or false
        hideAfter: 1500, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
        stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
        position: 'bottom-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values

        bgColor: '#444444',  // Background color of the toast
        textColor: '#eeeeee',  // Text color of the toast
        textAlign: 'center',  // Text alignment i.e. left, right or center
        });

    });

    var cookie = getCookie("countries");
    // We will use this variable to create the JSON request
    var jsonUrl = "";
    // Checks if cookie is empty
    // If it's empty, it requests the normal JSON url
    if (cookie == "") {
        jsonUrl = "/api/engineers/?expand=country,countries,languages";
    } else {
        // If the cookie is not empty it filters the results.
        jsonUrl = "/api/engineers/?expand=country,countries,languages&countries=" + cookie;
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
    
    // Shows the engineers details in the card panel when the table row is clicked
    table.on('click', 'tr', function (e) {
        if ($("td").hasClass("dataTables_empty")) {
            $(".card").css("visibility", "hidden");
        } else {
            $(".card").css("visibility", "visible");
            var data = table.row(this).data();
             // Fill the card with data and make the card read-only
            $('.card').form(data).form('editable', false).carousel(2);
        }
    });
});