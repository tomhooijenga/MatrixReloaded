// This file lists the engineers on the page
$(document).ready(function () {
     $.getJSON("/api/products/?expand=skills,category.parent").done(function (json) {
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
                $(".card").css("visibility", "visible");
                var data = table.row(this).data();
                var newData = [];
                for (var obj in data.skills) {
                    if (typeof data.skills[obj].product == "object") { newData.push(data.skills[obj].product); } 
                    else {
                        data.skills[obj].product = products[data.skills[obj].product];
                        newData.push(data.skills[obj].product);
                    };
                }
                //console.log(newData);
                //$('.productslist').DataTable().clear().draw();
                //$('.productslist').DataTable().rows.add(newData);
                //$('.productslist').DataTable().columns.adjust().draw();
                // Fill the card with data and make the card read-only
                $('.card').form(data).form('editable', false).carousel(2);
            } console.log(newData);
        });

        $('.search-bar').click(function () {
            $('.engineerslist').DataTable().destroy();
            table = createEngineerTable(jsonUrl);
        });
    });
});