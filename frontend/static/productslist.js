// This file lists the products on the page
$(document).ready(function () {
    // We initialize the DataTable with the json file required for the products page
    var table = $('.productslist').DataTable({
        ajax: {
            url: "/api/products/?expand=category.parent,skills.engineer.country",
            dataSrc: ''
        },
        "bInfo" : false,
        "bPaginate": false,
        "scrollY": '30vh',
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "bScrollCollapse": true,
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
    
    table.on('click', 'tr', function (e) {
        // We check if the tr is not empty.
        if ($("td").hasClass("dataTables_empty")) {
            $(".productdetails").css("visibility", "hidden");
        } else {
            $(".productdetails").css("visibility", "visible");
            var data = table.row(this).data();
            var newData = [];
            for (var obj in data.skills) {
                newData.push(data.skills[obj].engineer);
            }
            $('.engineerslist').DataTable().clear().draw();
            $('.engineerslist').DataTable().rows.add(newData);
            $('.engineerslist').DataTable().columns.adjust().draw();
             // Fill the card with data and make the card read-only
            $('.productdetails').form(data).form('editable', false).carousel(2);
        }
    });
});