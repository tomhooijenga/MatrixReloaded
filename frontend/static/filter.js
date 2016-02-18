function setCookie(countries){
    var date = new Date("January 1, 2017");
    var dateString = date.toGMTString();
    var cookieString = "countries=" + countries + ";expires=" + dateString;
    document.cookie = cookieString;
}

$(document).ready(function () {
    $(".filterlanden").select2();
    // Local bestand
    $.getJSON("/api/countries/?format=json", function (data) {
        var formatData = data.map(function(obj){ 
            var newObj = {};
            newObj.id = obj.code;
            newObj.text = obj.name;
            return newObj;
        });
        $(".filterlanden").select2({
            data: formatData
        });
    });
    $(document).on("click", "#savefilt", function () {
        var selectedCountries = $(".filterlanden").val().join(',');
        setCookie(selectedCountries);
        $('.selectCountries').modal('hide');
    });
    
    
});