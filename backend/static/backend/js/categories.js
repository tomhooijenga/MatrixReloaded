/**
 *
 * @param data
 * @returns {string}
 */
function listSubcategories(data) {
    var table = ['<table class="table">'];

    data.children.forEach(function (child) {
        table.push('<tr><td>', child.name, '</td></tr>');
    });

    table.push('</table>');

    return table.join('');
}

$(function () {
    var $table = $('.table'),
        $parent = $("#parent-form"),
        $child = $("#child-form"),
        $children = $('#child-categories'),
        $template = $($('#category-template').html()),
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

    $('.add-new').on('click', function () {
        $parent.form('clear')
            .form('editable', true)
            .prop('action', '/api/categories/')
            .data('method', 'post');

        $child.hide();
        $children.hide();
    });

    var row = null;

    $table.on('click', 'tr', function () {
        row = this;

        var data = table.row(this).data();

        $parent.data('method', 'patch')
            .form(data)
            .form('editable', false);

        children(data.children);

        $child.hide().form('editable', false);

        $children.form('editable', false);
    }).on('click', '.edit', function (e) {
        e.stopPropagation();

        row = $(this).closest('tr');

        var data = table.row(row).data();

        $parent.data('method', 'patch')
            .form(data)
            .form('editable', true);

        children(data.children);

        $child.show()
            .form('editable', true)
            .find('input[name="parent"]')
            .val(data.url);

        $children.form('editable', true);
    });

    $parent.on('submit', function (e) {
        e.preventDefault();

        $parent.form('submit')
            .done(function () {
                $parent.data('method', 'patch');
                $child.show();

                reload();

                successToast('Category was saved');
            })
            .fail(errorToast);
    });

    $child.on('submit', function (e) {
        e.preventDefault();

        var parent = table.row(row).data();

        $child.form('submit')
            .done(function (data) {
                successToast('Category was saved');

                $child.form('clear');

                parent.children.push(data);
                children(parent.children);

                // row is no longer valid after reload
                row = null;
                reload()
            })
            .fail(errorToast);
    });

    $children.on('click', '.btn-danger', function () {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        var $child = $(this).closest('form');

        $child.data('method', 'delete')
            .form('submit')
            .done(function () {
                $child.remove();

                reload();

                successToast('Category is deleted');
            });
    }).on('submit', 'form', function (e) {
        e.preventDefault();

        $(this).data('method', 'patch')
            .form('submit')
            .done(function (data) {

                reload();

                successToast('Category is saved');
            })
            .fail(errorToast);
    });

    // Makes the search input form-control work on the DataTable
    $('.search-bar').keyup(function () {
        table.search($(this).val()).draw();
    });

    // Add event listener for opening and closing subcategory listing
    $('table tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
        } else {
            // Open this row
            row.child(listSubcategories(row.data())).show();
            $(row.child()).addClass('child');
        }
    });

    /**
     * Append the child categories to the parent category form
     * @param children A list of categories that belong to a parent
     */
    function children(children) {
        var html = [];

        $children.empty();

        children.forEach(function (child) {
            var template = $template.clone(),
                products = child.products.length,
                text = products + ' product';

            if (products == 0 || products > 1) {
                text += 's';
            }

            template.form(child)
                .data('category', child);

            template.find('.btn-danger').prop('disabled', child.products.length > 0);
            template.find('.products').text(text);

            html.push(template);
        });

        $children.append.apply($children, html);
    }

    /**
     * Reload the DataTable's data
     */
    function reload() {
        return $.getJSON('/api/categories/?expand=children').done(function (data) {
            data = data.filter(function (category) {
                return category.parent === null;
            });

            // Set the data in the table
            table.clear();
            table.rows.add(data).draw();
        });
    }
});