$(function () {
    var $table = $('.table'),
        $parent = $('#card').find('.parent-form'),
        $child = $('#card').find('.child-form'),
        table = $table.DataTable({
            paging: false,
            info: false,
            autoWidth: false,
            columns: [
                {
                    data: 'name'
                },
                {
                    render: function () {
                        return '<a class="edit">Edit</a>'
                    }
                }
            ]
        });

    // Load the initial data of the table
    reload();

    $table.on('click', 'tr', function () {
        var row = table.row(this),
            data = row.data();

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
        }
        else {
            // Open this row and append the child rows
            row.child(format(data)).show();
        }

    }).on('click', '.edit', function (e) {
        e.stopPropagation();

        var parent = $(this).closest('tr'),
            data = table.row(parent).data();

        $parent.show().form(data);
        $child.hide();
    }).on('click', '.child-edit', function (e) {
        e.stopPropagation();

        // Fetching the data is a little different because this is a child row
        var parent = $(this).closest('tr'),
            data = parent.data('category.parent');

        $parent.hide();
        $child.show().form(data);
    });

    // Makes the search input form-control work on the DataTable
    $('.search-bar').keyup(function () {
        table.search($(this).val()).draw();
    });

    /**
     * Reload the DataTable's data
     */
    function reload() {
        $.getJSON('/api/categories/?expand=children').done(function (data) {
            data = data.filter(function (category) {
                return category.children.length > 0;
            });

            // Set the data in the table
            table.clear();
            table.rows.add(data).draw();
        });
    }

    /**
     *
     * @param data
     * @returns {Element}
     */
    function format(data) {
        var table = $('<table class="table"><tbody></tbody></table>'),
            tbody = table.find('tbody');

        data.children.forEach(function (child) {
            var td1 = $('<td></td>', {
                text: child.name
            });

            var td2 = $('<td></td>')
                .append($('<a></a>', {
                    class: 'child-edit',
                    text: 'Edit'
                }));

            var tr = $('<tr></tr>')
                .data({
                    category: child,
                    'category.parent': data
                })
                .append(td1, td2);

            tbody.append(tr);
        });

        return table;
    }
});