// This function sets a Cookie with the selected Countries. They will have a long expire date so it will remember the preferences.
function setCookie(countries){
    var expireYear = (new Date).getFullYear() + 2;
    var date = new Date("January 1, " + expireYear);
    var dateString = date.toGMTString();
    var cookieString = "countries=" + countries + ";expires=" + dateString;
    document.cookie = cookieString;
}
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
$(document).ready(function () {
    // Sets the cookie for later use
    var cookie = getCookie("countries");
    // We get the JSON from the API.
    $.getJSON("/api/countries/?format=json", function (data) {
        // We format an array since select2 can't use a JSON array
        var formatData = data.map(function(obj){ 
            var newObj = {};
            newObj.id = obj.code;
            newObj.text = obj.name;
            return newObj;
        });
        // Select2 shows all the countries in the datatabase
        var element = $(".filterlanden").select2({
            data: formatData
        });
        // Checks if cookie is set.
        if (cookie != "") {
            // If the cookie is set, we split it into an array
            var filter = cookie.split(",");
            // We loop through all the items in the array, and add the selected countries if they are saved in the cookie
            for (var d = 0; d < formatData.length; d++) {
                var item = formatData[d];
                // Create the DOM option that is pre-selected by default
                $.each(filter, function(code, country){
                    if (country == item.id) {
                        var option = new Option(item.text, item.id, true, true);
                        // Append it to the select
                        element.append(option);
                        // Update the selected options that are displayed
                        element.trigger('change');
                    };
                });
            };
        }
    });
    // On click we create the cookie and reload the page to show the filtered results
    $(document).on("click", "#savefilt", function () {
        if ($(".filterlanden").val() == null) {
            // This removes the cookie if no countries are selected
            document.cookie = 'countries' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
        } else {
            var selectedCountries = $(".filterlanden").val().join(',');
            setCookie(selectedCountries);
        };
        $('.selectCountries').modal('hide');
        location.reload(true);
    })       
});