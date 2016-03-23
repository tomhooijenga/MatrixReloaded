// These vars will hold the current selected engineer or product as an object
var product = {}, engineer = {};
// This will hold the current product and engineer als a html tag
// We use the HTML tag for adding a selected class to the table row later
var currProduct = "", currEngineer = "";

// Function for returning the jsonUrl with the country filter including.
function setEngineerUrl() {
    // We initialize the DataTable with the json file required for the products page
    var cookie = getCookie("countries");
    // We will use this variable to create the JSON request
    var jsonUrl = "";
    // Checks if cookie is empty
    // If it's empty, it requests the normal JSON url
    if (cookie === "") {
        return jsonUrl = "/api/engineers/?is_active=true&expand=skills,note,country,countries,languages";
    } else {
        // If the cookie is not empty it filters the results.
        return jsonUrl = "/api/engineers/?is_active=true&expand=skills,note,country,countries,languages&countries=" + cookie;
    }
}

// Function for creating the engineer dataTable.
function createEngineerTable(jsonUrl) {
    // We create a table variable so whe can reload and reinitialize the table later
    var table = $('.engineerslist').DataTable({
        // Load the data with the jsonUrl variable declared above
        ajax: {
            url: jsonUrl,
            dataSrc: ''
        },
        // Settings for the DataTable
        autoWidth: false,
        info: false,
        paging: false,
        // The part below makes our table scrollable when showing more than 16 items.
        // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
        "columns": [
            {data: "first_name"},
            {data: "last_name"},
            {
                data: "type",
                // A check which prints out the engineer type
                render: function (data) {
                    if (data === 0) {
                        return "FSE";
                    } else {
                        return "ASP";
                    }
                },
                orderable: false,
                searchable: false
            },
            {data: "country.code"}
        ]
    });
    // We return the table
    return table;
}

// Function for creating the products dataTable.
function createProductTable() {
    // We create a table variable so whe can reload and reinitialize the table later
    var table = $('.productslist').DataTable({
        // Load the data of the DataTable with a json request from the API
        ajax: {
            "url": "/api/products/?expand=category.parent,skills&is_active=true",
            "dataSrc": ''
        },
        // Settings for the DataTable
        autoWidth: false,
        info: false,
        paging: false,
        // We initialize the column fields with the required details (Category, Subcategory, Name) and add some HTML with the render function.
        "columns": [
            {data: "category.parent.short_name"},
            {data: "category.short_name"},
            {data: "name"},
            {
                data: "is_crosslab",
                // If the product is crosslab it will get a check next to its name in the table
                render: function (data) {
                    if (data === true) {
                        return '<i class="fa fa-check crosslab"></i>';
                    } else {
                        return "";
                    }
                },
                //orderable: false,
                searchable: false
            }
        ]
    });
    return table;
}

// A function which redraws the engineer table with new (filtered) data
function redrawEngineerTable(data) {
    // We clear the table -> add new data to the table -> reload the table.
    $('.engineerslist').DataTable().clear().draw();
    $('.engineerslist').DataTable().rows.add(data);
    $('.engineerslist').DataTable().columns.adjust().draw();
}

// A function which redraws the product table with new (filtered) data
function redrawProductTable(data) {
    // We clear the table -> add new data to the table -> reload the table.
    $('.productslist').DataTable().clear().draw();
    $('.productslist').DataTable().rows.add(data);
    $('.productslist').DataTable().columns.adjust().draw();
}

// Function for adding a selected class to an engineer list item
function addSelectedItemEngineer() {
    // We compare the html elements. If they are the same a class selected will be added
    if (currEngineer !== "") {
        $('.engineerslist tr').each(function () {
            if ($(this).html() === currEngineer) {
                $(this).addClass('selected');
            }
        });
    }
}

// Function for adding a selected class to a product list item
function addSelectedItemProduct() {
    // We compare the html elements. If they are the same a class selected will be added
    if (currProduct !== "") {
        $('.productslist tr').each(function () {
            if ($(this).html() === currProduct) {
                $(this).addClass('selected');
            }
        });
    }
}