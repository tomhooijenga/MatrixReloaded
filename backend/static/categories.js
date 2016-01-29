$(document).ready(function() {
    var table = $('table').dataTable({
        "sAjaxSource": "/api/categories/?format=json",
        "sAjaxDataProp": "results",
        "bFilter": false,
        "columns": [
                    { data: "name",
                    "className": 'details-control'},
                    { render: function () {
                              return '<a id="add-remove">Add / remove subcategory</button>';  
                              }, orderable: false}
                    ]
    });
    $("table").on("click", "#add-remove", function(){
        $("div.panel.panel-default.details").show();
    });
});