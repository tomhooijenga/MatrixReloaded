// Global variable which holds the productTable
var productTable;

// Global variable which holds all the engineer in the database (if country filter is active, the engineers are filtered)
var engData;

// This file lists the products on the page
$(document).ready(function () {

    // We get all the current engineers in the database to filter the results later
    jsonUrl = setEngineerUrl();
    $.getJSON(jsonUrl).done(function (json) {
        // All engineers from the Json request
        engData = json;
        // Variable which holds all the current engineers in the database for later use
        var engineers = {};
        // Create engineers json object for comparison later
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
            $(".card .panel-body").css("height", "calc(100% - 45px");

            // We set the data of the clicked row in a variable for later use
            var tr = $(this).closest('tr');

            // Adds a selected class (bg-color) to the row when its selected
            if (tr.hasClass('selected')) {

                tr.removeClass('selected');
                $(".productdetails").css("visibility", "hidden");
                currProduct = "";
                product = {};
                // We clear the datatable and reset it with all the engineers
                redrawEngineerTable(engData);

            } else {

                productTable.$('tr.selected').removeClass('selected');
                tr.addClass('selected');

                // We check if the tr is not empty.
                if (tr.has("td.dataTables_empty").length > 0) {
                    $(".productdetails").css("visibility", "hidden");
                } else {
                    // If the table is not empty, we show the details of the products
                    // We set the global variable currProduct with the selected html <tr> element
                    currProduct = tr.html();
                    var EngineerNewData = [];
                    // After that we fill the datatable with the engineers who are trained for the selected program
                    $(".productdetails").css("visibility", "visible");
                    // We save the data from the table row
                    var data = productTable.row(tr).data();
                    product = data;

                    // Fill the card with data and make the card read-only
                    $('.productdetails').form(data).form('editable', false).carousel(2);

                    // The section below is required to show the skill level on the selected product.  
                    for (var key in engineer.skills) {
                        for (var val in product.skills) {
                            if (engineer.skills[key].url === product.skills[val].url) {
                                $('.level-' + product.skills[val].level).toggle();
                                $(".card .panel-body").css("height", "calc(100% - 65px");
                            }
                        }
                    }

                    // We replace the engineers that are trained for the product with an engineer object
                    for (var obj in data.skills) {
                        for (var eng in engineers) {
                            if (engineers[eng].url === data.skills[obj].engineer) {
                                EngineerNewData.push(engineers[data.skills[obj].engineer]);
                            } else {
                            }
                        }
                    }
                    ;

                    // We clear the datatable and reset it with the new engineers
                    redrawEngineerTable(EngineerNewData);

                }
            }
            // We compare the html elements. If they are the same a class selected will be added
            addSelectedItemEngineer();
        });
        
        // The event when the close button in the product panel is clicked
        $(".close-productpanel").on("click", function () {
            $(".star").css("display", "none");
            $(".card .panel-body").css("height", "calc(100% - 45px");
            // Works the same as the toggle
            productTable.$('tr.selected').removeClass('selected');
            $(".productdetails").css("visibility", "hidden");
            currProduct = "";
            product = {};
            // We clear the datatable and reset it with all the engineers
            redrawEngineerTable(engData);
            
            // We compare the html elements. If they are the same a class selected will be added
            addSelectedItemEngineer();
        });

        // The table refreshes when the refresh icon is clicked
        $(".refreshbutton").click(function () {
            // Hide the product panel on refresh
            $(".productdetails").css("visibility", "hidden");
            // We clear the product search field
            // After that we redraw the table with no input
            $('.search-product').val("");
            productTable.search("").draw();
            // Reset the current product
            currProduct = "";
            product = {};
            // We clear the product table and reset it with the new engineers
            redrawProductTable(proData);
        });
    });
});