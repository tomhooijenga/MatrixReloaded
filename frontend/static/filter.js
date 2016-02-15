$(document).ready(function () {
    $(".filterlanden").select2();
    // Local bestand
    $.getJSON("/api/countries/?format=json").then(function (data) {
        data = data.map(function (country) {
            return {
                id: country.url,
                text: country.name
            };
        });
        $('#countries, #country').select2({
            data: data
        });
    });
    $.getJSON("/api/countries/?format=json", function (data) {
        $.each(data.results, function (i, item) {
            // alert(item.name);
            $('#filter #filterlanden').append('<option value="AL">' + item.name + '</option>');
        });
    });

    $(document).on("click", "#savefilt", function () {
        var ar = [];
        $('li.select2-selection__choice').each(function () {
            var language = $(this).text();
            ar.push(language.substring(1, language.length));
            // alert((this).attr("title"));
            // var x = $(this).attr("title");
            //  var sThisVal = (this.checked ? ar.push(x) :false);
        });
        console.log(ar);
    });
});