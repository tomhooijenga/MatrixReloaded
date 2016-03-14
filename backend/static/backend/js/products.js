$(document).ready(function () {
    var $table = $('.table'),
        $form = $('#card').find('form');

    // We initialize the DataTable with the json file required for the products page
    var table = $table.DataTable({
        ajax: {
            url: '/api/products/?expand=category.parent',
            dataSrc: ''
        },
        "bInfo": false,
        "bPaginate": false,
        autoWidth: false,
        // We initialize the column fields with the required details (Category, Subcategory, Name) and add some HTML with the render function.
        "columns": [
            {
                data: "category.parent.name"
            },
            {
                data: "category.name"
            },
            {
                data: "name"
            },
            {
                render: function () {
                    return '<a class="edit">Edit</a>';
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

    $table.on('click', 'tr', function () {
        var data = table.row(this).data(),
            category = data.category;
        // Add titel
        $( ".panel-heading" ).text(function( x ) {
          return "Details";
        });

        // Set the category to its URL
        data.category = category.url;

        $form.form('editable', false).form(data);

        // Restore the original category object
        data.category = category;
    }).on('click', '.edit', function (e) {
        e.stopPropagation();

        var $parent = $(this).closest('tr'),
            data = table.row($parent).data(),
            category = data.category;

        // Add titel
        $( ".panel-heading" ).text(function( x ) {
          return "Edit product";
        });

        // Set the category to its URL
        data.category = category.url;

        $form.data('method', 'patch')
            .form('editable', true)
            .form(data);

        // Restore the original category object
        data.category = category;
    });

    $('.add-new').on('click', function () {
        // Empty the form
        // Make the details form editable and set it's action and method
        $form.form('clear')
            .form('editable', true)
            .prop('action', '/api/products/')
            .data('method', 'post');

        // Add titel
        $( ".panel-heading" ).text(function( x ) {
          return "Add product";
        });
    });

    $form.on('submit', function (e) {
        e.preventDefault();

        var $this = $(this);

        $this.form('submit')
            .done(function (data) {
                $this.form(data).data('method', 'patch');

                // TODO: notify user
                // Toast pop-up function
                $.toast({
                    text: "Submitted!",
                    icon: 'success',
                    showHideTransition: 'fade',
                    allowToastClose: true,
                    hideAfter: 3000,
                    stack: false,
                    position: 'bottom-right',
                    textAlign: 'center'
                });
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

    $.getJSON('/api/categories/?expand=children').done(function (data) {
        // Build map of data
        data = data.map(function (category) {
            // Only take root categories
            if (category.parent === null) {
                // Add all children
                var children = [];
                if (category.children) {
                    children = category.children.map(function (child) {
                        return {
                            id: child.url,
                            text: child.name
                        }
                    });
                }

                return {
                    id: category.url,
                    text: category.name,
                    children: children
                }
            }
        });


        $('#category').select2({
            data: data,
            // Override the default matcher function to allow searching for
            // groups as well as specific categories.
            matcher: function modelMatcher(params, data) {
                data.parentText = data.parentText || "";

                // Always return the object if there is nothing to compare
                if ($.trim(params.term) === '') {
                    return data;
                }

                // Do a recursive check for options with children
                if (data.children && data.children.length > 0) {
                    // Clone the data object if there are children
                    // This is required as we modify the object to remove any non-matches
                    var match = $.extend(true, {}, data);

                    // Check each child of the option
                    for (var c = data.children.length - 1; c >= 0; c--) {
                        var child = data.children[c];
                        child.parentText += data.parentText + " " + data.text;

                        var matches = modelMatcher(params, child);

                        // If there wasn't a match, remove the object in the array
                        if (matches == null) {
                            match.children.splice(c, 1);
                        }
                    }

                    // If any children matched, return the new object
                    if (match.children.length > 0) {
                        return match;
                    }

                    // If there were no matching children, check just the plain object
                    return modelMatcher(params, match);
                }

                // If the typed-in term matches the text of this term, or the text from any
                // parent term, then it's a match.
                var original = (data.parentText + ' ' + data.text).toUpperCase();
                var term = params.term.toUpperCase();


                // Check if the text contains the term
                if (original.indexOf(term) > -1) {
                    return data;
                }

                // If it doesn't contain the term, don't return anything
                return null;
            }
        });
    });
});