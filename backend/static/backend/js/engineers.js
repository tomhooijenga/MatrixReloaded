$(document).ready(function () {
    var engineer, // Holds the current engineer
        products = {}; // Map of product urls => products

    var $table = $('table'),
        $carousel = $('#engineer-carousel'),
        $add = $('.add-new'),
        $edit = $carousel.find('.engineer-edit'),
        $note = $carousel.find('.engineer-note'),
        $skills = $carousel.find('.engineer-skills'),
        $card = $('.card'),
        addNew;

    // This cookie holds the current selected countries
    var cookie = getCookie("countries");
    // We will use this variable to create the JSON request
    var jsonUrl = "";
    // Checks if cookie is empty
    // If it's empty, it requests the normal JSON url.
    if (cookie == "") {
        jsonUrl = "/api/engineers/?expand=note";
    } else {
        // If the cookie is not empty it filters the results.
        jsonUrl = "/api/engineers/?expand=note&countries=" + cookie;
    }

    // We initialize the DataTable with the json file required for the engineer page
    var table = $table.DataTable({
        ajax: {
            url: jsonUrl,
            dataSrc: '',
            contentType: "application/json; charset=utf-8"
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

    // Makes the search input form-control work on the DataTable
    $('.search-bar').keyup(function () {
        table.search($(this).val()).draw();
    });

    $table.on('click', 'tr', function (e) {
        addNew = false;
        // Ignore clicks that started on the edit links. We can't use `stopPropagation`
        // on the link handlers because that breaks the carousel navigation
        if ($(e.target).is('a') === false) {
            var data = table.row(this).data();

            // Fill the card with data and make the card read-only
            $carousel.form(data).form('editable', false).carousel(2);
            // Add titel
            $( ".panel-heading" ).text(function( x ) {
              return "Details";
            });
        }
    });

    $table.on('click', '.note', function () {
        addNew = false;
        var parent = $(this).closest('tr'),
            data = table.row(parent).data();
            $( ".panel-heading" ).text(function( x ) {
              return "Edit note";
            });
        // Override the form's method
        // Enable the form and fill with data
        $note.form('editable', true)
            .form(data)
            .form(data.note);
    }).on('click', '.skills', function () {
        addNew = false;
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
        // Add titel
            $( ".panel-heading" ).text(function( x ) {
              return "Add/Remove skills";
            });

        // set the current engineer
        engineer = data;

        // Set the form editable
        $skills.form('editable', true);
        $skills.form(data);

        // Enable all skills, so they can be filtered later
        $select.find('option').prop('disabled', false);

        // Empty the skills list of previous skills
        $list.empty();

        // Fetch the engineer's skills and expand skills, skill.product, skill.product.category
        // and skill.product.category.parent
        var query = $.param({
            engineer: data.url,
            expand: 'product'
        });
        $.getJSON('/api/skills/?' + query).done(function (skills) {
            skills.forEach(function (skill) {
                var $tpl = $template.clone();

                $tpl.data('skill', skill);

                $tpl.find('.skill-name').text(skill.product.name);
                $tpl.find('.skill-level').val(skill.level);
                $tpl.find('.skill-fss').prop('checked', skill.is_fss);

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
        addNew = false;
        var parent = $(this).closest('tr'),
            data = table.row(parent).data();
        // Add titel
            $( ".panel-heading" ).text(function( x ) {
              return "Edit engineer";
            });
        // Override the form's method
        // Enable the form and fill with data
        $edit.data('method', 'patch')
            .form('editable', true)
            .form(data);
    });

    $skills.find('.list-group')
        .on('click', '.close', function () {
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

                successToast("Skill is deleted.");

                // Also enable in the skill select
                $('#skills-select').find('[value="' + skill.product.url + '"]').prop('disabled', false);

                $('#skills-select').select2();
            });
        })
        .on('click', '.submit', function () {
            var $this = $(this),
                $item = $this.closest('.list-group-item'),
                skill = $item.data('skill'),
                request = $item.data('skill.request');
            
            // We set the value of the skill-fss on true it's checked, and false if it's not checked
            if($('.skill-fss').is(':checked')) {
                $('.skill-fss').val(true);
            } else { $('.skill-fss').val(false); }
            
            // We've already got a request going, so cancel it.
            if (request) {
                request.abort()
            }

            request = $.ajax({
                url: skill.url,
                data: {
                    is_fss: $item.find('.skill-fss').val(),
                    level: $item.find('.skill-level').val()
                },
                method: 'patch'
            }).done(function () {
                successToast("Skill is saved");
            });

            // Save the request
            $item.data('skill.request', request);
        });

    $carousel.find('form').on('submit', function (e) {
        e.preventDefault();

        var $this = $(this);
        
        // Temporary fix for the is-active checkbox. When checked the value is true and when it's not checked the value will be false
        if ($('.is-active').is(':checked')) {
            $('.is-active-hidden').disabled = true;
        }

        $this.form('submit')
            .done(function (data) {
                $this.form(data).data('method', 'patch');
                // Toast pop-up function

                successToast("Data is saved.");

                // Reload the table with new data
                table.ajax.reload();
            })
            // Error
            .fail(errorToast);
            if (addNew === true) {
                $card.hide();
            } else {
                $card.show();
            }
    });


    $add.on('click', function () {
        addNew = true;
        // Empty the form
        // Add titel
        $( ".panel-heading" ).text(function( x ) {
              return "Add engineer";
        });
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
                        level: 1,
                        is_fss: false
                    };

                $tpl.data('skill', skill);
                $tpl.find('.skill-name').text(skill.product.name);
                $tpl.find('.skill-level').val(skill.level);
                $tpl.find('.skill-fss').prop('checked', skill.is_fss);

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
                }).done(function () {
                    successToast("Skill is saved");
                }).fail(errorToast)
            });
    });
});