// This file lists the engineers on the page
$(document).ready(function () {
    // We get all the current products in the database to filter the results later
    $.getJSON("/api/products/?expand=category.parent,skills").done(function (json) {
        var products = {};
        json.forEach(function (val) {
            products[val.url] = val;
        });

        new Clipboard('.fa-copy');
        // We will use this variable to create the JSON request
        var jsonUrl = setEngineerUrl();
        // We initialize the DataTable with the json file required for the engineer page
        var table = createEngineerTable(jsonUrl);
        // Makes the search input search-bar work on the DataTable
        $('.search-engineer').keyup(function () {
            table.search($(this).val()).draw();
        });

        // Shows the engineers details in the card panel when the table row is clicked
        table.on('click', 'tr', function () {
            // We set the data of the clicked row in a variable for later use
            var data = table.row(this).data();
            var tr = $(this).closest('tr');
            // We check if the tr is not empty.
            if (tr.has("td.dataTables_empty").length > 0) {
                $(".card").css("visibility", "hidden");
            } else {
                // If the table is not empty, we show the details of the products
                // After that we fill the datatable with the engineers who are trained for the selected program
                $(".card").css("visibility", "visible");
                var data = table.row(this).data();
                var newData = [];
                // We replace the products with the products which the engineer is trained for
                for (var obj in data.skills) {
                    newData.push(products[data.skills[obj].product]);
                };
                // We clear the datatable and reset it with the new engineers
                $('.productslist').DataTable().clear().draw();
                $('.productslist').DataTable().rows.add(newData);
                $('.productslist').DataTable().columns.adjust().draw();
                // Fill the card with data and make the card read-only
                $('.card').form(data).form('editable', false).carousel(2);
            }
        });
    });
});