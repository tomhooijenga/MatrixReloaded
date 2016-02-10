$(document).ready(function () {
    // We initialize the DataTable with the json file required for the engineer page
    var $table = $('table'),
        $card = $('#card'),
        $edit = $card.find('.engineer-edit'),
        $note = $card.find('.engineer-note'),
        $skills = $card.find('.engineer-skills');

    var table = $table.DataTable({
        "sAjaxSource": "/api/engineers/",
        "sAjaxDataProp": "results",
        "bInfo": false,
        "bPaginate": false,
        // The part below makes our table scrollable when showing more than 16 items.
        "deferRender": true,
        "scrollY": 600,
        "scrollCollapse": true,
        "scroller": true,
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
                orderable: false,
                searchable: false
            },
            {
                render: function () {
                    return '<a class="skills" data-target="#engineer-carousel" data-slide-to="1">Skills</a>';
                },
                orderable: false,
                searchable: false
            },
            {
                render: function () {
                    return '<a class="edit" data-target="#engineer-carousel" data-slide-to="2">Edit</a>';
                },
                orderable: false,
                searchable: false
            }
        ]
    });

    $table.on('click', 'tr', function (e) {
        // Ignore clicks that started on the edit links. We can't use `stopPropagation`
        // on the link handlers because that breaks the carousel navigation
        if ($(e.target).is('a') === false) {
            var data = table.row(this).data();

            // Fill the card with data and make the card read-only
            $card.form(data).form('editable', false);
        }
    });
    // Makes the search input form-control work on the DataTable
    $('.form-control').keyup(function () {
        table.search($(this).val()).draw();
    });

    $table.on('click', '.edit', function () {
        var parent = $(this).closest('tr'),
            data = table.row(parent).data();

        // Enable the form and fill with data
        $edit.form('editable', true).form(data);
    });

    $edit.on('submit', function (e) {
        e.preventDefault();

        $edit.form('submit', 'patch')
            // Success, fill the form with new data
            .done(function (data) {
                console.log(arguments);
                $edit.form(data);
            })
            // Error
            .fail(function () {
                // Error handling goes here
                // Possibly show an notification
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