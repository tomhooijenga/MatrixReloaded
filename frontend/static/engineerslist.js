$(document).ready(function () {
    // We initialize the DataTable with the json file required for the engineer page
    var table = $('.engineerslist').DataTable({
        "sAjaxSource": "/api/engineers/?format=json",
        "sAjaxDataProp": "results",
        "bInfo" : false,
        "bPaginate": false,
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "bScrollCollapse": true,
        "scrollY": '56vh',
        // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
        "columns": [
            {data: "first_name",
            "className": 'details-control'},
            {data: "last_name"},
            {render: function () {
                    return 'FSS / ASP';
                }, orderable: false,
                searchable: false},
            {render: function () {
                    return 'Country';
                }, orderable: false,
                searchable: false}
        ]
    });
    // Makes the search input search-bar work on the DataTable
    $('.search-bar').keyup(function(){
        table.search($(this).val()).draw() ;
    }); 
});