var product = {}, engineer = {};

// Function for returning the jsonUrl with the country filter including.
function setEngineerUrl () {
    // We initialize the DataTable with the json file required for the products page
    var cookie = getCookie("countries");
    // We will use this variable to create the JSON request
    var jsonUrl = "";
    // Checks if cookie is empty
    // If it's empty, it requests the normal JSON url
    if (cookie == "") {
        return jsonUrl = "/api/engineers/?expand=skills,country,countries,languages";
    } else {
        // If the cookie is not empty it filters the results.
        return jsonUrl = "/api/engineers/?expand=skills,country,countries,languages&countries=" + cookie;
    };
}

// Function for creating the engineer dataTable.
function createEngineerTable(jsonUrl) {
    var table = $('.engineerslist').DataTable({
        ajax: {
            url: jsonUrl,
            dataSrc: ''
        },
        "bInfo": false,
        "bPaginate": false,
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "bScrollCollapse": true,
        "scrollY": '45vh',
        // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
        "columns": [
            {data: "first_name",
                "className": 'details-control'},
            {data: "last_name"},
            {render: function () {
                    return 'FSS / ASP';
                }, orderable: false,
                searchable: false},
            {data: "country.code"}
        ]
    }); return table;
}

// Function for creating the products dataTable.
function createProductTable () {
    var table = $('.productslist').DataTable({
        ajax: {
            url: "/api/products/?expand=category.parent,skills",
            dataSrc: ''
        },
        "bInfo": false,
        "bPaginate": false,
        "scrollY": '30vh',
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "bScrollCollapse": true,
        // We initialize the column fields with the required details (Category, Subcategory, Name) and add some HTML with the render function.
        "columns": [
            {data: "category.parent.short_name"},
            {data: "category.short_name"},
            {data: "name"}
        ]
    }); return table;   
}