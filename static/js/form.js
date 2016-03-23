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

    /**
     * Format a data object to a specific format
     *
     * @param {Object|Array} data The data to format
     * @param {string} key The format to use
     * @returns {*}
     */
    function formatString(data, key) {
        if (key == "countries" || key == "languages") {
            return data.map(function (obj) {
                return obj.name;
            }).join(', ');
        } else if (key == "category") {
            // Creates a string that holds the category and subcategory
            return data.parent.name + " " + data.name;
        } else if (key == "country") {
            return data.name;
        }

        return data;
    }

    var methods = {
        /**
         * Fill the form with data
         * @param {Object} data Object with keys as input names and values as input values
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
                        // Trigger the change anyway, because the image-upload depends on it
                        if ($el.is('[type="file"]')) {
                            $el.trigger('change');

                            return;
                        }

                        if (autofill) {
                            // data-* properties are treated differently than normal properties
                            if (autofill.substr(0, 5) === 'data-') {
                                $el.data(autofill.slice(5), formatString(data[key], key));
                            } else {
                                $el.prop(autofill, formatString(data[key], key));
                            }
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
         * @param {boolean} enabled Are the elements enabled?
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
                method = this.data('method') || this[0].method;

            // Find all file inputs and append all files of these inputs to the data
            this.find('input[type="file"]')
                .each(function () {
                    var name = this.name.replace(/-/g, '_');

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