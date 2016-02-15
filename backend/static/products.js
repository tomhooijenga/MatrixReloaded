$(document).ready(function () {
    // We initialize the DataTable with the json file required for the products page
    var table = $('table').DataTable({
        "sAjaxSource": "/api/products/?expand=category.parent&format=json",
        "sAjaxDataProp": "results",
        "bInfo" : false,
        "bPaginate": false,
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "fixedHeader": true,
        "bScrollCollapse": true,
        "scrollY": '64vh',
        // We initialize the column fields with the required details (Category, Subcategory, Name) and add some HTML with the render function.
        "columns": [
            {data: "category.parent.short_name"},
            {data: "category.short_name"},
            {data: "name",
            "className": 'details-control'},
            {render: function () {
                    return '<a class="edit">Edit</a>';
                }, orderable: false,
                searchable: false}
        ]
    }); 
    // Makes the search input form-control work on the DataTable
    $('.search-bar').keyup(function(){
        table.search($(this).val()).draw() ;
    }); 
    // On click functions for the HTML elements in the DataTable
    // On click they should open the details panel on the right
    $("table").on("click", ".edit", function(){
        $("div.panel.panel-default.details").show();
    });
});