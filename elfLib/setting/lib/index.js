"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./setting"));
var setting_1 = require("./setting");
var _a = process.env, NODE_ENV = _a.NODE_ENV, BESPOKE_HMR = _a.BESPOKE_HMR, BESPOKE_WITH_PROXY = _a.BESPOKE_WITH_PROXY, BESPOKE_WITH_LINKER = _a.BESPOKE_WITH_LINKER, OTREE_PORT = _a.OTREE_PORT, OTREE_PROXY = _a.OTREE_PROXY, OTREE_SERVER = _a.OTREE_SERVER, OTREE_NAMESPACE = _a.OTREE_NAMESPACE;
exports.elfSetting = __assign(__assign({}, setting_1["default"]), { inProductEnv: NODE_ENV === 'production', 
    //region bespoke
    bespokeHmr: BESPOKE_HMR === 'true', bespokeWithProxy: BESPOKE_WITH_PROXY === 'true', bespokeWithLinker: BESPOKE_WITH_LINKER === 'true', 
    //endregion
    //region otree
    oTreeNamespace: OTREE_NAMESPACE || 'OtreeDefault', oTreePort: +(OTREE_PORT || 3070), oTreeProxy: OTREE_PROXY || 'http://127.0.0.1:3070', oTreeServer: OTREE_SERVER || 'http://127.0.0.1:8000' });
