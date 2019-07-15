"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadScript(list, callback) {
    if (callback === void 0) { callback = function () { return null; }; }
    if (!list.length) {
        return callback();
    }
    var loaded = 0;
    function loadNext() {
        loadSingleScript(list[loaded], function () {
            loaded++;
            if (loaded >= list.length) {
                callback();
            }
            else {
                loadNext();
            }
        });
    }
    loadNext();
}
exports.loadScript = loadScript;
function loadSingleScript(src, callback) {
    if (callback === void 0) { callback = function () { return null; }; }
    var EVENT_LOAD = 'load';
    var s = document.createElement('script');
    s.async = false;
    s.src = src;
    function load() {
        s.parentNode.removeChild(s);
        s.removeEventListener(EVENT_LOAD, load, false);
        callback();
    }
    s.addEventListener(EVENT_LOAD, load, false);
    document.body.appendChild(s);
}
//# sourceMappingURL=fileLoader.js.map