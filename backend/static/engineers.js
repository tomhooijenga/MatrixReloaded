$(document).ready(function () {
    var $table = $('table'),
        $carousel = $('#engineer-carousel'),
        $add = $('.add-new'),
        $edit = $carousel.find('.engineer-edit'),
        $note = $carousel.find('.engineer-note'),
        $skills = $carousel.find('.engineer-skills');

    // We initialize the DataTable with the json file required for the engineer page
    var table = $table.DataTable({
        "sAjaxSource": "/api/engineers/?expand=note,skills",
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

    // Makes the search input form-control work on the DataTable
    $('.form-control').keyup(function () {
        table.search($(this).val()).draw();
    });


    $table.on('click', 'tr', function (e) {
        // Ignore clicks that started on the edit links. We can't use `stopPropagation`
        // on the link handlers because that breaks the carousel navigation
        if ($(e.target).is('a') === false) {
            var data = table.row(this).data();

            // Fill the card with data and make the card read-only
            $carousel.form(data).form('editable', false).carousel(2);
        }
    });

    $table.on('click', '.note', function () {
        var parent = $(this).closest('tr'),
            data = table.row(parent).data();

        // Override the form's method
        // Enable the form and fill with data
        $note.data('method', 'patch')
            .form('editable', true)
            .form(data.note);
    }).on('click', '.skills', function () {

    }).on('click', '.edit', function () {
        var parent = $(this).closest('tr'),
            data = table.row(parent).data();

        // Override the form's method
        // Enable the form and fill with data
        $edit.data('method', 'patch')
            .form('editable', true)
            .form(data);
    });

    //$edit.on('submit', function (e) {
    //    e.preventDefault();
    //
    //    $edit.form('submit')
    //        // Success, fill the form with new data
    //        .done(function (data) {
    //            $edit.form(data);
    //        })
    //        // Error
    //        .fail(function () {
    //            // Error handling goes here
    //            // Possibly show an notification
    //        });
    //});

    $carousel.find('form').on('submit', function (e) {
        e.preventDefault();

        var $this = $(this);

        $this.form('submit')
            .done(function (data) {
                $this.form(data);

                // Reload the table with new data
                table.ajax.reload();
            })
            // Error
            .fail(function (data) {
                // Error handling goes here
                // Possibly show an notification
            });
    });


    $add.on('click', function () {
        // Empty the form
        // Make the details form editable and set it's method
        $edit.form('clear')
            .form('editable', true)
            .form({
                url: '/api/engineers/'
            })
            .data('method', 'post');

        // Slide to the engineer details
        // Find all the inputs and trigger a change event. This is done
        $carousel.carousel(2);
    });

    // Fill the country and countries selector
    $.getJSON('/api/countries/').done(function (data) {

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
    $.getJSON('/api/languages/').done(function (data) {
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