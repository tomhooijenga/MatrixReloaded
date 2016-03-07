// This file lists the products on the page
$(document).ready(function () {
    // We get all the current engineers in the database to filter the results later
    jsonUrl = setEngineerUrl();
    $.getJSON(jsonUrl).done(function (json) {
        var engineers = {};
        var table;
        json.forEach(function (val) {
            engineers[val.url] = val;
        });
        
        // We initialize the DataTable from a JavaScript file in static, with the required JSON file
        table = createProductTable();
        
        // Makes the search input search-bar work on the DataTable
        $('.search-product').keyup(function () {
            table.search($(this).val()).draw();
        });

        table.on('click', 'tr', function () {
            // We set the global variable currProduct with the selected html <tr> element
            currProduct = $(this).html();
            // Adds a color to the row when its selected
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            };
            // We set the data of the clicked row in a variable for later use
            var data = table.row(this).data();
            var tr = $(this).closest('tr');
            // We check if the tr is not empty.
            if (tr.has("td.dataTables_empty").length > 0) {
                $(".productdetails").css("visibility", "hidden");
            } else {
                // If the table is not empty, we show the details of the products
                // After that we fill the datatable with the engineers who are trained for the selected program
                $(".productdetails").css("visibility", "visible");
                var data = table.row(this).data();
                var newData = [];
                product = data;
                $( ".engineerlevel" ).remove();
                // We replace the engineers that are trained for the product with an engineer object
                for (var obj in data.skills) {
                    newData.push(engineers[data.skills[obj].engineer]);
                };
                // The section below is required to show the skill level on the selected product.  
                for (var key in engineer.skills) {
                    for (var val in product.skills) {
                        if (engineer.skills[key].url === product.skills[val].url) {
                            $( ".topdetails" ).append("<div class='col-md-6 engineerlevel'>" +
                                    "<div class='col-md-6'>Level: </div>" +
                                    "<div class='col-md-6'>"+ product.skills[val].level +"</div>" +
                                    "</div>");
                        }
                    }
                }
                // We clear the datatable and reset it with the new engineers
                $('.engineerslist').DataTable().clear().draw();
                $('.engineerslist').DataTable().rows.add(newData);
                $('.engineerslist').DataTable().columns.adjust().draw();
                // We compare the html elements. If they are the same a class selected will be added
                if (currEngineer != null) {
                    $('.engineerslist tr').each(function(){
                        if ($(this).html() === currEngineer) {
                            $(this).addClass('selected');
                        }
                    });
                };
                // Fill the card with data and make the card read-only
                $('.productdetails').form(data).form('editable', false).carousel(2);
            }
        });
        
        // The table refreshes when the refresh icon is clicked
        $(".refreshbutton").click(function(){
            table.destroy();
            table = createProductTable();
        });
    });
});