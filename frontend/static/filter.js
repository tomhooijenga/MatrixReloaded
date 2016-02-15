$(document).ready(function () {
    alert('Hello');
    $(".filterlanden").select2();
    // Local bestand
    $.getJSON("/api/countries/?format=json", function (data) {
        $.each(data, function (key, val) {
            $('#filter #filterlanden').append('<option value="AL">' + val.name + '</option>');
        });
    });
    var filterCountries = [];
    $(document).on("click", "#savefilt", function () {
        var selectedCountries = [];
        $('li.select2-selection__choice').each(function () {
            var language = $(this).text();
            selectedCountries.push(language.substring(1, language.length));
        });
        $('.selectCountries').modal('hide');
        filterCountries = selectedCountries;
        console.log(filterCountries);
    });
});