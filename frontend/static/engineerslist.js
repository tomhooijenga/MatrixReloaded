// We can get cookies with this function
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
// This file lists the engineers on the page
$(document).ready(function () {
    var engineers = [];
    function getArray(){
        return $.getJSON("/api/engineers/?expand=country&format=json");
    };
    getArray().done(function(json) {
        var cookie = getCookie("countries");
        // Checks if cookie is empty
        // If it's empty, it just adds the normal json request to an array.
        if (cookie == "") {
            $.each(json.results, function(key, val) {
                engineers.push(val);
            });
        // If the cookie is not empty it filters the results.
        } else {
            var filter = cookie.split(",");
            $.each(json.results, function(key, val) {
                $.each(filter, function(code, country){
                    if (val.country.code === country) {
                        engineers.push(val);
                    }
                });
            });
        };
        // We initialize the DataTable with the json file required for the engineer page
        var table = $('.engineerslist').DataTable({
            //"sAjaxSource": "/api/engineers/?expand=country&format=json",
            //"sAjaxDataProp": "results",
            "aaData": engineers,
            "bInfo" : false,
            "bPaginate": false,
            // The part below makes our table scrollable when showing more than 16 items.
            "deferRender": true,
            "bScrollCollapse": true,
            "scrollY": '45vh',
            // We initialize the column fields with the required details (First name, Last name) and add some HTML with the render function.
            "columns": [
                {data: "first_name",
                "className": 'details-control'},
                {data: "last_name"},
                {render: function () {
                        return 'FSS / ASP';
                    }, orderable: false,
                    searchable: false},
                {data: "country.code"}
                //{render: function () {
                //        return 'Country';
                //    }, orderable: false,
                //    searchable: false}
            ]
        });
        // Makes the search input search-bar work on the DataTable
        $('.search-bar').keyup(function(){
            table.search($(this).val()).draw() ;
        });
    });
});