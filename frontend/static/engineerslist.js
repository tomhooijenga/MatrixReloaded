// This file lists the engineers on the page
$(document).ready(function () {
    // We get all the current products in the database to filter the results later
    $.getJSON("/api/products/?expand=category.parent,skills").done(function (json) {
        var products = {};
        json.forEach(function (val) {
            products[val.url] = val;
        });

        // Clipboard copy
        var clipboard = new Clipboard('.fa-copy');
        clipboard.on('success', function (e) {
            // Toast pop-up function
            $.toast({
                text: "Copy Succesful!", // Text that is to be shown in the toast

                showHideTransition: 'fade', // fade, slide or plain
                allowToastClose: true, // Boolean value true or false
                hideAfter: 1500, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                position: 'bottom-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values

                bgColor: '#444444', // Background color of the toast
                textColor: '#eeeeee', // Text color of the toast
                textAlign: 'center', // Text alignment i.e. left, right or center
            });

        });
        // We will use this variable to create the JSON request
        var jsonUrl = setEngineerUrl();
        // We initialize the DataTable with the json file required for the engineer page
        var table = createEngineerTable(jsonUrl);
        // Makes the search input search-bar work on the DataTable
        $('.search-engineer').keyup(function () {
            table.search($(this).val()).draw();
        });
        
        var skills = {};
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
                engineer = data;
                $( ".engineerlevel" ).remove();
                // We replace the products with the products which the engineer is trained for
                for (var obj in data.skills) {
                    newData.push(products[data.skills[obj].product]);
                    // The section below is required to show the skill level on the selected product.
                    for (var val in product.skills) {
                        if (product.skills[val].engineer == data.skills[obj].engineer) {
                            $( ".topdetails" ).append("<div class='col-md-6 engineerlevel'>" +
                                    "<div class='col-md-4'>Level:</div>" +
                                    "<div class='col-md-8'>"+ product.skills[val].level +"</div>" +
                                    "</div>");
                        }
                    };
                }
                //for (var val in product.skills) {
                //    if (product.skills[val].engineer == )
                //    console.log(product.skills[val].engineer);
                //}
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