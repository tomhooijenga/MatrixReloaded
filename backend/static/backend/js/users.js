$(function () {
    var $table = $('.table'),
        $card = $('.card'),
        addNew,
        table = $table.DataTable({
            ajax: {
                url: '/api/users/?expand=groups',
                dataSrc: ''
            },
            paging: false,
            info: false,
            autoWidth: false,
            columns: [
                {
                    data: 'email'
                },
                {
                    render: function (data, type, row, meta) {
                        return row.groups.map(function (group) {
                            return group.name
                        }).join(', ');
                    }
                },
                {
                    render: function () {
                        return '<a class="edit">Edit</a>'
                    },
                    searchable: false,
                    sortable: false
                }
            ]
        });

    // Makes the search input form-control work on the DataTable
    $('.search-bar').keyup(function () {
        table.search(this.value).draw();
    });

    $.getJSON('/api/groups/').done(function (data) {
        data = data.map(function (group) {
            return {
                id: group.url,
                text: group.name
            }
        });

        $("#groups").select2({
            data: data
        });
    });

    var $form = $('#card').find('form');

    $table.on('click', 'tr', function () {
        addNew = false;
        var data = table.row(this).data();

        // Add titel
        $( ".panel-heading" ).text(function( x ) {
          return "Details";
        });


        // The group was expanded for the datatable. Reduce it to work with the form
        if (data.groups[0] && typeof data.groups[0] === 'object') {
            data.groups = data.groups.map(function (group) {
                return group.url
            });
        }

        $form.data('method', 'patch')
            .form('editable', false)
            .form(data);
    }).on('click', '.edit', function (e) {
        addNew = false;
        e.stopPropagation();

        var data = table.row($(this).closest('tr')).data();

        // Add titel
        $( ".panel-heading" ).text(function( x ) {
          return "Edit user";
        });


        if (data.groups[0] && typeof data.groups[0] === 'object') {
            data.groups = data.groups.map(function (group) {
                return group.url
            });
        }

        $form.data('method', 'patch')
            .form('editable', true)
            .form(data);
    });

    $('.add-new').on('click', function () {
        addNew = true;
        $form.data('method', 'post')
            .prop('action', '/api/users/')
            .form('editable', true)
            .form('clear');

        // Add title
        $( ".panel-heading" ).text(function( x ) {
          return "Add user";
        });

    });

    $form.on('click', '.btn-danger', function () {
        if (!confirm("Are your sure you want to reset this user's password?")) {
            return;
        }

        $.post($(this).data('url') + 'reset_password/').done(function () {
            successToast("Password is reset.");
        });
    }).on('submit', function (e) {
        e.preventDefault();

        $form.form('submit').done(function (data) {

            $form.data('method', 'patch')
                .form(data);

            table.ajax.reload();

            successToast("User is saved.");

        }).fail(errorToast)
        if (addNew === true) {
            $card.hide();
        } else {
            $card.show();
        }
    })
});