// Global variable which holds the productTable
var productTable;

// This file lists the products on the page
$(document).ready(function () {
    
    // We get all the current engineers in the database to filter the results later
    jsonUrl = setEngineerUrl();
    $.getJSON(jsonUrl).done(function (json) {
        var engineers = {};
        json.forEach(function (val) {
            engineers[val.url] = val;
        });
        
        // We initialize the DataTable from a JavaScript file in static, with the required JSON file
        productTable = createProductTable();
        
        // Makes the search input search-bar work on the DataTable
        $('.search-product').keyup(function () {
            productTable.search($(this).val()).draw();
        });

        productTable.on('click', 'tr>td', function () {
            
            $(".star").css("display", "none");
            
            // We set the data of the clicked row in a variable for later use
            var tr = $(this).closest('tr');
            
            // Adds a selected class (bg-color) to the row when its selected
            if ( $(tr).hasClass('selected') ) {
                $(tr).removeClass('selected');
                currProduct = "";
            }
            else {
                productTable.$('tr.selected').removeClass('selected');
                $(tr).addClass('selected');
            };
            
            // We check if the tr is not empty.
            if (tr.has("td.dataTables_empty").length > 0) {
                $(".productdetails").css("visibility", "hidden");
            } else {
                // If the table is not empty, we show the details of the products
                // We set the global variable currProduct with the selected html <tr> element
                currProduct = tr.html();
                // After that we fill the datatable with the engineers who are trained for the selected program
                $(".productdetails").css("visibility", "visible");
                // We save the data from the table row
                var data = productTable.row(tr).data();
                var newData = [];
                product = data;
                
                // We replace the engineers that are trained for the product with an engineer object
                for (var obj in data.skills) {
                    for (var eng in engineers) {
                        if (engineers[eng].url === data.skills[obj].engineer) {
                            newData.push(engineers[data.skills[obj].engineer]);
                        } else {}              
                    }
                };
                
                // The section below is required to show the skill level on the selected product.  
                for (var key in engineer.skills) {
                    for (var val in product.skills) {
                        if (engineer.skills[key].url === product.skills[val].url) {                           
                            $('.' + product.skills[val].level).toggle();
                        }
                    }
                }
                
                // We clear the datatable and reset it with the new engineers
                $('.engineerslist').DataTable().clear().draw();
                $('.engineerslist').DataTable().rows.add(newData);
                $('.engineerslist').DataTable().columns.adjust().draw();
                
                // We compare the html elements. If they are the same a class selected will be added
                if (currEngineer !== null) {
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
            // Hide the product panel on refresh
            $(".productdetails").css("visibility", "hidden");
            // Reset the current product
            currProduct = "";
            // Destroy the table and reset it
            productTable.destroy();
            productTable = createProductTable();
        });
    });
});