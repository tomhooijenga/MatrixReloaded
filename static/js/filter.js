$(document).ready(function () {

    // Fetch our elements for later use
    var select = $('.filterlanden'),
        save = $(".savefilt"),
        modal = $('.selectCountries'),
        filter = [];

    // Call the select2 plugin to prevent style jumping
    select.select2();

    modal.on('hidden.bs.modal', function () {
        // On modal close the input is reset to its initial value.
        select.val(filter).trigger('change');
    }).on('show.bs.modal', function () {
        // We get the JSON from the API.
        $.getJSON("/api/countries/?format=json", function (data) {
            // We format an array since select2 can't use a JSON array
            var formatData = data.map(function (country) {
                return {
                    id: country.code,
                    text: country.name
                }
            });

            // Select2 shows all the countries in the datatabase
            select.select2({
                data: formatData
            });

            var countries = getCookie('countries');

            if (countries) {
                // If the cookie is set, we split it into an array
                filter = countries.split(",");

                // Set the selected values and trigger for an update
                select.val(filter).trigger('change');
            }
        });
    });

    // On click we create the cookie and reload the page to show the filtered results
    save.on('click', function () {
        // Grab the value of the country selector. If its null, use an empty array instead.
        var countries = select.val() || [];

        setCookie('countries', countries.join(','));

        modal.modal('hide');

        // Reload the page to see the new filters in action
        location.reload();
    });
});