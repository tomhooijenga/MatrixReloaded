$(function () {
    var $table = $('.table'),
        table = $table.DataTable({
            ajax: {
                url: '/api/users/?expand=group',
                dataSrc: ''
            },
            paging: false,
            info: false,
            autoWidth: false,
            columns: [
                {
                    data: 'email'
                }
            ]
        });
});