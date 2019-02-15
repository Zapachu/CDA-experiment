/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.GameService = (function() {

    /**
     * Constructs a new GameService service.
     * @exports GameService
     * @classdesc Represents a GameService
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function GameService(rpcImpl, requestDelimited, responseDelimited) {
        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
    }

    (GameService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = GameService;

    /**
     * Creates new GameService service using the specified rpc implementation.
     * @function create
     * @memberof GameService
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {GameService} RPC service. Useful where requests and/or responses are streamed.
     */
    GameService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link GameService#registerPhases}.
     * @memberof GameService
     * @typedef registerPhasesCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {RegisterPhasesRes} [response] RegisterPhasesRes
     */

    /**
     * Calls registerPhases.
     * @function registerPhases
     * @memberof GameService
     * @instance
     * @param {IRegisterPhasesReq} request RegisterPhasesReq message or plain object
     * @param {GameService.registerPhasesCallback} callback Node-style callback called with the error, if any, and RegisterPhasesRes
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(GameService.prototype.registerPhases = function registerPhases(request, callback) {
        return this.rpcCall(registerPhases, $root.RegisterPhasesReq, $root.RegisterPhasesRes, request, callback);
    }, "name", { value: "registerPhases" });

    /**
     * Calls registerPhases.
     * @function registerPhases
     * @memberof GameService
     * @instance
     * @param {IRegisterPhasesReq} request RegisterPhasesReq message or plain object
     * @returns {Promise<RegisterPhasesRes>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link GameService#sendBackPlayer}.
     * @memberof GameService
     * @typedef sendBackPlayerCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {SendBackPlayerRes} [response] SendBackPlayerRes
     */

    /**
     * Calls sendBackPlayer.
     * @function sendBackPlayer
     * @memberof GameService
     * @instance
     * @param {ISendBackPlayerReq} request SendBackPlayerReq message or plain object
     * @param {GameService.sendBackPlayerCallback} callback Node-style callback called with the error, if any, and SendBackPlayerRes
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(GameService.prototype.sendBackPlayer = function sendBackPlayer(request, callback) {
        return this.rpcCall(sendBackPlayer, $root.SendBackPlayerReq, $root.SendBackPlayerRes, request, callback);
    }, "name", { value: "sendBackPlayer" });

    /**
     * Calls sendBackPlayer.
     * @function sendBackPlayer
     * @memberof GameService
     * @instance
     * @param {ISendBackPlayerReq} request SendBackPlayerReq message or plain object
     * @returns {Promise<SendBackPlayerRes>} Promise
     * @variation 2
     */

    return GameService;
})();

