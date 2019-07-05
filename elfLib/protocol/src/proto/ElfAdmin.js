/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.AdminService = (function() {

    /**
     * Constructs a new AdminService service.
     * @exports AdminService
     * @classdesc Represents an AdminService
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function AdminService(rpcImpl, requestDelimited, responseDelimited) {
        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
    }

    (AdminService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = AdminService;

    /**
     * Creates new AdminService service using the specified rpc implementation.
     * @function create
     * @memberof AdminService
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {AdminService} RPC service. Useful where requests and/or responses are streamed.
     */
    AdminService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link AdminService#getAuthorizedTemplates}.
     * @memberof AdminService
     * @typedef GetAuthorizedTemplatesCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {GetAuthorizedTemplatesRes} [response] GetAuthorizedTemplatesRes
     */

    /**
     * Calls GetAuthorizedTemplates.
     * @function getAuthorizedTemplates
     * @memberof AdminService
     * @instance
     * @param {IGetAuthorizedTemplatesReq} request GetAuthorizedTemplatesReq message or plain object
     * @param {AdminService.GetAuthorizedTemplatesCallback} callback Node-style callback called with the error, if any, and GetAuthorizedTemplatesRes
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(AdminService.prototype.getAuthorizedTemplates = function getAuthorizedTemplates(request, callback) {
        return this.rpcCall(getAuthorizedTemplates, $root.GetAuthorizedTemplatesReq, $root.GetAuthorizedTemplatesRes, request, callback);
    }, "name", { value: "GetAuthorizedTemplates" });

    /**
     * Calls GetAuthorizedTemplates.
     * @function getAuthorizedTemplates
     * @memberof AdminService
     * @instance
     * @param {IGetAuthorizedTemplatesReq} request GetAuthorizedTemplatesReq message or plain object
     * @returns {Promise<GetAuthorizedTemplatesRes>} Promise
     * @variation 2
     */

    return AdminService;
})();

