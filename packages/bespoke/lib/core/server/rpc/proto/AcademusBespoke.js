/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.AcademusBespoke = (function() {

    /**
     * Constructs a new AcademusBespoke service.
     * @exports AcademusBespoke
     * @classdesc Represents an AcademusBespoke
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function AcademusBespoke(rpcImpl, requestDelimited, responseDelimited) {
        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
    }

    (AcademusBespoke.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = AcademusBespoke;

    /**
     * Creates new AcademusBespoke service using the specified rpc implementation.
     * @function create
     * @memberof AcademusBespoke
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {AcademusBespoke} RPC service. Useful where requests and/or responses are streamed.
     */
    AcademusBespoke.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link AcademusBespoke#checkAuthority}.
     * @memberof AcademusBespoke
     * @typedef checkAuthorityCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {CheckAuthorityRes} [response] CheckAuthorityRes
     */

    /**
     * Calls checkAuthority.
     * @function checkAuthority
     * @memberof AcademusBespoke
     * @instance
     * @param {ICheckAuthorityReq} request CheckAuthorityReq message or plain object
     * @param {AcademusBespoke.checkAuthorityCallback} callback Node-style callback called with the error, if any, and CheckAuthorityRes
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(AcademusBespoke.prototype.checkAuthority = function checkAuthority(request, callback) {
        return this.rpcCall(checkAuthority, $root.CheckAuthorityReq, $root.CheckAuthorityRes, request, callback);
    }, "name", { value: "checkAuthority" });

    /**
     * Calls checkAuthority.
     * @function checkAuthority
     * @memberof AcademusBespoke
     * @instance
     * @param {ICheckAuthorityReq} request CheckAuthorityReq message or plain object
     * @returns {Promise<CheckAuthorityRes>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link AcademusBespoke#checkShareCode}.
     * @memberof AcademusBespoke
     * @typedef checkShareCodeCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {CheckShareCodeRes} [response] CheckShareCodeRes
     */

    /**
     * Calls checkShareCode.
     * @function checkShareCode
     * @memberof AcademusBespoke
     * @instance
     * @param {ICheckShareCodeReq} request CheckShareCodeReq message or plain object
     * @param {AcademusBespoke.checkShareCodeCallback} callback Node-style callback called with the error, if any, and CheckShareCodeRes
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(AcademusBespoke.prototype.checkShareCode = function checkShareCode(request, callback) {
        return this.rpcCall(checkShareCode, $root.CheckShareCodeReq, $root.CheckShareCodeRes, request, callback);
    }, "name", { value: "checkShareCode" });

    /**
     * Calls checkShareCode.
     * @function checkShareCode
     * @memberof AcademusBespoke
     * @instance
     * @param {ICheckShareCodeReq} request CheckShareCodeReq message or plain object
     * @returns {Promise<CheckShareCodeRes>} Promise
     * @variation 2
     */

    return AcademusBespoke;
})();