$root.RegisterPhasesReq = (function() {

    /**
     * Properties of a RegisterPhasesReq.
     * @exports IRegisterPhasesReq
     * @interface IRegisterPhasesReq
     * @property {Array.<RegisterPhasesReq.IphaseRegInfo>|null} [phases] RegisterPhasesReq phases
     */

    /**
     * Constructs a new RegisterPhasesReq.
     * @exports RegisterPhasesReq
     * @classdesc Represents a RegisterPhasesReq.
     * @implements IRegisterPhasesReq
     * @constructor
     * @param {IRegisterPhasesReq=} [properties] Properties to set
     */
    function RegisterPhasesReq(properties) {
        this.phases = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RegisterPhasesReq phases.
     * @member {Array.<RegisterPhasesReq.IphaseRegInfo>} phases
     * @memberof RegisterPhasesReq
     * @instance
     */
    RegisterPhasesReq.prototype.phases = $util.emptyArray;

    /**
     * Creates a new RegisterPhasesReq instance using the specified properties.
     * @function create
     * @memberof RegisterPhasesReq
     * @static
     * @param {IRegisterPhasesReq=} [properties] Properties to set
     * @returns {RegisterPhasesReq} RegisterPhasesReq instance
     */
    RegisterPhasesReq.create = function create(properties) {
        return new RegisterPhasesReq(properties);
    };

    /**
     * Encodes the specified RegisterPhasesReq message. Does not implicitly {@link RegisterPhasesReq.verify|verify} messages.
     * @function encode
     * @memberof RegisterPhasesReq
     * @static
     * @param {IRegisterPhasesReq} message RegisterPhasesReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RegisterPhasesReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.phases != null && message.phases.length)
            for (var i = 0; i < message.phases.length; ++i)
                $root.RegisterPhasesReq.phaseRegInfo.encode(message.phases[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified RegisterPhasesReq message, length delimited. Does not implicitly {@link RegisterPhasesReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RegisterPhasesReq
     * @static
     * @param {IRegisterPhasesReq} message RegisterPhasesReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RegisterPhasesReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RegisterPhasesReq message from the specified reader or buffer.
     * @function decode
     * @memberof RegisterPhasesReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RegisterPhasesReq} RegisterPhasesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RegisterPhasesReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RegisterPhasesReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.phases && message.phases.length))
                    message.phases = [];
                message.phases.push($root.RegisterPhasesReq.phaseRegInfo.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RegisterPhasesReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RegisterPhasesReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RegisterPhasesReq} RegisterPhasesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RegisterPhasesReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RegisterPhasesReq message.
     * @function verify
     * @memberof RegisterPhasesReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RegisterPhasesReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.phases != null && message.hasOwnProperty("phases")) {
            if (!Array.isArray(message.phases))
                return "phases: array expected";
            for (var i = 0; i < message.phases.length; ++i) {
                var error = $root.RegisterPhasesReq.phaseRegInfo.verify(message.phases[i]);
                if (error)
                    return "phases." + error;
            }
        }
        return null;
    };

    /**
     * Creates a RegisterPhasesReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RegisterPhasesReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RegisterPhasesReq} RegisterPhasesReq
     */
    RegisterPhasesReq.fromObject = function fromObject(object) {
        if (object instanceof $root.RegisterPhasesReq)
            return object;
        var message = new $root.RegisterPhasesReq();
        if (object.phases) {
            if (!Array.isArray(object.phases))
                throw TypeError(".RegisterPhasesReq.phases: array expected");
            message.phases = [];
            for (var i = 0; i < object.phases.length; ++i) {
                if (typeof object.phases[i] !== "object")
                    throw TypeError(".RegisterPhasesReq.phases: object expected");
                message.phases[i] = $root.RegisterPhasesReq.phaseRegInfo.fromObject(object.phases[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a RegisterPhasesReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RegisterPhasesReq
     * @static
     * @param {RegisterPhasesReq} message RegisterPhasesReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RegisterPhasesReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.phases = [];
        if (message.phases && message.phases.length) {
            object.phases = [];
            for (var j = 0; j < message.phases.length; ++j)
                object.phases[j] = $root.RegisterPhasesReq.phaseRegInfo.toObject(message.phases[j], options);
        }
        return object;
    };

    /**
     * Converts this RegisterPhasesReq to JSON.
     * @function toJSON
     * @memberof RegisterPhasesReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RegisterPhasesReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    RegisterPhasesReq.phaseRegInfo = (function() {

        /**
         * Properties of a phaseRegInfo.
         * @memberof RegisterPhasesReq
         * @interface IphaseRegInfo
         * @property {string|null} [namespace] phaseRegInfo namespace
         * @property {string|null} [jsUrl] phaseRegInfo jsUrl
         * @property {number|null} [rpcPort] phaseRegInfo rpcPort
         */

        /**
         * Constructs a new phaseRegInfo.
         * @memberof RegisterPhasesReq
         * @classdesc Represents a phaseRegInfo.
         * @implements IphaseRegInfo
         * @constructor
         * @param {RegisterPhasesReq.IphaseRegInfo=} [properties] Properties to set
         */
        function phaseRegInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * phaseRegInfo namespace.
         * @member {string} namespace
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @instance
         */
        phaseRegInfo.prototype.namespace = "";

        /**
         * phaseRegInfo jsUrl.
         * @member {string} jsUrl
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @instance
         */
        phaseRegInfo.prototype.jsUrl = "";

        /**
         * phaseRegInfo rpcPort.
         * @member {number} rpcPort
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @instance
         */
        phaseRegInfo.prototype.rpcPort = 0;

        /**
         * Creates a new phaseRegInfo instance using the specified properties.
         * @function create
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @static
         * @param {RegisterPhasesReq.IphaseRegInfo=} [properties] Properties to set
         * @returns {RegisterPhasesReq.phaseRegInfo} phaseRegInfo instance
         */
        phaseRegInfo.create = function create(properties) {
            return new phaseRegInfo(properties);
        };

        /**
         * Encodes the specified phaseRegInfo message. Does not implicitly {@link RegisterPhasesReq.phaseRegInfo.verify|verify} messages.
         * @function encode
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @static
         * @param {RegisterPhasesReq.IphaseRegInfo} message phaseRegInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        phaseRegInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.namespace);
            if (message.jsUrl != null && message.hasOwnProperty("jsUrl"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.jsUrl);
            if (message.rpcPort != null && message.hasOwnProperty("rpcPort"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.rpcPort);
            return writer;
        };

        /**
         * Encodes the specified phaseRegInfo message, length delimited. Does not implicitly {@link RegisterPhasesReq.phaseRegInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @static
         * @param {RegisterPhasesReq.IphaseRegInfo} message phaseRegInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        phaseRegInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a phaseRegInfo message from the specified reader or buffer.
         * @function decode
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {RegisterPhasesReq.phaseRegInfo} phaseRegInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        phaseRegInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RegisterPhasesReq.phaseRegInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.namespace = reader.string();
                    break;
                case 2:
                    message.jsUrl = reader.string();
                    break;
                case 3:
                    message.rpcPort = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a phaseRegInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {RegisterPhasesReq.phaseRegInfo} phaseRegInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        phaseRegInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a phaseRegInfo message.
         * @function verify
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        phaseRegInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                if (!$util.isString(message.namespace))
                    return "namespace: string expected";
            if (message.jsUrl != null && message.hasOwnProperty("jsUrl"))
                if (!$util.isString(message.jsUrl))
                    return "jsUrl: string expected";
            if (message.rpcPort != null && message.hasOwnProperty("rpcPort"))
                if (!$util.isInteger(message.rpcPort))
                    return "rpcPort: integer expected";
            return null;
        };

        /**
         * Creates a phaseRegInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {RegisterPhasesReq.phaseRegInfo} phaseRegInfo
         */
        phaseRegInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.RegisterPhasesReq.phaseRegInfo)
                return object;
            var message = new $root.RegisterPhasesReq.phaseRegInfo();
            if (object.namespace != null)
                message.namespace = String(object.namespace);
            if (object.jsUrl != null)
                message.jsUrl = String(object.jsUrl);
            if (object.rpcPort != null)
                message.rpcPort = object.rpcPort | 0;
            return message;
        };

        /**
         * Creates a plain object from a phaseRegInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @static
         * @param {RegisterPhasesReq.phaseRegInfo} message phaseRegInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        phaseRegInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.namespace = "";
                object.jsUrl = "";
                object.rpcPort = 0;
            }
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                object.namespace = message.namespace;
            if (message.jsUrl != null && message.hasOwnProperty("jsUrl"))
                object.jsUrl = message.jsUrl;
            if (message.rpcPort != null && message.hasOwnProperty("rpcPort"))
                object.rpcPort = message.rpcPort;
            return object;
        };

        /**
         * Converts this phaseRegInfo to JSON.
         * @function toJSON
         * @memberof RegisterPhasesReq.phaseRegInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        phaseRegInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return phaseRegInfo;
    })();

    return RegisterPhasesReq;
})();

$root.RegisterPhasesRes = (function() {

    /**
     * Properties of a RegisterPhasesRes.
     * @exports IRegisterPhasesRes
     * @interface IRegisterPhasesRes
     * @property {boolean|null} [success] RegisterPhasesRes success
     * @property {string|null} [waitURL] RegisterPhasesRes waitURL
     */

    /**
     * Constructs a new RegisterPhasesRes.
     * @exports RegisterPhasesRes
     * @classdesc Represents a RegisterPhasesRes.
     * @implements IRegisterPhasesRes
     * @constructor
     * @param {IRegisterPhasesRes=} [properties] Properties to set
     */
    function RegisterPhasesRes(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RegisterPhasesRes success.
     * @member {boolean} success
     * @memberof RegisterPhasesRes
     * @instance
     */
    RegisterPhasesRes.prototype.success = false;

    /**
     * RegisterPhasesRes waitURL.
     * @member {string} waitURL
     * @memberof RegisterPhasesRes
     * @instance
     */
    RegisterPhasesRes.prototype.waitURL = "";

    /**
     * Creates a new RegisterPhasesRes instance using the specified properties.
     * @function create
     * @memberof RegisterPhasesRes
     * @static
     * @param {IRegisterPhasesRes=} [properties] Properties to set
     * @returns {RegisterPhasesRes} RegisterPhasesRes instance
     */
    RegisterPhasesRes.create = function create(properties) {
        return new RegisterPhasesRes(properties);
    };

    /**
     * Encodes the specified RegisterPhasesRes message. Does not implicitly {@link RegisterPhasesRes.verify|verify} messages.
     * @function encode
     * @memberof RegisterPhasesRes
     * @static
     * @param {IRegisterPhasesRes} message RegisterPhasesRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RegisterPhasesRes.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.success != null && message.hasOwnProperty("success"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
        if (message.waitURL != null && message.hasOwnProperty("waitURL"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.waitURL);
        return writer;
    };

    /**
     * Encodes the specified RegisterPhasesRes message, length delimited. Does not implicitly {@link RegisterPhasesRes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RegisterPhasesRes
     * @static
     * @param {IRegisterPhasesRes} message RegisterPhasesRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RegisterPhasesRes.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RegisterPhasesRes message from the specified reader or buffer.
     * @function decode
     * @memberof RegisterPhasesRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RegisterPhasesRes} RegisterPhasesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RegisterPhasesRes.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RegisterPhasesRes();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.success = reader.bool();
                break;
            case 2:
                message.waitURL = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RegisterPhasesRes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RegisterPhasesRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RegisterPhasesRes} RegisterPhasesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RegisterPhasesRes.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RegisterPhasesRes message.
     * @function verify
     * @memberof RegisterPhasesRes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RegisterPhasesRes.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.success != null && message.hasOwnProperty("success"))
            if (typeof message.success !== "boolean")
                return "success: boolean expected";
        if (message.waitURL != null && message.hasOwnProperty("waitURL"))
            if (!$util.isString(message.waitURL))
                return "waitURL: string expected";
        return null;
    };

    /**
     * Creates a RegisterPhasesRes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RegisterPhasesRes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RegisterPhasesRes} RegisterPhasesRes
     */
    RegisterPhasesRes.fromObject = function fromObject(object) {
        if (object instanceof $root.RegisterPhasesRes)
            return object;
        var message = new $root.RegisterPhasesRes();
        if (object.success != null)
            message.success = Boolean(object.success);
        if (object.waitURL != null)
            message.waitURL = String(object.waitURL);
        return message;
    };

    /**
     * Creates a plain object from a RegisterPhasesRes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RegisterPhasesRes
     * @static
     * @param {RegisterPhasesRes} message RegisterPhasesRes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RegisterPhasesRes.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.success = false;
            object.waitURL = "";
        }
        if (message.success != null && message.hasOwnProperty("success"))
            object.success = message.success;
        if (message.waitURL != null && message.hasOwnProperty("waitURL"))
            object.waitURL = message.waitURL;
        return object;
    };

    /**
     * Converts this RegisterPhasesRes to JSON.
     * @function toJSON
     * @memberof RegisterPhasesRes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RegisterPhasesRes.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RegisterPhasesRes;
})();

$root.SendBackPlayerReq = (function() {

    /**
     * Properties of a SendBackPlayerReq.
     * @exports ISendBackPlayerReq
     * @interface ISendBackPlayerReq
     * @property {string|null} [groupId] SendBackPlayerReq groupId
     * @property {string|null} [playUrl] SendBackPlayerReq playUrl
     * @property {string|null} [playerToken] SendBackPlayerReq playerToken
     * @property {string|null} [nextPhaseKey] SendBackPlayerReq nextPhaseKey
     */

    /**
     * Constructs a new SendBackPlayerReq.
     * @exports SendBackPlayerReq
     * @classdesc Represents a SendBackPlayerReq.
     * @implements ISendBackPlayerReq
     * @constructor
     * @param {ISendBackPlayerReq=} [properties] Properties to set
     */
    function SendBackPlayerReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SendBackPlayerReq groupId.
     * @member {string} groupId
     * @memberof SendBackPlayerReq
     * @instance
     */
    SendBackPlayerReq.prototype.groupId = "";

    /**
     * SendBackPlayerReq playUrl.
     * @member {string} playUrl
     * @memberof SendBackPlayerReq
     * @instance
     */
    SendBackPlayerReq.prototype.playUrl = "";

    /**
     * SendBackPlayerReq playerToken.
     * @member {string} playerToken
     * @memberof SendBackPlayerReq
     * @instance
     */
    SendBackPlayerReq.prototype.playerToken = "";

    /**
     * SendBackPlayerReq nextPhaseKey.
     * @member {string} nextPhaseKey
     * @memberof SendBackPlayerReq
     * @instance
     */
    SendBackPlayerReq.prototype.nextPhaseKey = "";

    /**
     * Creates a new SendBackPlayerReq instance using the specified properties.
     * @function create
     * @memberof SendBackPlayerReq
     * @static
     * @param {ISendBackPlayerReq=} [properties] Properties to set
     * @returns {SendBackPlayerReq} SendBackPlayerReq instance
     */
    SendBackPlayerReq.create = function create(properties) {
        return new SendBackPlayerReq(properties);
    };

    /**
     * Encodes the specified SendBackPlayerReq message. Does not implicitly {@link SendBackPlayerReq.verify|verify} messages.
     * @function encode
     * @memberof SendBackPlayerReq
     * @static
     * @param {ISendBackPlayerReq} message SendBackPlayerReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendBackPlayerReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.groupId);
        if (message.playUrl != null && message.hasOwnProperty("playUrl"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.playUrl);
        if (message.playerToken != null && message.hasOwnProperty("playerToken"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.playerToken);
        if (message.nextPhaseKey != null && message.hasOwnProperty("nextPhaseKey"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.nextPhaseKey);
        return writer;
    };

    /**
     * Encodes the specified SendBackPlayerReq message, length delimited. Does not implicitly {@link SendBackPlayerReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SendBackPlayerReq
     * @static
     * @param {ISendBackPlayerReq} message SendBackPlayerReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendBackPlayerReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SendBackPlayerReq message from the specified reader or buffer.
     * @function decode
     * @memberof SendBackPlayerReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SendBackPlayerReq} SendBackPlayerReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendBackPlayerReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SendBackPlayerReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.groupId = reader.string();
                break;
            case 2:
                message.playUrl = reader.string();
                break;
            case 3:
                message.playerToken = reader.string();
                break;
            case 4:
                message.nextPhaseKey = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SendBackPlayerReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SendBackPlayerReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SendBackPlayerReq} SendBackPlayerReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendBackPlayerReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SendBackPlayerReq message.
     * @function verify
     * @memberof SendBackPlayerReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SendBackPlayerReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            if (!$util.isString(message.groupId))
                return "groupId: string expected";
        if (message.playUrl != null && message.hasOwnProperty("playUrl"))
            if (!$util.isString(message.playUrl))
                return "playUrl: string expected";
        if (message.playerToken != null && message.hasOwnProperty("playerToken"))
            if (!$util.isString(message.playerToken))
                return "playerToken: string expected";
        if (message.nextPhaseKey != null && message.hasOwnProperty("nextPhaseKey"))
            if (!$util.isString(message.nextPhaseKey))
                return "nextPhaseKey: string expected";
        return null;
    };

    /**
     * Creates a SendBackPlayerReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SendBackPlayerReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SendBackPlayerReq} SendBackPlayerReq
     */
    SendBackPlayerReq.fromObject = function fromObject(object) {
        if (object instanceof $root.SendBackPlayerReq)
            return object;
        var message = new $root.SendBackPlayerReq();
        if (object.groupId != null)
            message.groupId = String(object.groupId);
        if (object.playUrl != null)
            message.playUrl = String(object.playUrl);
        if (object.playerToken != null)
            message.playerToken = String(object.playerToken);
        if (object.nextPhaseKey != null)
            message.nextPhaseKey = String(object.nextPhaseKey);
        return message;
    };

    /**
     * Creates a plain object from a SendBackPlayerReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SendBackPlayerReq
     * @static
     * @param {SendBackPlayerReq} message SendBackPlayerReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SendBackPlayerReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.groupId = "";
            object.playUrl = "";
            object.playerToken = "";
            object.nextPhaseKey = "";
        }
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            object.groupId = message.groupId;
        if (message.playUrl != null && message.hasOwnProperty("playUrl"))
            object.playUrl = message.playUrl;
        if (message.playerToken != null && message.hasOwnProperty("playerToken"))
            object.playerToken = message.playerToken;
        if (message.nextPhaseKey != null && message.hasOwnProperty("nextPhaseKey"))
            object.nextPhaseKey = message.nextPhaseKey;
        return object;
    };

    /**
     * Converts this SendBackPlayerReq to JSON.
     * @function toJSON
     * @memberof SendBackPlayerReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SendBackPlayerReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SendBackPlayerReq;
})();

$root.SendBackPlayerRes = (function() {

    /**
     * Properties of a SendBackPlayerRes.
     * @exports ISendBackPlayerRes
     * @interface ISendBackPlayerRes
     * @property {string|null} [sendBackUrl] SendBackPlayerRes sendBackUrl
     */

    /**
     * Constructs a new SendBackPlayerRes.
     * @exports SendBackPlayerRes
     * @classdesc Represents a SendBackPlayerRes.
     * @implements ISendBackPlayerRes
     * @constructor
     * @param {ISendBackPlayerRes=} [properties] Properties to set
     */
    function SendBackPlayerRes(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SendBackPlayerRes sendBackUrl.
     * @member {string} sendBackUrl
     * @memberof SendBackPlayerRes
     * @instance
     */
    SendBackPlayerRes.prototype.sendBackUrl = "";

    /**
     * Creates a new SendBackPlayerRes instance using the specified properties.
     * @function create
     * @memberof SendBackPlayerRes
     * @static
     * @param {ISendBackPlayerRes=} [properties] Properties to set
     * @returns {SendBackPlayerRes} SendBackPlayerRes instance
     */
    SendBackPlayerRes.create = function create(properties) {
        return new SendBackPlayerRes(properties);
    };

    /**
     * Encodes the specified SendBackPlayerRes message. Does not implicitly {@link SendBackPlayerRes.verify|verify} messages.
     * @function encode
     * @memberof SendBackPlayerRes
     * @static
     * @param {ISendBackPlayerRes} message SendBackPlayerRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendBackPlayerRes.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sendBackUrl != null && message.hasOwnProperty("sendBackUrl"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sendBackUrl);
        return writer;
    };

    /**
     * Encodes the specified SendBackPlayerRes message, length delimited. Does not implicitly {@link SendBackPlayerRes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SendBackPlayerRes
     * @static
     * @param {ISendBackPlayerRes} message SendBackPlayerRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendBackPlayerRes.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SendBackPlayerRes message from the specified reader or buffer.
     * @function decode
     * @memberof SendBackPlayerRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SendBackPlayerRes} SendBackPlayerRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendBackPlayerRes.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SendBackPlayerRes();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sendBackUrl = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SendBackPlayerRes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SendBackPlayerRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SendBackPlayerRes} SendBackPlayerRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendBackPlayerRes.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SendBackPlayerRes message.
     * @function verify
     * @memberof SendBackPlayerRes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SendBackPlayerRes.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sendBackUrl != null && message.hasOwnProperty("sendBackUrl"))
            if (!$util.isString(message.sendBackUrl))
                return "sendBackUrl: string expected";
        return null;
    };

    /**
     * Creates a SendBackPlayerRes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SendBackPlayerRes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SendBackPlayerRes} SendBackPlayerRes
     */
    SendBackPlayerRes.fromObject = function fromObject(object) {
        if (object instanceof $root.SendBackPlayerRes)
            return object;
        var message = new $root.SendBackPlayerRes();
        if (object.sendBackUrl != null)
            message.sendBackUrl = String(object.sendBackUrl);
        return message;
    };

    /**
     * Creates a plain object from a SendBackPlayerRes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SendBackPlayerRes
     * @static
     * @param {SendBackPlayerRes} message SendBackPlayerRes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SendBackPlayerRes.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.sendBackUrl = "";
        if (message.sendBackUrl != null && message.hasOwnProperty("sendBackUrl"))
            object.sendBackUrl = message.sendBackUrl;
        return object;
    };

    /**
     * Converts this SendBackPlayerRes to JSON.
     * @function toJSON
     * @memberof SendBackPlayerRes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SendBackPlayerRes.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SendBackPlayerRes;
})();

$root.PhaseService = (function() {

    /**
     * Constructs a new PhaseService service.
     * @exports PhaseService
     * @classdesc Represents a PhaseService
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function PhaseService(rpcImpl, requestDelimited, responseDelimited) {
        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
    }

    (PhaseService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = PhaseService;

    /**
     * Creates new PhaseService service using the specified rpc implementation.
     * @function create
     * @memberof PhaseService
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {PhaseService} RPC service. Useful where requests and/or responses are streamed.
     */
    PhaseService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link PhaseService#newPhase}.
     * @memberof PhaseService
     * @typedef newPhaseCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {NewPhaseRes} [response] NewPhaseRes
     */

    /**
     * Calls newPhase.
     * @function newPhase
     * @memberof PhaseService
     * @instance
     * @param {INewPhaseReq} request NewPhaseReq message or plain object
     * @param {PhaseService.newPhaseCallback} callback Node-style callback called with the error, if any, and NewPhaseRes
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(PhaseService.prototype.newPhase = function newPhase(request, callback) {
        return this.rpcCall(newPhase, $root.NewPhaseReq, $root.NewPhaseRes, request, callback);
    }, "name", { value: "newPhase" });

    /**
     * Calls newPhase.
     * @function newPhase
     * @memberof PhaseService
     * @instance
     * @param {INewPhaseReq} request NewPhaseReq message or plain object
     * @returns {Promise<NewPhaseRes>} Promise
     * @variation 2
     */

    return PhaseService;
})();

$root.NewPhaseReq = (function() {

    /**
     * Properties of a NewPhaseReq.
     * @exports INewPhaseReq
     * @interface INewPhaseReq
     * @property {string|null} [groupId] NewPhaseReq groupId
     * @property {string|null} [namespace] NewPhaseReq namespace
     * @property {string|null} [param] NewPhaseReq param
     * @property {string|null} [owner] NewPhaseReq owner
     */

    /**
     * Constructs a new NewPhaseReq.
     * @exports NewPhaseReq
     * @classdesc Represents a NewPhaseReq.
     * @implements INewPhaseReq
     * @constructor
     * @param {INewPhaseReq=} [properties] Properties to set
     */
    function NewPhaseReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NewPhaseReq groupId.
     * @member {string} groupId
     * @memberof NewPhaseReq
     * @instance
     */
    NewPhaseReq.prototype.groupId = "";

    /**
     * NewPhaseReq namespace.
     * @member {string} namespace
     * @memberof NewPhaseReq
     * @instance
     */
    NewPhaseReq.prototype.namespace = "";

    /**
     * NewPhaseReq param.
     * @member {string} param
     * @memberof NewPhaseReq
     * @instance
     */
    NewPhaseReq.prototype.param = "";

    /**
     * NewPhaseReq owner.
     * @member {string} owner
     * @memberof NewPhaseReq
     * @instance
     */
    NewPhaseReq.prototype.owner = "";

    /**
     * Creates a new NewPhaseReq instance using the specified properties.
     * @function create
     * @memberof NewPhaseReq
     * @static
     * @param {INewPhaseReq=} [properties] Properties to set
     * @returns {NewPhaseReq} NewPhaseReq instance
     */
    NewPhaseReq.create = function create(properties) {
        return new NewPhaseReq(properties);
    };

    /**
     * Encodes the specified NewPhaseReq message. Does not implicitly {@link NewPhaseReq.verify|verify} messages.
     * @function encode
     * @memberof NewPhaseReq
     * @static
     * @param {INewPhaseReq} message NewPhaseReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewPhaseReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.groupId);
        if (message.namespace != null && message.hasOwnProperty("namespace"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.namespace);
        if (message.param != null && message.hasOwnProperty("param"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.param);
        if (message.owner != null && message.hasOwnProperty("owner"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.owner);
        return writer;
    };

    /**
     * Encodes the specified NewPhaseReq message, length delimited. Does not implicitly {@link NewPhaseReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NewPhaseReq
     * @static
     * @param {INewPhaseReq} message NewPhaseReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewPhaseReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NewPhaseReq message from the specified reader or buffer.
     * @function decode
     * @memberof NewPhaseReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NewPhaseReq} NewPhaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewPhaseReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NewPhaseReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.groupId = reader.string();
                break;
            case 2:
                message.namespace = reader.string();
                break;
            case 3:
                message.param = reader.string();
                break;
            case 4:
                message.owner = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NewPhaseReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NewPhaseReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NewPhaseReq} NewPhaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewPhaseReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NewPhaseReq message.
     * @function verify
     * @memberof NewPhaseReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NewPhaseReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            if (!$util.isString(message.groupId))
                return "groupId: string expected";
        if (message.namespace != null && message.hasOwnProperty("namespace"))
            if (!$util.isString(message.namespace))
                return "namespace: string expected";
        if (message.param != null && message.hasOwnProperty("param"))
            if (!$util.isString(message.param))
                return "param: string expected";
        if (message.owner != null && message.hasOwnProperty("owner"))
            if (!$util.isString(message.owner))
                return "owner: string expected";
        return null;
    };

    /**
     * Creates a NewPhaseReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NewPhaseReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NewPhaseReq} NewPhaseReq
     */
    NewPhaseReq.fromObject = function fromObject(object) {
        if (object instanceof $root.NewPhaseReq)
            return object;
        var message = new $root.NewPhaseReq();
        if (object.groupId != null)
            message.groupId = String(object.groupId);
        if (object.namespace != null)
            message.namespace = String(object.namespace);
        if (object.param != null)
            message.param = String(object.param);
        if (object.owner != null)
            message.owner = String(object.owner);
        return message;
    };

    /**
     * Creates a plain object from a NewPhaseReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NewPhaseReq
     * @static
     * @param {NewPhaseReq} message NewPhaseReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NewPhaseReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.groupId = "";
            object.namespace = "";
            object.param = "";
            object.owner = "";
        }
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            object.groupId = message.groupId;
        if (message.namespace != null && message.hasOwnProperty("namespace"))
            object.namespace = message.namespace;
        if (message.param != null && message.hasOwnProperty("param"))
            object.param = message.param;
        if (message.owner != null && message.hasOwnProperty("owner"))
            object.owner = message.owner;
        return object;
    };

    /**
     * Converts this NewPhaseReq to JSON.
     * @function toJSON
     * @memberof NewPhaseReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NewPhaseReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NewPhaseReq;
})();

$root.NewPhaseRes = (function() {

    /**
     * Properties of a NewPhaseRes.
     * @exports INewPhaseRes
     * @interface INewPhaseRes
     * @property {string|null} [playUrl] NewPhaseRes playUrl
     */

    /**
     * Constructs a new NewPhaseRes.
     * @exports NewPhaseRes
     * @classdesc Represents a NewPhaseRes.
     * @implements INewPhaseRes
     * @constructor
     * @param {INewPhaseRes=} [properties] Properties to set
     */
    function NewPhaseRes(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NewPhaseRes playUrl.
     * @member {string} playUrl
     * @memberof NewPhaseRes
     * @instance
     */
    NewPhaseRes.prototype.playUrl = "";

    /**
     * Creates a new NewPhaseRes instance using the specified properties.
     * @function create
     * @memberof NewPhaseRes
     * @static
     * @param {INewPhaseRes=} [properties] Properties to set
     * @returns {NewPhaseRes} NewPhaseRes instance
     */
    NewPhaseRes.create = function create(properties) {
        return new NewPhaseRes(properties);
    };

    /**
     * Encodes the specified NewPhaseRes message. Does not implicitly {@link NewPhaseRes.verify|verify} messages.
     * @function encode
     * @memberof NewPhaseRes
     * @static
     * @param {INewPhaseRes} message NewPhaseRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewPhaseRes.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.playUrl != null && message.hasOwnProperty("playUrl"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.playUrl);
        return writer;
    };

    /**
     * Encodes the specified NewPhaseRes message, length delimited. Does not implicitly {@link NewPhaseRes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NewPhaseRes
     * @static
     * @param {INewPhaseRes} message NewPhaseRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewPhaseRes.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NewPhaseRes message from the specified reader or buffer.
     * @function decode
     * @memberof NewPhaseRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NewPhaseRes} NewPhaseRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewPhaseRes.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NewPhaseRes();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.playUrl = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NewPhaseRes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NewPhaseRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NewPhaseRes} NewPhaseRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewPhaseRes.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NewPhaseRes message.
     * @function verify
     * @memberof NewPhaseRes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NewPhaseRes.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.playUrl != null && message.hasOwnProperty("playUrl"))
            if (!$util.isString(message.playUrl))
                return "playUrl: string expected";
        return null;
    };

    /**
     * Creates a NewPhaseRes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NewPhaseRes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NewPhaseRes} NewPhaseRes
     */
    NewPhaseRes.fromObject = function fromObject(object) {
        if (object instanceof $root.NewPhaseRes)
            return object;
        var message = new $root.NewPhaseRes();
        if (object.playUrl != null)
            message.playUrl = String(object.playUrl);
        return message;
    };

    /**
     * Creates a plain object from a NewPhaseRes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NewPhaseRes
     * @static
     * @param {NewPhaseRes} message NewPhaseRes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NewPhaseRes.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.playUrl = "";
        if (message.playUrl != null && message.hasOwnProperty("playUrl"))
            object.playUrl = message.playUrl;
        return object;
    };

    /**
     * Converts this NewPhaseRes to JSON.
     * @function toJSON
     * @memberof NewPhaseRes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NewPhaseRes.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NewPhaseRes;
})();

module.exports = $root;
