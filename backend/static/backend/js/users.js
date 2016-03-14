$(function () {
    var $table = $('.table'),
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
        var data = table.row(this).data();

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
        e.stopPropagation();

        var data = table.row($(this).closest('tr')).data();

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
        $form.data('method', 'post')
            .prop('action', '/api/users/')
            .form('editable', true)
            .form('clear');
    });

    $form.on('click', '.btn-danger', function () {
        if (!confirm("Are your sure you want to reset this user's password?")) {
            return;
        }

        $.post($(this).data('url') + 'reset_password/').done(function () {
            $.toast({
                text: "Password is reset!",
                icon: 'success',
                hideAfter: 3000,
                stack: false,
                position: 'bottom-right',
                textAlign: 'center'
            });
        });
    }).on('submit', function (e) {
        e.preventDefault();

        $form.form('submit').done(function (data) {
            $.toast({
                text: "Submitted!",
                icon: 'success',
                hideAfter: 3000,
                stack: false,
                position: 'bottom-right',
                textAlign: 'center'
            });

            table.ajax.reload();

            $form.data('method', 'patch')
                .form(data);

        }).fail(function (response) {
            var errors = response.responseJSON,
                errortext = [];

            for (var error in errors) {
                errortext.push(error + ': ' + errors[error].join('; '));
            }

            $.toast({
                heading: "Error!",
                text: errortext.join('<br />'),
                icon: "error",
                hideAfter: 3000,
                stack: false,
                position: 'bottom-right',
                textAlign: 'center'
            });
        })
    })
});