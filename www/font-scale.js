var exec = require('cordova/exec');
var cordova = require('cordova');

var SERVICE = 'FontScale';
var MIN_TEXT_ZOOM = 50;
var MAX_TEXT_ZOOM = 500;

// Runs the native action where the platform has one, otherwise resolves with the fallback.
function call (action, args, platforms, fallback) {
    return new Promise(function (resolve, reject) {
        if (platforms.indexOf(cordova.platformId) === -1) {
            resolve(fallback);
            return;
        }
        exec(resolve, reject, SERVICE, action, args);
    });
}

module.exports = {
    /**
     * The device text-size setting as a multiplier, 1 = default: Android's font scale, or on iOS the Dynamic Type
     * body size relative to the default ("Large"). Resolves 1 on other platforms.
     * @returns {Promise<number>}
     */
    getFontScale: function () {
        return call('getFontScale', [], ['android', 'ios'], 1);
    },

    /**
     * The Android WebView's text zoom in percent (100 = none). A value other than 100 means the WebView is already
     * scaling text itself. Resolves null on other platforms.
     * @returns {Promise<number|null>}
     */
    getTextZoom: function () {
        return call('getTextZoom', [], ['android'], null);
    },

    /**
     * Sets the Android WebView's text zoom in percent (50-500). Set 100 when the app applies the font scale itself, so
     * text is not scaled twice. Does nothing on other platforms.
     * @param {number} percent
     * @returns {Promise<void>}
     */
    setTextZoom: function (percent) {
        if (typeof percent !== 'number' || percent % 1 !== 0 || percent < MIN_TEXT_ZOOM || percent > MAX_TEXT_ZOOM) {
            return Promise.reject(new RangeError('setTextZoom expects a whole number from ' + MIN_TEXT_ZOOM + ' to ' + MAX_TEXT_ZOOM));
        }
        return call('setTextZoom', [percent], ['android'], undefined);
    }
};
