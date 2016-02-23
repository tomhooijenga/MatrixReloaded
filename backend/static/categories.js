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

    $table.on('click', 'tr:not(.child)', function () {
        var row = table.row(this),
            data = row.data();


    }).on('click', '.edit', function (e) {
        e.stopPropagation();

        var parent = $(this).closest('tr'),
            data = table.row(parent).data();

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
});