$root.CheckAuthorityReq = (function() {

    /**
     * Properties of a CheckAuthorityReq.
     * @exports ICheckAuthorityReq
     * @interface ICheckAuthorityReq
     * @property {string|null} [userId] CheckAuthorityReq userId
     * @property {string|null} [namespace] CheckAuthorityReq namespace
     */

    /**
     * Constructs a new CheckAuthorityReq.
     * @exports CheckAuthorityReq
     * @classdesc Represents a CheckAuthorityReq.
     * @implements ICheckAuthorityReq
     * @constructor
     * @param {ICheckAuthorityReq=} [properties] Properties to set
     */
    function CheckAuthorityReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CheckAuthorityReq userId.
     * @member {string} userId
     * @memberof CheckAuthorityReq
     * @instance
     */
    CheckAuthorityReq.prototype.userId = "";

    /**
     * CheckAuthorityReq namespace.
     * @member {string} namespace
     * @memberof CheckAuthorityReq
     * @instance
     */
    CheckAuthorityReq.prototype.namespace = "";

    /**
     * Creates a new CheckAuthorityReq instance using the specified properties.
     * @function create
     * @memberof CheckAuthorityReq
     * @static
     * @param {ICheckAuthorityReq=} [properties] Properties to set
     * @returns {CheckAuthorityReq} CheckAuthorityReq instance
     */
    CheckAuthorityReq.create = function create(properties) {
        return new CheckAuthorityReq(properties);
    };

    /**
     * Encodes the specified CheckAuthorityReq message. Does not implicitly {@link CheckAuthorityReq.verify|verify} messages.
     * @function encode
     * @memberof CheckAuthorityReq
     * @static
     * @param {ICheckAuthorityReq} message CheckAuthorityReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CheckAuthorityReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.userId != null && message.hasOwnProperty("userId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
        if (message.namespace != null && message.hasOwnProperty("namespace"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.namespace);
        return writer;
    };

    /**
     * Encodes the specified CheckAuthorityReq message, length delimited. Does not implicitly {@link CheckAuthorityReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CheckAuthorityReq
     * @static
     * @param {ICheckAuthorityReq} message CheckAuthorityReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CheckAuthorityReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CheckAuthorityReq message from the specified reader or buffer.
     * @function decode
     * @memberof CheckAuthorityReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CheckAuthorityReq} CheckAuthorityReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CheckAuthorityReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CheckAuthorityReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.userId = reader.string();
                break;
            case 2:
                message.namespace = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CheckAuthorityReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CheckAuthorityReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CheckAuthorityReq} CheckAuthorityReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CheckAuthorityReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CheckAuthorityReq message.
     * @function verify
     * @memberof CheckAuthorityReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CheckAuthorityReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.userId != null && message.hasOwnProperty("userId"))
            if (!$util.isString(message.userId))
                return "userId: string expected";
        if (message.namespace != null && message.hasOwnProperty("namespace"))
            if (!$util.isString(message.namespace))
                return "namespace: string expected";
        return null;
    };

    /**
     * Creates a CheckAuthorityReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CheckAuthorityReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CheckAuthorityReq} CheckAuthorityReq
     */
    CheckAuthorityReq.fromObject = function fromObject(object) {
        if (object instanceof $root.CheckAuthorityReq)
            return object;
        var message = new $root.CheckAuthorityReq();
        if (object.userId != null)
            message.userId = String(object.userId);
        if (object.namespace != null)
            message.namespace = String(object.namespace);
        return message;
    };

    /**
     * Creates a plain object from a CheckAuthorityReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CheckAuthorityReq
     * @static
     * @param {CheckAuthorityReq} message CheckAuthorityReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CheckAuthorityReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.userId = "";
            object.namespace = "";
        }
        if (message.userId != null && message.hasOwnProperty("userId"))
            object.userId = message.userId;
        if (message.namespace != null && message.hasOwnProperty("namespace"))
            object.namespace = message.namespace;
        return object;
    };

    /**
     * Converts this CheckAuthorityReq to JSON.
     * @function toJSON
     * @memberof CheckAuthorityReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CheckAuthorityReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CheckAuthorityReq;
})();

$root.CheckAuthorityRes = (function() {

    /**
     * Properties of a CheckAuthorityRes.
     * @exports ICheckAuthorityRes
     * @interface ICheckAuthorityRes
     * @property {boolean|null} [result] CheckAuthorityRes result
     */

    /**
     * Constructs a new CheckAuthorityRes.
     * @exports CheckAuthorityRes
     * @classdesc Represents a CheckAuthorityRes.
     * @implements ICheckAuthorityRes
     * @constructor
     * @param {ICheckAuthorityRes=} [properties] Properties to set
     */
    function CheckAuthorityRes(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CheckAuthorityRes result.
     * @member {boolean} result
     * @memberof CheckAuthorityRes
     * @instance
     */
    CheckAuthorityRes.prototype.result = false;

    /**
     * Creates a new CheckAuthorityRes instance using the specified properties.
     * @function create
     * @memberof CheckAuthorityRes
     * @static
     * @param {ICheckAuthorityRes=} [properties] Properties to set
     * @returns {CheckAuthorityRes} CheckAuthorityRes instance
     */
    CheckAuthorityRes.create = function create(properties) {
        return new CheckAuthorityRes(properties);
    };

    /**
     * Encodes the specified CheckAuthorityRes message. Does not implicitly {@link CheckAuthorityRes.verify|verify} messages.
     * @function encode
     * @memberof CheckAuthorityRes
     * @static
     * @param {ICheckAuthorityRes} message CheckAuthorityRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CheckAuthorityRes.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.result != null && message.hasOwnProperty("result"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.result);
        return writer;
    };

    /**
     * Encodes the specified CheckAuthorityRes message, length delimited. Does not implicitly {@link CheckAuthorityRes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CheckAuthorityRes
     * @static
     * @param {ICheckAuthorityRes} message CheckAuthorityRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CheckAuthorityRes.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CheckAuthorityRes message from the specified reader or buffer.
     * @function decode
     * @memberof CheckAuthorityRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CheckAuthorityRes} CheckAuthorityRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CheckAuthorityRes.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CheckAuthorityRes();
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
     * Decodes a CheckAuthorityRes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CheckAuthorityRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CheckAuthorityRes} CheckAuthorityRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CheckAuthorityRes.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CheckAuthorityRes message.
     * @function verify
     * @memberof CheckAuthorityRes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CheckAuthorityRes.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.result != null && message.hasOwnProperty("result"))
            if (typeof message.result !== "boolean")
                return "result: boolean expected";
        return null;
    };

    /**
     * Creates a CheckAuthorityRes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CheckAuthorityRes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CheckAuthorityRes} CheckAuthorityRes
     */
    CheckAuthorityRes.fromObject = function fromObject(object) {
        if (object instanceof $root.CheckAuthorityRes)
            return object;
        var message = new $root.CheckAuthorityRes();
        if (object.result != null)
            message.result = Boolean(object.result);
        return message;
    };

    /**
     * Creates a plain object from a CheckAuthorityRes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CheckAuthorityRes
     * @static
     * @param {CheckAuthorityRes} message CheckAuthorityRes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CheckAuthorityRes.toObject = function toObject(message, options) {
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
     * Converts this CheckAuthorityRes to JSON.
     * @function toJSON
     * @memberof CheckAuthorityRes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CheckAuthorityRes.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CheckAuthorityRes;
})();

$root.CheckShareCodeReq = (function() {

    /**
     * Properties of a CheckShareCodeReq.
     * @exports ICheckShareCodeReq
     * @interface ICheckShareCodeReq
     * @property {string|null} [code] CheckShareCodeReq code
     */

    /**
     * Constructs a new CheckShareCodeReq.
     * @exports CheckShareCodeReq
     * @classdesc Represents a CheckShareCodeReq.
     * @implements ICheckShareCodeReq
     * @constructor
     * @param {ICheckShareCodeReq=} [properties] Properties to set
     */
    function CheckShareCodeReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CheckShareCodeReq code.
     * @member {string} code
     * @memberof CheckShareCodeReq
     * @instance
     */
    CheckShareCodeReq.prototype.code = "";

    /**
     * Creates a new CheckShareCodeReq instance using the specified properties.
     * @function create
     * @memberof CheckShareCodeReq
     * @static
     * @param {ICheckShareCodeReq=} [properties] Properties to set
     * @returns {CheckShareCodeReq} CheckShareCodeReq instance
     */
    CheckShareCodeReq.create = function create(properties) {
        return new CheckShareCodeReq(properties);
    };

    /**
     * Encodes the specified CheckShareCodeReq message. Does not implicitly {@link CheckShareCodeReq.verify|verify} messages.
     * @function encode
     * @memberof CheckShareCodeReq
     * @static
     * @param {ICheckShareCodeReq} message CheckShareCodeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CheckShareCodeReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.code != null && message.hasOwnProperty("code"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.code);
        return writer;
    };

    /**
     * Encodes the specified CheckShareCodeReq message, length delimited. Does not implicitly {@link CheckShareCodeReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CheckShareCodeReq
     * @static
     * @param {ICheckShareCodeReq} message CheckShareCodeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CheckShareCodeReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CheckShareCodeReq message from the specified reader or buffer.
     * @function decode
     * @memberof CheckShareCodeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CheckShareCodeReq} CheckShareCodeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CheckShareCodeReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CheckShareCodeReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.code = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CheckShareCodeReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CheckShareCodeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CheckShareCodeReq} CheckShareCodeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CheckShareCodeReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CheckShareCodeReq message.
     * @function verify
     * @memberof CheckShareCodeReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CheckShareCodeReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.code != null && message.hasOwnProperty("code"))
            if (!$util.isString(message.code))
                return "code: string expected";
        return null;
    };

    /**
     * Creates a CheckShareCodeReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CheckShareCodeReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CheckShareCodeReq} CheckShareCodeReq
     */
    CheckShareCodeReq.fromObject = function fromObject(object) {
        if (object instanceof $root.CheckShareCodeReq)
            return object;
        var message = new $root.CheckShareCodeReq();
        if (object.code != null)
            message.code = String(object.code);
        return message;
    };

    /**
     * Creates a plain object from a CheckShareCodeReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CheckShareCodeReq
     * @static
     * @param {CheckShareCodeReq} message CheckShareCodeReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CheckShareCodeReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.code = "";
        if (message.code != null && message.hasOwnProperty("code"))
            object.code = message.code;
        return object;
    };

    /**
     * Converts this CheckShareCodeReq to JSON.
     * @function toJSON
     * @memberof CheckShareCodeReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CheckShareCodeReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CheckShareCodeReq;
})();

$root.CheckShareCodeRes = (function() {

    /**
     * Properties of a CheckShareCodeRes.
     * @exports ICheckShareCodeRes
     * @interface ICheckShareCodeRes
     * @property {string|null} [gameId] CheckShareCodeRes gameId
     */

    /**
     * Constructs a new CheckShareCodeRes.
     * @exports CheckShareCodeRes
     * @classdesc Represents a CheckShareCodeRes.
     * @implements ICheckShareCodeRes
     * @constructor
     * @param {ICheckShareCodeRes=} [properties] Properties to set
     */
    function CheckShareCodeRes(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CheckShareCodeRes gameId.
     * @member {string} gameId
     * @memberof CheckShareCodeRes
     * @instance
     */
    CheckShareCodeRes.prototype.gameId = "";

    /**
     * Creates a new CheckShareCodeRes instance using the specified properties.
     * @function create
     * @memberof CheckShareCodeRes
     * @static
     * @param {ICheckShareCodeRes=} [properties] Properties to set
     * @returns {CheckShareCodeRes} CheckShareCodeRes instance
     */
    CheckShareCodeRes.create = function create(properties) {
        return new CheckShareCodeRes(properties);
    };

    /**
     * Encodes the specified CheckShareCodeRes message. Does not implicitly {@link CheckShareCodeRes.verify|verify} messages.
     * @function encode
     * @memberof CheckShareCodeRes
     * @static
     * @param {ICheckShareCodeRes} message CheckShareCodeRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CheckShareCodeRes.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.gameId != null && message.hasOwnProperty("gameId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.gameId);
        return writer;
    };

    /**
     * Encodes the specified CheckShareCodeRes message, length delimited. Does not implicitly {@link CheckShareCodeRes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CheckShareCodeRes
     * @static
     * @param {ICheckShareCodeRes} message CheckShareCodeRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CheckShareCodeRes.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CheckShareCodeRes message from the specified reader or buffer.
     * @function decode
     * @memberof CheckShareCodeRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CheckShareCodeRes} CheckShareCodeRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CheckShareCodeRes.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CheckShareCodeRes();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.gameId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CheckShareCodeRes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CheckShareCodeRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CheckShareCodeRes} CheckShareCodeRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CheckShareCodeRes.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CheckShareCodeRes message.
     * @function verify
     * @memberof CheckShareCodeRes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CheckShareCodeRes.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.gameId != null && message.hasOwnProperty("gameId"))
            if (!$util.isString(message.gameId))
                return "gameId: string expected";
        return null;
    };

    /**
     * Creates a CheckShareCodeRes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CheckShareCodeRes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CheckShareCodeRes} CheckShareCodeRes
     */
    CheckShareCodeRes.fromObject = function fromObject(object) {
        if (object instanceof $root.CheckShareCodeRes)
            return object;
        var message = new $root.CheckShareCodeRes();
        if (object.gameId != null)
            message.gameId = String(object.gameId);
        return message;
    };

    /**
     * Creates a plain object from a CheckShareCodeRes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CheckShareCodeRes
     * @static
     * @param {CheckShareCodeRes} message CheckShareCodeRes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CheckShareCodeRes.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.gameId = "";
        if (message.gameId != null && message.hasOwnProperty("gameId"))
            object.gameId = message.gameId;
        return object;
    };

    /**
     * Converts this CheckShareCodeRes to JSON.
     * @function toJSON
     * @memberof CheckShareCodeRes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CheckShareCodeRes.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CheckShareCodeRes;
})();

module.exports = $root;
