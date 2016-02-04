$(document).ready(function () {
    // We initialize the DataTable with the json file required for the engineer page
    var table = $('table').DataTable({
        "sAjaxSource": "/api/engineers/?format=json",
        "sAjaxDataProp": "results",
        "bInfo" : false,
        "bPaginate": false,
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "scrollY": 600,
        "scrollCollapse": true,
        "scroller": true,
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
    $('.form-control').keyup(function(){
        table.search($(this).val()).draw() ;
    }); 
    // On click functions for the HTML elements in the DataTable
    // On click they should open the details panel on the right
    $("table").on("click", ".note", function(){
        $("div.panel.panel-default.details").show();
    });
    $("table").on("click", ".skills", function(){
        $("div.panel.panel-default.details").show();
    });
    $("table").on("click", ".edit", function(){
        $("div.panel.panel-default.details").show();
    });
});