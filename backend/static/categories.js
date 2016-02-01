/* Formatting function for row details - modify as you need */
function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Example 1</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Example 2</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Example 3</td>'+
        '</tr>'+
    '</table>';
}

$(document).ready(function() {
    // We initialize the DataTable with the json file required for the categories page
    var table = $('table').DataTable({
        "sAjaxSource": "/api/categories/?format=json",
        "sAjaxDataProp": "results",
        "bInfo" : false,
        "bPaginate": false,
        "bFilter": false,
        // We initialize the column fields with the required details (Name) and add some HTML with the render function.
        "columns": [
                    { data: "name",
                    "className": 'details-control'},
                    { render: function () {
                              return '<a class="add-remove">Add / remove subcategory</a>';  
                              }, orderable: false}
                    ]
    });
    
    // Add event listener for opening and closing details
    $('table tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );   
    // On click functions for the HTML elements in the DataTable
    // On click they should open the details panel on the right
    $("table").on("click", ".add-remove", function(){
        $("div.panel.panel-default.details").show();
    });
});