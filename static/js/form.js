(function ($) {

    /**
     * A simple plugin to make forms easier
     * @param method
     * @returns {jQuery}
     */
    $.fn.form = function (method /*, arguments */) {

        // If this method is defined, call it with the given arguments.
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
        }
        // Default to the 'init' method
        else {
            return methods.init.apply(this, arguments);
        }
    };
    
    // Function for returning the full category name to display on the front page
    function categoryName(data) {
        var category = "";
        // Creates a string that holds the category and subcategory
        for (var val in data) {
            if (val == "parent") {
                category += data[val].name + " ";
            }
        }
        return category += data.name;
    }
    
    /* Function for creating and returning a string with the Countries and Languages of an engineer */
    function valuesToString(data) {
        var values = "";
        // Splits the data into a string separated by commas
        for (var val in data) {
            if (val == 0) { 
                values += data[val].name;
            } else {
                values += ", " + data[val].name;
            }
        } return values;
    }

    var methods = {
        /**
         * Fill the form with data
         * @param data Object with keys as input names and values as input values
         * @returns {jQuery}
         */
        init: function (data) {
            return this.each(function () {
                var $this = $(this);
                for (var key in data) {
                    if (!data.hasOwnProperty(key)) continue;
                    // Replace all _ with - then find that element in our current scope
                    // Searches by class and by name
                    var name = key.replace(/_/g, '-'),
                        selector = '.' + name + ', [name="' + name + '"]',
                        $el = $this.find(selector).addBack(selector);
                        
                    $el.each(function () {
                        var $el = $(this),
                            autofill = $el.data('autofill');
                            
                        // It is not possible to set a file input with javascript
                        if ($el.is('[type="file"]')) {
                            return;
                        }

                        if (autofill) {
                            // If statements to check what is asked for displaying
                            if (key == "countries" || key == "languages") {
                                $el.prop(autofill, valuesToString(data[key]));
                            } else if (key == "country") {
                                $el.prop(autofill, data.country.name);
                            } else if (key == "category") {
                                $el.prop(autofill, categoryName(data[key]));
                            } else {
                                $el.prop(autofill, data[key]);
                            };
                        } else {
                            // If the data is not an array, make it an array
                            var value = $.isArray(data[key]) ? data[key] : [data[key]];

                            $el.val(value).trigger('change');
                        }
                    });
                }
            });
        },
        /**
         *
         * @param enabled Are the elements enabled?
         * @returns {jQuery}
         */
        editable: function (enabled) {
            this.find(':input').prop('disabled', !enabled);

            return this
        },
        /**
         * Submit the form to the server
         * @returns {jQuery}
         */
        submit: function () {
            var url = this[0].action,
                data = new FormData(),
                method = this.data('method') || this.method;

            // Find all file inputs and append all files of these inputs to the data
            this.find('input[type="file"]')
                .each(function () {
                    var name = this.name;

                    for (var i = this.files.length - 1; i >= 0; i--) {
                        data.append(name, this.files[i]);
                    }
                });

            // Transform each name back to it's original by replacing the -'s with _'s
            // Append this data as well
            this.serializeArray()
                .forEach(function (input) {
                    data.append(input.name.replace(/-/g, '_'), input.value);
                });

            // PUT/PATCH/POST the data to the server
            return $.ajax(url, {
                method: method,
                data: data,
                contentType: false,
                processData: false
            });
        },
        /**
         * Clear the form
         * @returns {*}
         */
        clear: function () {
            return this.each(function () {
                // Reset the entire form to it's initial state. Note: this is
                // not the same as setting each input to empty
                this.reset();

                // Trigger a change event because most scripts don't listen for
                // 'reset' event
                $(this).find(':input').trigger('change');
            })
        }
    };
})(jQuery);