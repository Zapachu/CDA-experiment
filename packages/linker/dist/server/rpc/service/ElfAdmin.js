"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protocol_1 = require("@elf/protocol");
var setting_1 = require("@elf/setting");
var service_1 = require("../../service");
function setElfService(server) {
    function getOnlineTemplates(req, callback) {
        service_1.PhaseService.getPhaseTemplates().then(function (phaseTemplates) {
            return callback(null, { namespaces: phaseTemplates.map(function (_a) {
                    var namespace = _a.namespace;
                    return namespace;
                }) });
        });
    }
    protocol_1.ElfAdmin.setElfService(server, { getOnlineTemplates: getOnlineTemplates });
}
exports.setElfService = setElfService;
function getAdminService() {
    return protocol_1.ElfAdmin.getAdminService(setting_1.elfSetting.adminServiceUri);
}
exports.getAdminService = getAdminService;
//# sourceMappingURL=ElfAdmin.js.map