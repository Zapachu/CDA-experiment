/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.proto = (function() {

    /**
     * Namespace proto.
     * @exports proto
     * @namespace
     */
    var proto = {};

    proto.ProxyService = (function() {

        /**
         * Constructs a new ProxyService service.
         * @memberof proto
         * @classdesc Represents a ProxyService
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function ProxyService(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (ProxyService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = ProxyService;

        /**
         * Creates new ProxyService service using the specified rpc implementation.
         * @function create
         * @memberof proto.ProxyService
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {ProxyService} RPC service. Useful where requests and/or responses are streamed.
         */
        ProxyService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link proto.ProxyService#registerGame}.
         * @memberof proto.ProxyService
         * @typedef registerGameCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {proto.registerGameRes} [response] registerGameRes
         */

        /**
         * Calls registerGame.
         * @function registerGame
         * @memberof proto.ProxyService
         * @instance
         * @param {proto.IregisterGameReq} request registerGameReq message or plain object
         * @param {proto.ProxyService.registerGameCallback} callback Node-style callback called with the error, if any, and registerGameRes
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ProxyService.prototype.registerGame = function registerGame(request, callback) {
            return this.rpcCall(registerGame, $root.proto.registerGameReq, $root.proto.registerGameRes, request, callback);
        }, "name", { value: "registerGame" });

        /**
         * Calls registerGame.
         * @function registerGame
         * @memberof proto.ProxyService
         * @instance
         * @param {proto.IregisterGameReq} request registerGameReq message or plain object
         * @returns {Promise<proto.registerGameRes>} Promise
         * @variation 2
         */

        return ProxyService;
    })();

    proto.registerGameReq = (function() {

        /**
         * Properties of a registerGameReq.
         * @memberof proto
         * @interface IregisterGameReq
         * @property {string|null} [namespace] registerGameReq namespace
         * @property {string|null} [port] registerGameReq port
         * @property {string|null} [rpcPort] registerGameReq rpcPort
         */

        /**
         * Constructs a new registerGameReq.
         * @memberof proto
         * @classdesc Represents a registerGameReq.
         * @implements IregisterGameReq
         * @constructor
         * @param {proto.IregisterGameReq=} [properties] Properties to set
         */
        function registerGameReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * registerGameReq namespace.
         * @member {string} namespace
         * @memberof proto.registerGameReq
         * @instance
         */
        registerGameReq.prototype.namespace = "";

        /**
         * registerGameReq port.
         * @member {string} port
         * @memberof proto.registerGameReq
         * @instance
         */
        registerGameReq.prototype.port = "";

        /**
         * registerGameReq rpcPort.
         * @member {string} rpcPort
         * @memberof proto.registerGameReq
         * @instance
         */
        registerGameReq.prototype.rpcPort = "";

        /**
         * Creates a new registerGameReq instance using the specified properties.
         * @function create
         * @memberof proto.registerGameReq
         * @static
         * @param {proto.IregisterGameReq=} [properties] Properties to set
         * @returns {proto.registerGameReq} registerGameReq instance
         */
        registerGameReq.create = function create(properties) {
            return new registerGameReq(properties);
        };

        /**
         * Encodes the specified registerGameReq message. Does not implicitly {@link proto.registerGameReq.verify|verify} messages.
         * @function encode
         * @memberof proto.registerGameReq
         * @static
         * @param {proto.IregisterGameReq} message registerGameReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        registerGameReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.namespace);
            if (message.port != null && message.hasOwnProperty("port"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.port);
            if (message.rpcPort != null && message.hasOwnProperty("rpcPort"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.rpcPort);
            return writer;
        };

        /**
         * Encodes the specified registerGameReq message, length delimited. Does not implicitly {@link proto.registerGameReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.registerGameReq
         * @static
         * @param {proto.IregisterGameReq} message registerGameReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        registerGameReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a registerGameReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto.registerGameReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.registerGameReq} registerGameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        registerGameReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.registerGameReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.namespace = reader.string();
                    break;
                case 2:
                    message.port = reader.string();
                    break;
                case 3:
                    message.rpcPort = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a registerGameReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.registerGameReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.registerGameReq} registerGameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        registerGameReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a registerGameReq message.
         * @function verify
         * @memberof proto.registerGameReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        registerGameReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                if (!$util.isString(message.namespace))
                    return "namespace: string expected";
            if (message.port != null && message.hasOwnProperty("port"))
                if (!$util.isString(message.port))
                    return "port: string expected";
            if (message.rpcPort != null && message.hasOwnProperty("rpcPort"))
                if (!$util.isString(message.rpcPort))
                    return "rpcPort: string expected";
            return null;
        };

        /**
         * Creates a registerGameReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.registerGameReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.registerGameReq} registerGameReq
         */
        registerGameReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.registerGameReq)
                return object;
            var message = new $root.proto.registerGameReq();
            if (object.namespace != null)
                message.namespace = String(object.namespace);
            if (object.port != null)
                message.port = String(object.port);
            if (object.rpcPort != null)
                message.rpcPort = String(object.rpcPort);
            return message;
        };

        /**
         * Creates a plain object from a registerGameReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.registerGameReq
         * @static
         * @param {proto.registerGameReq} message registerGameReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        registerGameReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.namespace = "";
                object.port = "";
                object.rpcPort = "";
            }
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                object.namespace = message.namespace;
            if (message.port != null && message.hasOwnProperty("port"))
                object.port = message.port;
            if (message.rpcPort != null && message.hasOwnProperty("rpcPort"))
                object.rpcPort = message.rpcPort;
            return object;
        };

        /**
         * Converts this registerGameReq to JSON.
         * @function toJSON
         * @memberof proto.registerGameReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        registerGameReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return registerGameReq;
    })();

    proto.registerGameRes = (function() {

        /**
         * Properties of a registerGameRes.
         * @memberof proto
         * @interface IregisterGameRes
         * @property {boolean|null} [result] registerGameRes result
         */

        /**
         * Constructs a new registerGameRes.
         * @memberof proto
         * @classdesc Represents a registerGameRes.
         * @implements IregisterGameRes
         * @constructor
         * @param {proto.IregisterGameRes=} [properties] Properties to set
         */
        function registerGameRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * registerGameRes result.
         * @member {boolean} result
         * @memberof proto.registerGameRes
         * @instance
         */
        registerGameRes.prototype.result = false;

        /**
         * Creates a new registerGameRes instance using the specified properties.
         * @function create
         * @memberof proto.registerGameRes
         * @static
         * @param {proto.IregisterGameRes=} [properties] Properties to set
         * @returns {proto.registerGameRes} registerGameRes instance
         */
        registerGameRes.create = function create(properties) {
            return new registerGameRes(properties);
        };

        /**
         * Encodes the specified registerGameRes message. Does not implicitly {@link proto.registerGameRes.verify|verify} messages.
         * @function encode
         * @memberof proto.registerGameRes
         * @static
         * @param {proto.IregisterGameRes} message registerGameRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        registerGameRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.result != null && message.hasOwnProperty("result"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.result);
            return writer;
        };

        /**
         * Encodes the specified registerGameRes message, length delimited. Does not implicitly {@link proto.registerGameRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.registerGameRes
         * @static
         * @param {proto.IregisterGameRes} message registerGameRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        registerGameRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a registerGameRes message from the specified reader or buffer.
         * @function decode
         * @memberof proto.registerGameRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.registerGameRes} registerGameRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        registerGameRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.registerGameRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a registerGameRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.registerGameRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.registerGameRes} registerGameRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        registerGameRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a registerGameRes message.
         * @function verify
         * @memberof proto.registerGameRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        registerGameRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (typeof message.result !== "boolean")
                    return "result: boolean expected";
            return null;
        };

        /**
         * Creates a registerGameRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.registerGameRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.registerGameRes} registerGameRes
         */
        registerGameRes.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.registerGameRes)
                return object;
            var message = new $root.proto.registerGameRes();
            if (object.result != null)
                message.result = Boolean(object.result);
            return message;
        };

        /**
         * Creates a plain object from a registerGameRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.registerGameRes
         * @static
         * @param {proto.registerGameRes} message registerGameRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        registerGameRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = false;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            return object;
        };

        /**
         * Converts this registerGameRes to JSON.
         * @function toJSON
         * @memberof proto.registerGameRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        registerGameRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return registerGameRes;
    })();

    return proto;
})();

module.exports = $root;
