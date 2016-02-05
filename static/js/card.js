(function ($) {

    /**
     * A simple plugin to support the details card behaviour
     * @param method
     * @returns {jQuery}
     */
    $.fn.card = function (method /*, arguments */) {

        // If this method is defined, call it with the given arguments.
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
        }
        // Default to the 'init' method
        else {
            return methods.init.apply(this, arguments);
        }
    };

    var methods = {
        /**
         *
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
                        el = $this.find('.' + name + ', [name="' + name + '"]');

                    el.each(function () {
                        var $el = $(this),
                            autofill = $el.data('autofill');

                        if (autofill) {
                            $el.prop(autofill, data[key]);
                        } else {
                            $el.val(data[key]);
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
            return this.find('input, select').prop('disabled', !enabled);
        }
    };
})(jQuery);