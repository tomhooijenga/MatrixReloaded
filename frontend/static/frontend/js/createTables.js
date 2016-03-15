// These vars will hold the current selected engineer or product as an object
var product = {}, engineer = {};
// This will hold the current product and engineer als a html tag
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
        return jsonUrl = "/api/engineers/?expand=skills,note,country,countries,languages";
    } else {
        // If the cookie is not empty it filters the results.
        return jsonUrl = "/api/engineers/?expand=skills,note,country,countries,languages&countries=" + cookie;
    }
    ;
}

// Function for creating the engineer dataTable.
function createEngineerTable(jsonUrl) {
    var table = $('.engineerslist').DataTable({
        ajax: {
            url: jsonUrl,
            dataSrc: ''
        },
        autoWidth: false,
        info: false,
        paging: false,
        // The part below makes our table scrollable when showing more than 16 items.
        // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
        "columns": [
            {data: "first_name"},
            {data: "last_name"},
            {
                render: function () {
                    return 'FSS / ASP';
                },
                orderable: false,
                searchable: false},
            {data: "country.code"}
        ]
    });
    return table;
}

// Function for creating the products dataTable.
function createProductTable() {
    var table = $('.productslist').DataTable({
        ajax: {
            "url": "/api/products/?expand=category.parent,skills&is_active=true",
            "dataSrc": ''
        },
        autoWidth: false,
        info: false,
        paging: false,
        // We initialize the column fields with the required details (Category, Subcategory, Name) and add some HTML with the render function.
        "columns": [
            {data: "category.parent.short_name"},
            {data: "category.short_name"},
            {data: "name"}
        ]
    });
    return table;
}

// A function which redraws the engineer table with new (filtered) data
function redrawEngineerTable(data) {
    $('.engineerslist').DataTable().clear().draw();
    $('.engineerslist').DataTable().rows.add(data);
    $('.engineerslist').DataTable().columns.adjust().draw();
}

// A function which redraws the product table with new (filtered) data
function redrawProductTable(data) {
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