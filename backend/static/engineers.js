$(document).ready(function () {

    var engineer, // Holds the current engineer
        products = {}; // Map of product urls => products

    var $table = $('table'),
        $carousel = $('#engineer-carousel'),
        $add = $('.add-new'),
        $edit = $carousel.find('.engineer-edit'),
        $note = $carousel.find('.engineer-note'),
        $skills = $carousel.find('.engineer-skills');

    // We initialize the DataTable with the json file required for the engineer page
    var table = $table.DataTable({
        ajax: {
            url: '/api/engineers/?expand=note',
            dataSrc: ''
        },
        "bInfo": false,
        "bPaginate": false,
        autoWidth: false,
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
        // find closest parent
        // grab this row's data
        // find the skills list
        // find the skills template
        // initialize an empty collection
        var parent = $(this).closest('tr'),
            data = table.row(parent).data(),
            $list = $skills.find('.list-group'),
            $select = $('#skills-select'),
            $template = $($("#skill-template").html()),
            $html = $();

        // set the current engineer
        engineer = data;

        // Set the form editable
        $skills.form('editable', true);

        // Enable all skills, so they can be filtered later
        $select.find('option').prop('disabled', false);

        // Empty the skills list of previous skills
        $list.empty();

        // Fetch the engineer's skills and expand skills, skill.product, skill.product.category
        // and skill.product.category.parent
        $.getJSON(data.url + '?expand=skills.product').done(function (engineer) {
            engineer.skills.forEach(function (skill) {
                var $tpl = $template.clone();

                $tpl.data('skill', skill);

                $tpl.find('.skill-name').text(skill.product.name);

                $tpl.find('input').val(skill.level);

                $html = $html.add($tpl);

                // Disable this skill in the select
                $select.find('[value="' + skill.product.url + '"]').prop('disabled', true);
            });

            // Refresh the select
            $select.select2();

            // Add the skills to the list
            $list.html($html);
        });
    }).on('click', '.edit', function () {
        var parent = $(this).closest('tr'),
            data = table.row(parent).data();

        // Override the form's method
        // Enable the form and fill with data
        $edit.data('method', 'patch')
            .form('editable', true)
            .form(data);
    });

    $skills.find('.list-group')
        .on('click', '.btn-danger', function () {
            if (!confirm('Are you sure you want to delete this skill?')) {
                return;
            }

            // Find parent list item
            // Grab attached data
            var $item = $(this).closest('.list-group-item'),
                skill = $item.data('skill');

            // Send a delete request to the server
            $.ajax({
                url: skill.url,
                method: 'delete'
            }).done(function () {
                // This skill can be removed
                $item.remove();

                // Also enable in the skill select
                $('#skills-select').find('[value="' + skill.product.url + '"]').prop('disabled', false);

                $('#skills-select').select2();
            });
        })
        .on('change', 'input[type="number"]', function () {
            var $this = $(this),
                $item = $this.closest('.list-group-item'),
                skill = $item.data('skill'),
                request = $item.data('skill.request');

            // We've already got a request going, so cancel it.
            if (request) {
                request.abort()
            }

            request = $.ajax({
                url: skill.url,
                data: {
                    level: $this.val()
                },
                method: 'patch'
            }).done(function () {
                // TODO: notify user
                alert("saved");
            });

            // Save the request
            $item.data('skill.request', request);
        });

    $carousel.find('form').on('submit', function (e) {
        e.preventDefault();

        var $this = $(this);

        $this.form('submit')
            .done(function (data) {
                $this.form(data).data('method', 'patch');

                // TODO: notify user

                // Reload the table with new data
                table.ajax.reload();
            })
            // Error
            .fail(function (data) {
                // Error handling goes here
                // Possibly show an notification
                // TODO: notify user
            });
    });


    $add.on('click', function () {
        // Empty the form
        // Make the details form editable and set it's action and method
        $edit.form('clear')
            .form('editable', true)
            .prop('action', '/api/engineers/')
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

    $.getJSON('/api/products/?expand=category.parent').done(function (data) {
        data = data.map(function (product) {
            // Build the products map
            products[product.url] = product;

            return {
                id: product.url,
                text: [
                    product.category.parent.short_name,
                    product.category.short_name,
                    product.name
                ].join(' ')
            }
        });

        $('#skills-select')
            .select2({
                data: data
            })
            .on('change', function (e) {
                var $this = $(this),
                    val = $this.val();

                if (!val) {
                    return;
                }

                var $template = $($('#skill-template').html()),
                    $tpl = $template.clone(),
                    skill = {
                        engineer: engineer.url,
                        product: products[val[0]],
                        level: 1
                    };

                $tpl.data('skill', skill);
                $tpl.find('.skill-name').text(skill.product.name);
                $tpl.find('input').val(skill.level);

                $skills.find('.list-group').append($tpl);

                $this.find('[value="' + val[0] + '"]').prop('disabled', true);

                $this.val(null).trigger('change').select2();

                $.ajax({
                    url: '/api/skills/',
                    method: 'post',
                    data: {
                        engineer: engineer.url,
                        product: skill.product.url,
                        level: 1
                    }
                }).done(function (data) {
                    // TODO: notify user

                    alert("saved");
                })
            });
    });
});