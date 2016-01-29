$(document).ready(function () {
    var table = $('table').dataTable({
        "sAjaxSource": "/api/engineers/?format=json",
        "sAjaxDataProp": "results",
        "bFilter": false,
        "columns": [
            {data: "first_name",
            "className": 'details-control'},
            {data: "last_name"},
            {render: function () {
                    return '<a id="note">Note</a>';
                }, orderable: false},
            {render: function () {
                    return '<a id="skills">Skills</a>';
                }, orderable: false},
            {render: function () {
                    return '<a id="edit">Edit</a>';
                }, orderable: false}
        ]
    });
    $("table").on("click", "#note", function(){
        $("div.panel.panel-default.details").show();
    });
    $("table").on("click", "#skills", function(){
        $("div.panel.panel-default.details").show();
    });
    $("table").on("click", "#edit", function(){
        $("div.panel.panel-default.details").show();
    });
});