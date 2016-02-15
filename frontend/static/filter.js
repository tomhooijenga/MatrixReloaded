$(document).ready(function () {
    $(".filterlanden").select2();
    // Local bestand
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
        });
        console.log(ar);
    });
});