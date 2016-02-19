// This file lists the products on the page
$(document).ready(function () {
    // We initialize the DataTable with the json file required for the products page
    var table = $('.productslist').DataTable({
        ajax: {
            url: "/api/products/?expand=category.parent&format=json",
            dataSrc: ''
        },
        "bInfo" : false,
        "bPaginate": false,
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "bScrollCollapse": true,
        "scrollY": '64vh',
        // We initialize the column fields with the required details (Category, Subcategory, Name) and add some HTML with the render function.
        "columns": [
            {data: "category.parent.short_name"},
            {data: "category.short_name"},
            {data: "name"}
        ]
    }); 
    // Makes the search input search-bar work on the DataTable
    $('.search-bar').keyup(function(){
        table.search($(this).val()).draw() ;
    }); 
});