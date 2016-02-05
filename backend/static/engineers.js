$(document).ready(function () {
    // We initialize the DataTable with the json file required for the engineer page
    var table = $('table').DataTable({
        "sAjaxSource": "/api/engineers/?format=json",
        "sAjaxDataProp": "results",
        "bInfo": false,
        "bPaginate": false,
        "bFilter": false,
        // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
        "columns": [
            {
                data: "first_name",
                "className": 'details-control'
            },
            {data: "last_name"},
            {
                render: function () {
                    return '<a class="note">Note</a>';
                }, orderable: false
            },
            {
                render: function () {
                    return '<a class="skills">Skills</a>';
                }, orderable: false
            },
            {
                render: function () {
                    return '<a class="edit">Edit</a>';
                }, orderable: false
            }
        ]
    });
    // On click functions for the HTML elements in the DataTable
    // On click they should open the details panel on the right
    $("table").on("click", ".note", function () {
        $("div.panel.panel-default.details").show();
    });
    $("table").on("click", ".skills", function () {
        $("div.panel.panel-default.details").show();
    });
    $("table").on("click", ".edit", function () {
        $("div.panel.panel-default.details").show();
    });

    // Fill the country and countries selector
    $.getJSON('/api/countries/').then(function (data) {

        data = data.map(function (country) {
            return {
                id: country.url,
                text: country.name
            }
        });

        $('#countries, #country').select2({
            data: data
        });
    });

    // Fill the languages selector
    $.getJSON('/api/languages/').then(function (data) {
        data = data.map(function (lang) {
            return {
                id: lang.url,
                text: lang.name
            }
        });

        $('#languages').select2({
            data: data
        });
    });

    // this part is just for testing
    var $card = $('#card');

    $.getJSON('/api/engineers/1/').then(function (data) {
        $card.card(data);
    });
});