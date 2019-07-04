"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setting_1 = require("@elf/setting");
var server_util_1 = require("@bespoke/server-util");
var QCloudSms = require("qcloudsms_js");
var QCloudSMS = /** @class */ (function () {
    function QCloudSMS() {
    }
    QCloudSMS.init = function () {
        try {
            this.qCloudSMS = QCloudSms(setting_1.elfSetting.qCloudSMS.appId, setting_1.elfSetting.qCloudSMS.appKey);
            this.singleSender = QCloudSMS.qCloudSMS.SmsSingleSender();
        }
        catch (e) {
            server_util_1.Log.e('QCloudSMS初始化失败');
        }
    };
    QCloudSMS.singleSenderWithParam = function (nationCode, phoneNumber, templateId, params) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.singleSender.sendWithParam(nationCode, phoneNumber, templateId, params, setting_1.elfSetting.qCloudSMS.smsSign, '', '', function (err, res, resData) {
                resolve(!err && resData.result == 0);
            });
        });
    };
    return QCloudSMS;
}());
exports.QCloudSMS = QCloudSMS;
//# sourceMappingURL=QCloudSMS.js.map