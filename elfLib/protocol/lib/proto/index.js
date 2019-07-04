"use strict";
exports.__esModule = true;
var grpc_1 = require("grpc");
var proto_loader_1 = require("@grpc/proto-loader");
var path_1 = require("path");
var ElfAdmin;
(function (ElfAdmin) {
    var protoDef = grpc_1.loadPackageDefinition(proto_loader_1.loadSync(path_1.resolve(__dirname, './ElfAdmin.proto')));
    var adminService;
    function getAdminService(serviceURI) {
        if (!adminService) {
            try {
                adminService = new protoDef.AdminService(serviceURI, grpc_1.credentials.createInsecure());
            }
            catch (e) {
                console.error(e);
            }
        }
        return adminService;
    }
    ElfAdmin.getAdminService = getAdminService;
    function setElfService(server, elfService) {
        server.addService(protoDef.ElfService.service, elfService);
    }
    ElfAdmin.setElfService = setElfService;
})(ElfAdmin = exports.ElfAdmin || (exports.ElfAdmin = {}));
