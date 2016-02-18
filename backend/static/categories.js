/* This is the function for showing subcategories */
function listSubcategories (d) {
    $(this).addClass("test123");
    // `d` is the original data object for the row
    // create an empty string which will contain the categories in a table
    var mytable = '';
    mytable += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; style="background-color:red><thead><tr><td><b>Subcategories:</b></td></tr></thead>';
    // if d.children[0] = null there are no subcategories
    if (d.children[0] != null)
    {
        for (var key in d.children) {
            mytable += '<tr><td>' + d.children[key].name + '</td></tr>';
        };
    } else {
        mytable += '<tr><td>No subcategories</td></tr>';
    };
    mytable += '</table>';
    // return the subcategories to show below the original category
    return mytable;
};

$(document).ready(function() {
    // We create an array to store the categories from the json request
    var categories = [];
    function getArray(){
        return $.getJSON("/api/categories/?expand=children");
    }
    getArray().done(function(json) {
        // Only show the categories by filtering the items.
        // Only items with parent = null should be shown.
        $.each(json, function(key, val) {
            if (val.parent === null) {
                categories.push(val);
            }
        });
        // We initialize the DataTable with the json file required for the categories page
        var table = $('.table').DataTable({
            "aaData": categories,
            "bInfo" : false,
            "bPaginate": false,
            // The part below makes our table scrollable when showing more than 16 items.
            "deferRender": true,
            "fixedHeader": true,
            "bScrollCollapse": true,
            "scrollY": '64vh',
            // We initialize the column fields with the required details (Name) and add some HTML with the render function.
            "columns": [
                        { "data": "name",
                        "className": 'details-control'},
                        { render: function () {
                                  return '<a class="add-remove">Add / remove subcategory</a>';  
                                  }, orderable: false,
                                    searchable: false},
                        ]
        });
        // Makes the search input form-control work on the DataTable
        $('.search-bar').keyup(function(){
            table.search($(this).val()).draw() ;
        }); 
        // Add event listener for opening and closing subcategory listing
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
                row.child( listSubcategories(row.data()) ).show();
                tr.addClass('shown');
            }
        } );   
        // On click functions for the HTML elements in the DataTable
        // On click they should open the details panel on the right
        $("table").on("click", ".add-remove", function(){
            $("div.panel.panel-default.details").show();
        });
    });
}); 