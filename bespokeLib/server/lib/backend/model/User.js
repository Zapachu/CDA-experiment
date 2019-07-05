"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var _a = mongoose_1.Schema.Types, String = _a.String, Number = _a.Number;
exports.UserSchema = new mongoose_1.Schema({
    mobile: { type: String, unique: true },
    role: { type: Number, default: 0 },
    orgCode: { type: String, default: '1070' }
});
exports.UserModel = mongoose_1.model('User', exports.UserSchema);
//# sourceMappingURL=User.js.map