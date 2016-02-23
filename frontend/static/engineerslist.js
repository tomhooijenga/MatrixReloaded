// This file lists the engineers on the page
$(document).ready(function () {
    new Clipboard('.fa-copy');
    // We will use this variable to create the JSON request
    var jsonUrl = setEngineerUrl();
    // We initialize the DataTable with the json file required for the engineer page
    var table = createEngineerTable(jsonUrl);
    // Makes the search input search-bar work on the DataTable
    $('.search-bar').keyup(function () {
        table.search($(this).val()).draw();
    });
    
    // Shows the engineers details in the card panel when the table row is clicked
    table.on('click', 'tr', function () {
        // We set the data of the clicked row in a variable for later use
        var data = table.row(this).data();
        var tr = $(this).closest('tr');
        // We check if the tr is not empty.
        if (tr.has("td.dataTables_empty").length > 0) {
            $(".productdetails").css("visibility", "hidden");
        } else {
            $(".card").css("visibility", "visible");
            
             // Fill the card with data and make the card read-only
            $('.card').form(data).form('editable', false).carousel(2);
        }
    });
    
    $('.search-bar').click(function() {
       $('.engineerslist').DataTable().destroy();
       table = createEngineerTable(jsonUrl);
    });
});