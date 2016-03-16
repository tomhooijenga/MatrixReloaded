// Global variable which holds the engineerTable
var engineerTable;
// Global variable which holds all products in the database
var proData;

// This file lists the engineers on the page
$(document).ready(function () {

    // We get all the current products in the database to filter the results later
    $.getJSON("/api/products/?expand=category.parent,skills&is_active=true").done(function (json) {
        // All products from the Json request
        proData = json;
        // Variable which holds all products in the database for later use in filtering
        var products = {};
        // Create products json object for comparison later
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
        engineerTable = createEngineerTable(jsonUrl);

        // Makes the search input search-bar work on the DataTable
        $('.search-engineer').keyup(function () {
            engineerTable.search($(this).val()).draw();
        });

        // Shows the engineers details in the card panel when the table row is clicked
        engineerTable.on('click', 'tr>td', function () {
            
            // Adjust the CSS of different elements for correct diplay when a row is clicked
            $(".star").css("display", "none");
            $(".note-popover").css("visibility", "hidden");
            $(".card .panel-body").css("height", "calc(100% - 45px");

            // We set the data of the clicked row in a variable for later use
            var tr = $(this).closest('tr');

            // Adds a selected class (bg-color) to the row when its selected
            if (tr.hasClass('selected')) {

                tr.removeClass('selected');
                $(".card").css("visibility", "hidden");
                currEngineer = "";
                engineer = {};
                // We clear the datatable and reset it with the new engineers
                redrawProductTable(proData);

            } else {

                engineerTable.$('tr.selected').removeClass('selected');
                tr.addClass('selected');

                // We check if the tr is not empty.
                if (tr.has("td.dataTables_empty").length > 0) {
                    $(".card").css("visibility", "hidden");
                } else {
                    // If the table is not empty, we show the details of the products
                    // We set the global variable currEngineer with the selected html <tr> element
                    currEngineer = tr.html();
                    var ProductNewData = [];
                    // After that we fill the datatable with the engineers who are trained for the selected program
                    $(".card").css("visibility", "visible");
                    // We save the data from the table row
                    var data = engineerTable.row(tr).data();
                    engineer = data;
                    // The section below is required to show the skill level on the selected product.  
                    for (var key in product.skills) {
                        for (var val in engineer.skills) {
                            if (product.skills[key].url === engineer.skills[val].url) {
                                $('.level-' + engineer.skills[val].level).toggle();
                                $(".card .panel-body").css("height", "calc(100% - 65px");
                            }
                        }
                    }

                    // Check if the note is not null
                    // If it's not null we check if the note should be displayed or not by comparing dates
                    if (engineer.note !== null) {
                        // Variables for the current date in string format
                        var fullDate = new Date();
                        // Convert month to 2 digits
                        var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
                        // Convert the current date to string format for comparison later
                        var currentDate = fullDate.getFullYear() + "-" + twoDigitMonth + "-" + fullDate.getDate();
                        // We convert the three dates to a integer for comparison in an if statement
                        var currDate = Date.parse(currentDate);
                        var fromDate = Date.parse(engineer.note.visible_from);
                        // We set a tilldate variable for in our if statements later. If an end date is set it should do more checks
                        var tillDate = null;
                        if (engineer.note.visible_until !== null) {
                            tillDate = Date.parse(engineer.note.visible_until);
                        }

                        // We compare the dates to see if the note button should be displayed
                        if (currDate >= fromDate) {
                            if (tillDate === null || currDate <= tillDate) {
                                // We show the popover icon
                                $(".note-popover").css("visibility", "visible");
                                // Options for the popover note
                                var options = {
                                    //container: 'body',
                                    content: function () {
                                        var until;
                                        if (engineer.note.visible_until !== null) {
                                            until = engineer.note.visible_until;
                                        } else {
                                            until = "no end date set";
                                        }
                                        return '<div class="row">'
                                                + '<div class="col-xs-1"><i class="fa fa-fw fa-hourglass-start"></i></div><div class="col-xs-8">' + engineer.note.visible_from + '</div>'
                                                + '</div><div class="row">'
                                                + '<div class="col-xs-1"><i class="fa fa-fw fa-hourglass-end"></i></div><div class="col-xs-8">' + until + '</div>'
                                                + '</div>'
                                                + '<hr>'
                                                + '<div class="row"><div class="col-xs-12">' + engineer.note.content + '</div></div>'
                                                ;

                                    },
                                    html: true,
                                    placement: 'left'
                                };
                                // We set the popover
                                $(".note-popover").popover(options);
                            }
                        }
                    }

                    // Fill the card with data and make the card read-only
                    $('.card').form(data).form('editable', false).carousel(2);

                    // We replace the products with the products which the engineer is trained for
                    for (var obj in data.skills) {
                        ProductNewData.push(products[data.skills[obj].product]);
                    }

                    // We clear the datatable and reset it with the new engineers
                    redrawProductTable(ProductNewData);

                }
            }
            // We compare the html elements. If they are the same a class selected will be added
            addSelectedItemProduct();
        });

        // The event where the close button in the engineer panel is clicked
        $(".close-engineerpanel").on("click", function () {
            // Adjust the CSS of different elements for correct diplay when the close button is clicked
            $(".star").css("display", "none");
            $(".note-popover").css("visibility", "hidden");
            $(".card .panel-body").css("height", "calc(100% - 45px");
            // Works the same as the toggle
            engineerTable.$('tr.selected').removeClass('selected');
            $(".card").css("visibility", "hidden");
            currEngineer = "";
            engineer = {};
            // We clear the datatable and reset it with the new engineers
            redrawProductTable(proData);

            // We compare the html elements. If they are the same a class selected will be added
            addSelectedItemProduct();
        });

        // The table refreshes when the refresh icon is clicked
        $(".refreshbutton").click(function () {
            // Hide the engineer panel on refresh
            $(".card").css("visibility", "hidden");
            $(".note-popover").css("visibility", "hidden");
            // We clear the engineer search field
            // After that we redraw the table with no input
            $('.search-engineer').val("");
            engineerTable.search("").draw();
            // Reset the current engineer
            currEngineer = "";
            engineer = {};
            // Resets the engineer table with all engineers
            redrawEngineerTable(engData);
        });

    });
});