$root.GetAuthorizedTemplatesReq = (function() {

    /**
     * Properties of a GetAuthorizedTemplatesReq.
     * @exports IGetAuthorizedTemplatesReq
     * @interface IGetAuthorizedTemplatesReq
     * @property {string|null} [userId] GetAuthorizedTemplatesReq userId
     */

    /**
     * Constructs a new GetAuthorizedTemplatesReq.
     * @exports GetAuthorizedTemplatesReq
     * @classdesc Represents a GetAuthorizedTemplatesReq.
     * @implements IGetAuthorizedTemplatesReq
     * @constructor
     * @param {IGetAuthorizedTemplatesReq=} [properties] Properties to set
     */
    function GetAuthorizedTemplatesReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetAuthorizedTemplatesReq userId.
     * @member {string} userId
     * @memberof GetAuthorizedTemplatesReq
     * @instance
     */
    GetAuthorizedTemplatesReq.prototype.userId = "";

    /**
     * Creates a new GetAuthorizedTemplatesReq instance using the specified properties.
     * @function create
     * @memberof GetAuthorizedTemplatesReq
     * @static
     * @param {IGetAuthorizedTemplatesReq=} [properties] Properties to set
     * @returns {GetAuthorizedTemplatesReq} GetAuthorizedTemplatesReq instance
     */
    GetAuthorizedTemplatesReq.create = function create(properties) {
        return new GetAuthorizedTemplatesReq(properties);
    };

    /**
     * Encodes the specified GetAuthorizedTemplatesReq message. Does not implicitly {@link GetAuthorizedTemplatesReq.verify|verify} messages.
     * @function encode
     * @memberof GetAuthorizedTemplatesReq
     * @static
     * @param {IGetAuthorizedTemplatesReq} message GetAuthorizedTemplatesReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetAuthorizedTemplatesReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.userId != null && message.hasOwnProperty("userId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
        return writer;
    };

    /**
     * Encodes the specified GetAuthorizedTemplatesReq message, length delimited. Does not implicitly {@link GetAuthorizedTemplatesReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetAuthorizedTemplatesReq
     * @static
     * @param {IGetAuthorizedTemplatesReq} message GetAuthorizedTemplatesReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetAuthorizedTemplatesReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetAuthorizedTemplatesReq message from the specified reader or buffer.
     * @function decode
     * @memberof GetAuthorizedTemplatesReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetAuthorizedTemplatesReq} GetAuthorizedTemplatesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetAuthorizedTemplatesReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetAuthorizedTemplatesReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.userId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetAuthorizedTemplatesReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetAuthorizedTemplatesReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetAuthorizedTemplatesReq} GetAuthorizedTemplatesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetAuthorizedTemplatesReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetAuthorizedTemplatesReq message.
     * @function verify
     * @memberof GetAuthorizedTemplatesReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetAuthorizedTemplatesReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.userId != null && message.hasOwnProperty("userId"))
            if (!$util.isString(message.userId))
                return "userId: string expected";
        return null;
    };

    /**
     * Creates a GetAuthorizedTemplatesReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetAuthorizedTemplatesReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetAuthorizedTemplatesReq} GetAuthorizedTemplatesReq
     */
    GetAuthorizedTemplatesReq.fromObject = function fromObject(object) {
        if (object instanceof $root.GetAuthorizedTemplatesReq)
            return object;
        var message = new $root.GetAuthorizedTemplatesReq();
        if (object.userId != null)
            message.userId = String(object.userId);
        return message;
    };

    /**
     * Creates a plain object from a GetAuthorizedTemplatesReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetAuthorizedTemplatesReq
     * @static
     * @param {GetAuthorizedTemplatesReq} message GetAuthorizedTemplatesReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetAuthorizedTemplatesReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.userId = "";
        if (message.userId != null && message.hasOwnProperty("userId"))
            object.userId = message.userId;
        return object;
    };

    /**
     * Converts this GetAuthorizedTemplatesReq to JSON.
     * @function toJSON
     * @memberof GetAuthorizedTemplatesReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetAuthorizedTemplatesReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetAuthorizedTemplatesReq;
})();

$root.GetAuthorizedTemplatesRes = (function() {

    /**
     * Properties of a GetAuthorizedTemplatesRes.
     * @exports IGetAuthorizedTemplatesRes
     * @interface IGetAuthorizedTemplatesRes
     * @property {Array.<string>|null} [namespaces] GetAuthorizedTemplatesRes namespaces
     */

    /**
     * Constructs a new GetAuthorizedTemplatesRes.
     * @exports GetAuthorizedTemplatesRes
     * @classdesc Represents a GetAuthorizedTemplatesRes.
     * @implements IGetAuthorizedTemplatesRes
     * @constructor
     * @param {IGetAuthorizedTemplatesRes=} [properties] Properties to set
     */
    function GetAuthorizedTemplatesRes(properties) {
        this.namespaces = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetAuthorizedTemplatesRes namespaces.
     * @member {Array.<string>} namespaces
     * @memberof GetAuthorizedTemplatesRes
     * @instance
     */
    GetAuthorizedTemplatesRes.prototype.namespaces = $util.emptyArray;

    /**
     * Creates a new GetAuthorizedTemplatesRes instance using the specified properties.
     * @function create
     * @memberof GetAuthorizedTemplatesRes
     * @static
     * @param {IGetAuthorizedTemplatesRes=} [properties] Properties to set
     * @returns {GetAuthorizedTemplatesRes} GetAuthorizedTemplatesRes instance
     */
    GetAuthorizedTemplatesRes.create = function create(properties) {
        return new GetAuthorizedTemplatesRes(properties);
    };

    /**
     * Encodes the specified GetAuthorizedTemplatesRes message. Does not implicitly {@link GetAuthorizedTemplatesRes.verify|verify} messages.
     * @function encode
     * @memberof GetAuthorizedTemplatesRes
     * @static
     * @param {IGetAuthorizedTemplatesRes} message GetAuthorizedTemplatesRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetAuthorizedTemplatesRes.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.namespaces != null && message.namespaces.length)
            for (var i = 0; i < message.namespaces.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.namespaces[i]);
        return writer;
    };

    /**
     * Encodes the specified GetAuthorizedTemplatesRes message, length delimited. Does not implicitly {@link GetAuthorizedTemplatesRes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetAuthorizedTemplatesRes
     * @static
     * @param {IGetAuthorizedTemplatesRes} message GetAuthorizedTemplatesRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetAuthorizedTemplatesRes.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetAuthorizedTemplatesRes message from the specified reader or buffer.
     * @function decode
     * @memberof GetAuthorizedTemplatesRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetAuthorizedTemplatesRes} GetAuthorizedTemplatesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetAuthorizedTemplatesRes.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetAuthorizedTemplatesRes();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.namespaces && message.namespaces.length))
                    message.namespaces = [];
                message.namespaces.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetAuthorizedTemplatesRes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetAuthorizedTemplatesRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetAuthorizedTemplatesRes} GetAuthorizedTemplatesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetAuthorizedTemplatesRes.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetAuthorizedTemplatesRes message.
     * @function verify
     * @memberof GetAuthorizedTemplatesRes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetAuthorizedTemplatesRes.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.namespaces != null && message.hasOwnProperty("namespaces")) {
            if (!Array.isArray(message.namespaces))
                return "namespaces: array expected";
            for (var i = 0; i < message.namespaces.length; ++i)
                if (!$util.isString(message.namespaces[i]))
                    return "namespaces: string[] expected";
        }
        return null;
    };

    /**
     * Creates a GetAuthorizedTemplatesRes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetAuthorizedTemplatesRes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetAuthorizedTemplatesRes} GetAuthorizedTemplatesRes
     */
    GetAuthorizedTemplatesRes.fromObject = function fromObject(object) {
        if (object instanceof $root.GetAuthorizedTemplatesRes)
            return object;
        var message = new $root.GetAuthorizedTemplatesRes();
        if (object.namespaces) {
            if (!Array.isArray(object.namespaces))
                throw TypeError(".GetAuthorizedTemplatesRes.namespaces: array expected");
            message.namespaces = [];
            for (var i = 0; i < object.namespaces.length; ++i)
                message.namespaces[i] = String(object.namespaces[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a GetAuthorizedTemplatesRes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetAuthorizedTemplatesRes
     * @static
     * @param {GetAuthorizedTemplatesRes} message GetAuthorizedTemplatesRes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetAuthorizedTemplatesRes.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.namespaces = [];
        if (message.namespaces && message.namespaces.length) {
            object.namespaces = [];
            for (var j = 0; j < message.namespaces.length; ++j)
                object.namespaces[j] = message.namespaces[j];
        }
        return object;
    };

    /**
     * Converts this GetAuthorizedTemplatesRes to JSON.
     * @function toJSON
     * @memberof GetAuthorizedTemplatesRes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetAuthorizedTemplatesRes.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetAuthorizedTemplatesRes;
})();

$root.ElfService = (function() {

    /**
     * Constructs a new ElfService service.
     * @exports ElfService
     * @classdesc Represents an ElfService
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function ElfService(rpcImpl, requestDelimited, responseDelimited) {
        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
    }

    (ElfService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = ElfService;

    /**
     * Creates new ElfService service using the specified rpc implementation.
     * @function create
     * @memberof ElfService
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {ElfService} RPC service. Useful where requests and/or responses are streamed.
     */
    ElfService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link ElfService#getOnlineTemplates}.
     * @memberof ElfService
     * @typedef GetOnlineTemplatesCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {GetOnlineTemplatesRes} [response] GetOnlineTemplatesRes
     */

    /**
     * Calls GetOnlineTemplates.
     * @function getOnlineTemplates
     * @memberof ElfService
     * @instance
     * @param {IGetOnlineTemplatesReq} request GetOnlineTemplatesReq message or plain object
     * @param {ElfService.GetOnlineTemplatesCallback} callback Node-style callback called with the error, if any, and GetOnlineTemplatesRes
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(ElfService.prototype.getOnlineTemplates = function getOnlineTemplates(request, callback) {
        return this.rpcCall(getOnlineTemplates, $root.GetOnlineTemplatesReq, $root.GetOnlineTemplatesRes, request, callback);
    }, "name", { value: "GetOnlineTemplates" });

    /**
     * Calls GetOnlineTemplates.
     * @function getOnlineTemplates
     * @memberof ElfService
     * @instance
     * @param {IGetOnlineTemplatesReq} request GetOnlineTemplatesReq message or plain object
     * @returns {Promise<GetOnlineTemplatesRes>} Promise
     * @variation 2
     */

    return ElfService;
})();

$root.GetOnlineTemplatesReq = (function() {

    /**
     * Properties of a GetOnlineTemplatesReq.
     * @exports IGetOnlineTemplatesReq
     * @interface IGetOnlineTemplatesReq
     */

    /**
     * Constructs a new GetOnlineTemplatesReq.
     * @exports GetOnlineTemplatesReq
     * @classdesc Represents a GetOnlineTemplatesReq.
     * @implements IGetOnlineTemplatesReq
     * @constructor
     * @param {IGetOnlineTemplatesReq=} [properties] Properties to set
     */
    function GetOnlineTemplatesReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new GetOnlineTemplatesReq instance using the specified properties.
     * @function create
     * @memberof GetOnlineTemplatesReq
     * @static
     * @param {IGetOnlineTemplatesReq=} [properties] Properties to set
     * @returns {GetOnlineTemplatesReq} GetOnlineTemplatesReq instance
     */
    GetOnlineTemplatesReq.create = function create(properties) {
        return new GetOnlineTemplatesReq(properties);
    };

    /**
     * Encodes the specified GetOnlineTemplatesReq message. Does not implicitly {@link GetOnlineTemplatesReq.verify|verify} messages.
     * @function encode
     * @memberof GetOnlineTemplatesReq
     * @static
     * @param {IGetOnlineTemplatesReq} message GetOnlineTemplatesReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetOnlineTemplatesReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified GetOnlineTemplatesReq message, length delimited. Does not implicitly {@link GetOnlineTemplatesReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetOnlineTemplatesReq
     * @static
     * @param {IGetOnlineTemplatesReq} message GetOnlineTemplatesReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetOnlineTemplatesReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetOnlineTemplatesReq message from the specified reader or buffer.
     * @function decode
     * @memberof GetOnlineTemplatesReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetOnlineTemplatesReq} GetOnlineTemplatesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetOnlineTemplatesReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetOnlineTemplatesReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetOnlineTemplatesReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetOnlineTemplatesReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetOnlineTemplatesReq} GetOnlineTemplatesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetOnlineTemplatesReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetOnlineTemplatesReq message.
     * @function verify
     * @memberof GetOnlineTemplatesReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetOnlineTemplatesReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a GetOnlineTemplatesReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetOnlineTemplatesReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetOnlineTemplatesReq} GetOnlineTemplatesReq
     */
    GetOnlineTemplatesReq.fromObject = function fromObject(object) {
        if (object instanceof $root.GetOnlineTemplatesReq)
            return object;
        return new $root.GetOnlineTemplatesReq();
    };

    /**
     * Creates a plain object from a GetOnlineTemplatesReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetOnlineTemplatesReq
     * @static
     * @param {GetOnlineTemplatesReq} message GetOnlineTemplatesReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetOnlineTemplatesReq.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this GetOnlineTemplatesReq to JSON.
     * @function toJSON
     * @memberof GetOnlineTemplatesReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetOnlineTemplatesReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetOnlineTemplatesReq;
})();

$root.GetOnlineTemplatesRes = (function() {

    /**
     * Properties of a GetOnlineTemplatesRes.
     * @exports IGetOnlineTemplatesRes
     * @interface IGetOnlineTemplatesRes
     * @property {Array.<string>|null} [namespaces] GetOnlineTemplatesRes namespaces
     */

    /**
     * Constructs a new GetOnlineTemplatesRes.
     * @exports GetOnlineTemplatesRes
     * @classdesc Represents a GetOnlineTemplatesRes.
     * @implements IGetOnlineTemplatesRes
     * @constructor
     * @param {IGetOnlineTemplatesRes=} [properties] Properties to set
     */
    function GetOnlineTemplatesRes(properties) {
        this.namespaces = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetOnlineTemplatesRes namespaces.
     * @member {Array.<string>} namespaces
     * @memberof GetOnlineTemplatesRes
     * @instance
     */
    GetOnlineTemplatesRes.prototype.namespaces = $util.emptyArray;

    /**
     * Creates a new GetOnlineTemplatesRes instance using the specified properties.
     * @function create
     * @memberof GetOnlineTemplatesRes
     * @static
     * @param {IGetOnlineTemplatesRes=} [properties] Properties to set
     * @returns {GetOnlineTemplatesRes} GetOnlineTemplatesRes instance
     */
    GetOnlineTemplatesRes.create = function create(properties) {
        return new GetOnlineTemplatesRes(properties);
    };

    /**
     * Encodes the specified GetOnlineTemplatesRes message. Does not implicitly {@link GetOnlineTemplatesRes.verify|verify} messages.
     * @function encode
     * @memberof GetOnlineTemplatesRes
     * @static
     * @param {IGetOnlineTemplatesRes} message GetOnlineTemplatesRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetOnlineTemplatesRes.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.namespaces != null && message.namespaces.length)
            for (var i = 0; i < message.namespaces.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.namespaces[i]);
        return writer;
    };

    /**
     * Encodes the specified GetOnlineTemplatesRes message, length delimited. Does not implicitly {@link GetOnlineTemplatesRes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetOnlineTemplatesRes
     * @static
     * @param {IGetOnlineTemplatesRes} message GetOnlineTemplatesRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetOnlineTemplatesRes.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetOnlineTemplatesRes message from the specified reader or buffer.
     * @function decode
     * @memberof GetOnlineTemplatesRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetOnlineTemplatesRes} GetOnlineTemplatesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetOnlineTemplatesRes.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetOnlineTemplatesRes();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.namespaces && message.namespaces.length))
                    message.namespaces = [];
                message.namespaces.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetOnlineTemplatesRes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetOnlineTemplatesRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetOnlineTemplatesRes} GetOnlineTemplatesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetOnlineTemplatesRes.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetOnlineTemplatesRes message.
     * @function verify
     * @memberof GetOnlineTemplatesRes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetOnlineTemplatesRes.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.namespaces != null && message.hasOwnProperty("namespaces")) {
            if (!Array.isArray(message.namespaces))
                return "namespaces: array expected";
            for (var i = 0; i < message.namespaces.length; ++i)
                if (!$util.isString(message.namespaces[i]))
                    return "namespaces: string[] expected";
        }
        return null;
    };

    /**
     * Creates a GetOnlineTemplatesRes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetOnlineTemplatesRes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetOnlineTemplatesRes} GetOnlineTemplatesRes
     */
    GetOnlineTemplatesRes.fromObject = function fromObject(object) {
        if (object instanceof $root.GetOnlineTemplatesRes)
            return object;
        var message = new $root.GetOnlineTemplatesRes();
        if (object.namespaces) {
            if (!Array.isArray(object.namespaces))
                throw TypeError(".GetOnlineTemplatesRes.namespaces: array expected");
            message.namespaces = [];
            for (var i = 0; i < object.namespaces.length; ++i)
                message.namespaces[i] = String(object.namespaces[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a GetOnlineTemplatesRes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetOnlineTemplatesRes
     * @static
     * @param {GetOnlineTemplatesRes} message GetOnlineTemplatesRes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetOnlineTemplatesRes.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.namespaces = [];
        if (message.namespaces && message.namespaces.length) {
            object.namespaces = [];
            for (var j = 0; j < message.namespaces.length; ++j)
                object.namespaces[j] = message.namespaces[j];
        }
        return object;
    };

    /**
     * Converts this GetOnlineTemplatesRes to JSON.
     * @function toJSON
     * @memberof GetOnlineTemplatesRes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetOnlineTemplatesRes.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetOnlineTemplatesRes;
})();

module.exports = $root;
