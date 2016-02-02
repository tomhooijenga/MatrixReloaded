$(document).ready(function () {
    // We initialize the DataTable with the json file required for the engineer page
    var table = $('table').DataTable({
        "sAjaxSource": "/api/engineers/?format=json",
        "sAjaxDataProp": "results",
        "bInfo" : false,
        "bPaginate": false,
        "bFilter": false,
        // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
        "columns": [
            {data: "first_name",
            "className": 'details-control'},
            {data: "last_name"},
            {render: function () {
                    return '<a class="note">Note</a>';
                }, orderable: false},
            {render: function () {
                    return '<a class="skills">Skills</a>';
                }, orderable: false},
            {render: function () {
                    return '<a class="edit">Edit</a>';
                }, orderable: false}
        ]
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