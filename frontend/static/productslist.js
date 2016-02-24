// This file lists the products on the page
$(document).ready(function () {
    $.getJSON("/api/languages/").done(function (json) {
        var languages = {};
        json.forEach(function (val) {
            languages[val.url] = val;
        });
        
        jsonUrl = setEngineerUrl();
        
        // We initialize the DataTable from a JavaScript file in static, with the required JSON file
        var table = createProductTable();
        
        // Makes the search input search-bar work on the DataTable
        $('.search-product').keyup(function () {
            table.search($(this).val()).draw();
        });

        table.on('click', 'tr', function () {
            // We set the data of the clicked row in a variable for later use
            var data = table.row(this).data();
            var tr = $(this).closest('tr');
            //for (var val in data) {
            //    console.log(data[val]);
            //}
            // We check if the tr is not empty.
            if (tr.has("td.dataTables_empty").length > 0) {
                $(".productdetails").css("visibility", "hidden");
            } else {
                // If the table is not empty, we show the details of the products
                // After that we fill the datatable with the engineers who are trained for the selected program
                $(".productdetails").css("visibility", "visible");
                var data = table.row(this).data();
                var newData = [];
                for (var obj in data.skills) {
                    if (typeof data.skills[obj].engineer.languages[0] == "object") { newData.push(data.skills[obj].engineer); } 
                    else {
                        data.skills[obj].engineer.languages = data.skills[obj].engineer.languages.map(function(url) {
                            return languages[url];
                        });
                    newData.push(data.skills[obj].engineer);
                    };
                };
                $('.engineerslist').DataTable().clear().draw();
                $('.engineerslist').DataTable().rows.add(newData);
                $('.engineerslist').DataTable().columns.adjust().draw();
                // Fill the card with data and make the card read-only
                $('.productdetails').form(data).form('editable', false).carousel(2);
            }
        });

        $('.search-bar').click(function() {
           $('.productslist').DataTable().destroy();
           table = createProductTable(jsonUrl);
        });
    });
});