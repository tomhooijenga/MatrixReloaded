$(document).ready(function () {
    // We initialize the DataTable with the json file required for the engineer page
    var $table = $('table'),
        $card = $('#card');

    var table = $table.DataTable({
        "sAjaxSource": "/api/engineers/?is_active=both",
        "sAjaxDataProp": "results",
        "bInfo": false,
        "bPaginate": false,
        "bFilter": false,
        // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
        "columns": [
            {
                data: "first_name"
            },
            {
                data: "last_name"
            },
            {
                render: function () {
                    return '<a class="note" data-target="#engineer-carousel" data-slide-to="0">Note</a>';
                },
                orderable: false
            },
            {
                render: function () {
                    return '<a class="skills" data-target="#engineer-carousel" data-slide-to="1">Skills</a>';
                },
                orderable: false
            },
            {
                render: function () {
                    return '<a class="edit" data-target="#engineer-carousel" data-slide-to="2">Edit</a>';
                },
                orderable: false
            }
        ]
    });

    $table.on('click', 'tr', function (e) {
        // Ignore clicks that started on the edit links. We can't use `stopPropagation`
        // on the link handlers because that breaks the carousel navigation
        if ($(e.target).is('a') === false) {
            var data = table.row(this).data();

            // Fill the card with data and make the card read-only
            $card.card(data).card('editable', false);
        }
    });

    $table.on('click', '.edit', function (e) {
        var parent = $(this).closest('tr'),
            data = table.row(parent).data();

        // Enable the card and fill with data
        $card.card('editable', true).card(data);
    });

    $card.find('form').on('submit', function (e) {
        e.preventDefault();

        $card.card('submit', this, 'patch').then(function () {

        });
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
});