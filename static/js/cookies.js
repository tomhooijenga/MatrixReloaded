/**
 * Set a http cookie.
 * @param {string} name The name of the cookie
 * @param {string} value The value of the cookie
 */
function setCookie(name, value) {
    // This cookie is valid for exactly one year
    var expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = name + "=" + value + "; expires=" + expires.toUTCString() + "; path=/";
}

/**
 * Get the value of a cookie by name
 * @param {string} name The name of the cookie
 * @returns {string}
 */
function getCookie(name) {
    name = name + '=';

    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];

        // Trim possible leading whitespace
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }

        // If we found the cookie we're looking for, return the value
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}
