/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

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
     * Callback as used by {@link ElfService#getActivePhases}.
     * @memberof ElfService
     * @typedef getActivePhasesCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {GetActivePhaseRes} [response] GetActivePhaseRes
     */

    /**
     * Calls getActivePhases.
     * @function getActivePhases
     * @memberof ElfService
     * @instance
     * @param {IGetActivePhaseReq} request GetActivePhaseReq message or plain object
     * @param {ElfService.getActivePhasesCallback} callback Node-style callback called with the error, if any, and GetActivePhaseRes
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(ElfService.prototype.getActivePhases = function getActivePhases(request, callback) {
        return this.rpcCall(getActivePhases, $root.GetActivePhaseReq, $root.GetActivePhaseRes, request, callback);
    }, "name", { value: "getActivePhases" });

    /**
     * Calls getActivePhases.
     * @function getActivePhases
     * @memberof ElfService
     * @instance
     * @param {IGetActivePhaseReq} request GetActivePhaseReq message or plain object
     * @returns {Promise<GetActivePhaseRes>} Promise
     * @variation 2
     */

    return ElfService;
})();

$root.GetActivePhaseReq = (function() {

    /**
     * Properties of a GetActivePhaseReq.
     * @exports IGetActivePhaseReq
     * @interface IGetActivePhaseReq
     */

    /**
     * Constructs a new GetActivePhaseReq.
     * @exports GetActivePhaseReq
     * @classdesc Represents a GetActivePhaseReq.
     * @implements IGetActivePhaseReq
     * @constructor
     * @param {IGetActivePhaseReq=} [properties] Properties to set
     */
    function GetActivePhaseReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new GetActivePhaseReq instance using the specified properties.
     * @function create
     * @memberof GetActivePhaseReq
     * @static
     * @param {IGetActivePhaseReq=} [properties] Properties to set
     * @returns {GetActivePhaseReq} GetActivePhaseReq instance
     */
    GetActivePhaseReq.create = function create(properties) {
        return new GetActivePhaseReq(properties);
    };

    /**
     * Encodes the specified GetActivePhaseReq message. Does not implicitly {@link GetActivePhaseReq.verify|verify} messages.
     * @function encode
     * @memberof GetActivePhaseReq
     * @static
     * @param {IGetActivePhaseReq} message GetActivePhaseReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetActivePhaseReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified GetActivePhaseReq message, length delimited. Does not implicitly {@link GetActivePhaseReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetActivePhaseReq
     * @static
     * @param {IGetActivePhaseReq} message GetActivePhaseReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetActivePhaseReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetActivePhaseReq message from the specified reader or buffer.
     * @function decode
     * @memberof GetActivePhaseReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetActivePhaseReq} GetActivePhaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetActivePhaseReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetActivePhaseReq();
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
     * Decodes a GetActivePhaseReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetActivePhaseReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetActivePhaseReq} GetActivePhaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetActivePhaseReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetActivePhaseReq message.
     * @function verify
     * @memberof GetActivePhaseReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetActivePhaseReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a GetActivePhaseReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetActivePhaseReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetActivePhaseReq} GetActivePhaseReq
     */
    GetActivePhaseReq.fromObject = function fromObject(object) {
        if (object instanceof $root.GetActivePhaseReq)
            return object;
        return new $root.GetActivePhaseReq();
    };

    /**
     * Creates a plain object from a GetActivePhaseReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetActivePhaseReq
     * @static
     * @param {GetActivePhaseReq} message GetActivePhaseReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetActivePhaseReq.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this GetActivePhaseReq to JSON.
     * @function toJSON
     * @memberof GetActivePhaseReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetActivePhaseReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetActivePhaseReq;
})();

$root.GetActivePhaseRes = (function() {

    /**
     * Properties of a GetActivePhaseRes.
     * @exports IGetActivePhaseRes
     * @interface IGetActivePhaseRes
     * @property {Array.<GetActivePhaseRes.IPhase>|null} [phases] GetActivePhaseRes phases
     */

    /**
     * Constructs a new GetActivePhaseRes.
     * @exports GetActivePhaseRes
     * @classdesc Represents a GetActivePhaseRes.
     * @implements IGetActivePhaseRes
     * @constructor
     * @param {IGetActivePhaseRes=} [properties] Properties to set
     */
    function GetActivePhaseRes(properties) {
        this.phases = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetActivePhaseRes phases.
     * @member {Array.<GetActivePhaseRes.IPhase>} phases
     * @memberof GetActivePhaseRes
     * @instance
     */
    GetActivePhaseRes.prototype.phases = $util.emptyArray;

    /**
     * Creates a new GetActivePhaseRes instance using the specified properties.
     * @function create
     * @memberof GetActivePhaseRes
     * @static
     * @param {IGetActivePhaseRes=} [properties] Properties to set
     * @returns {GetActivePhaseRes} GetActivePhaseRes instance
     */
    GetActivePhaseRes.create = function create(properties) {
        return new GetActivePhaseRes(properties);
    };

    /**
     * Encodes the specified GetActivePhaseRes message. Does not implicitly {@link GetActivePhaseRes.verify|verify} messages.
     * @function encode
     * @memberof GetActivePhaseRes
     * @static
     * @param {IGetActivePhaseRes} message GetActivePhaseRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetActivePhaseRes.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.phases != null && message.phases.length)
            for (var i = 0; i < message.phases.length; ++i)
                $root.GetActivePhaseRes.Phase.encode(message.phases[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GetActivePhaseRes message, length delimited. Does not implicitly {@link GetActivePhaseRes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetActivePhaseRes
     * @static
     * @param {IGetActivePhaseRes} message GetActivePhaseRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetActivePhaseRes.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetActivePhaseRes message from the specified reader or buffer.
     * @function decode
     * @memberof GetActivePhaseRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetActivePhaseRes} GetActivePhaseRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetActivePhaseRes.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetActivePhaseRes();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.phases && message.phases.length))
                    message.phases = [];
                message.phases.push($root.GetActivePhaseRes.Phase.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetActivePhaseRes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetActivePhaseRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetActivePhaseRes} GetActivePhaseRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetActivePhaseRes.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetActivePhaseRes message.
     * @function verify
     * @memberof GetActivePhaseRes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetActivePhaseRes.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.phases != null && message.hasOwnProperty("phases")) {
            if (!Array.isArray(message.phases))
                return "phases: array expected";
            for (var i = 0; i < message.phases.length; ++i) {
                var error = $root.GetActivePhaseRes.Phase.verify(message.phases[i]);
                if (error)
                    return "phases." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GetActivePhaseRes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetActivePhaseRes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetActivePhaseRes} GetActivePhaseRes
     */
    GetActivePhaseRes.fromObject = function fromObject(object) {
        if (object instanceof $root.GetActivePhaseRes)
            return object;
        var message = new $root.GetActivePhaseRes();
        if (object.phases) {
            if (!Array.isArray(object.phases))
                throw TypeError(".GetActivePhaseRes.phases: array expected");
            message.phases = [];
            for (var i = 0; i < object.phases.length; ++i) {
                if (typeof object.phases[i] !== "object")
                    throw TypeError(".GetActivePhaseRes.phases: object expected");
                message.phases[i] = $root.GetActivePhaseRes.Phase.fromObject(object.phases[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GetActivePhaseRes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetActivePhaseRes
     * @static
     * @param {GetActivePhaseRes} message GetActivePhaseRes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetActivePhaseRes.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.phases = [];
        if (message.phases && message.phases.length) {
            object.phases = [];
            for (var j = 0; j < message.phases.length; ++j)
                object.phases[j] = $root.GetActivePhaseRes.Phase.toObject(message.phases[j], options);
        }
        return object;
    };

    /**
     * Converts this GetActivePhaseRes to JSON.
     * @function toJSON
     * @memberof GetActivePhaseRes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetActivePhaseRes.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    GetActivePhaseRes.Phase = (function() {

        /**
         * Properties of a Phase.
         * @memberof GetActivePhaseRes
         * @interface IPhase
         * @property {string|null} [namespace] Phase namespace
         * @property {string|null} [type] Phase type
         */

        /**
         * Constructs a new Phase.
         * @memberof GetActivePhaseRes
         * @classdesc Represents a Phase.
         * @implements IPhase
         * @constructor
         * @param {GetActivePhaseRes.IPhase=} [properties] Properties to set
         */
        function Phase(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Phase namespace.
         * @member {string} namespace
         * @memberof GetActivePhaseRes.Phase
         * @instance
         */
        Phase.prototype.namespace = "";

        /**
         * Phase type.
         * @member {string} type
         * @memberof GetActivePhaseRes.Phase
         * @instance
         */
        Phase.prototype.type = "";

        /**
         * Creates a new Phase instance using the specified properties.
         * @function create
         * @memberof GetActivePhaseRes.Phase
         * @static
         * @param {GetActivePhaseRes.IPhase=} [properties] Properties to set
         * @returns {GetActivePhaseRes.Phase} Phase instance
         */
        Phase.create = function create(properties) {
            return new Phase(properties);
        };

        /**
         * Encodes the specified Phase message. Does not implicitly {@link GetActivePhaseRes.Phase.verify|verify} messages.
         * @function encode
         * @memberof GetActivePhaseRes.Phase
         * @static
         * @param {GetActivePhaseRes.IPhase} message Phase message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Phase.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.namespace);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
            return writer;
        };

        /**
         * Encodes the specified Phase message, length delimited. Does not implicitly {@link GetActivePhaseRes.Phase.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GetActivePhaseRes.Phase
         * @static
         * @param {GetActivePhaseRes.IPhase} message Phase message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Phase.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Phase message from the specified reader or buffer.
         * @function decode
         * @memberof GetActivePhaseRes.Phase
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GetActivePhaseRes.Phase} Phase
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Phase.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetActivePhaseRes.Phase();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.namespace = reader.string();
                    break;
                case 2:
                    message.type = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Phase message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GetActivePhaseRes.Phase
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GetActivePhaseRes.Phase} Phase
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Phase.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Phase message.
         * @function verify
         * @memberof GetActivePhaseRes.Phase
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Phase.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                if (!$util.isString(message.namespace))
                    return "namespace: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            return null;
        };

        /**
         * Creates a Phase message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GetActivePhaseRes.Phase
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GetActivePhaseRes.Phase} Phase
         */
        Phase.fromObject = function fromObject(object) {
            if (object instanceof $root.GetActivePhaseRes.Phase)
                return object;
            var message = new $root.GetActivePhaseRes.Phase();
            if (object.namespace != null)
                message.namespace = String(object.namespace);
            if (object.type != null)
                message.type = String(object.type);
            return message;
        };

        /**
         * Creates a plain object from a Phase message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GetActivePhaseRes.Phase
         * @static
         * @param {GetActivePhaseRes.Phase} message Phase
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Phase.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.namespace = "";
                object.type = "";
            }
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                object.namespace = message.namespace;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            return object;
        };

        /**
         * Converts this Phase to JSON.
         * @function toJSON
         * @memberof GetActivePhaseRes.Phase
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Phase.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Phase;
    })();

    return GetActivePhaseRes;
})();

$root.V5Service = (function() {

    /**
     * Constructs a new V5Service service.
     * @exports V5Service
     * @classdesc Represents a V5Service
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function V5Service(rpcImpl, requestDelimited, responseDelimited) {
        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
    }

    (V5Service.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = V5Service;

    /**
     * Creates new V5Service service using the specified rpc implementation.
     * @function create
     * @memberof V5Service
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {V5Service} RPC service. Useful where requests and/or responses are streamed.
     */
    V5Service.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link V5Service#reward}.
     * @memberof V5Service
     * @typedef rewardCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {RewardRes} [response] RewardRes
     */

    /**
     * Calls reward.
     * @function reward
     * @memberof V5Service
     * @instance
     * @param {IRewardReq} request RewardReq message or plain object
     * @param {V5Service.rewardCallback} callback Node-style callback called with the error, if any, and RewardRes
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(V5Service.prototype.reward = function reward(request, callback) {
        return this.rpcCall(reward, $root.RewardReq, $root.RewardRes, request, callback);
    }, "name", { value: "reward" });

    /**
     * Calls reward.
     * @function reward
     * @memberof V5Service
     * @instance
     * @param {IRewardReq} request RewardReq message or plain object
     * @returns {Promise<RewardRes>} Promise
     * @variation 2
     */

    return V5Service;
})();

$root.RewardReq = (function() {

    /**
     * Properties of a RewardReq.
     * @exports IRewardReq
     * @interface IRewardReq
     */

    /**
     * Constructs a new RewardReq.
     * @exports RewardReq
     * @classdesc Represents a RewardReq.
     * @implements IRewardReq
     * @constructor
     * @param {IRewardReq=} [properties] Properties to set
     */
    function RewardReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new RewardReq instance using the specified properties.
     * @function create
     * @memberof RewardReq
     * @static
     * @param {IRewardReq=} [properties] Properties to set
     * @returns {RewardReq} RewardReq instance
     */
    RewardReq.create = function create(properties) {
        return new RewardReq(properties);
    };

    /**
     * Encodes the specified RewardReq message. Does not implicitly {@link RewardReq.verify|verify} messages.
     * @function encode
     * @memberof RewardReq
     * @static
     * @param {IRewardReq} message RewardReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RewardReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified RewardReq message, length delimited. Does not implicitly {@link RewardReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RewardReq
     * @static
     * @param {IRewardReq} message RewardReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RewardReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RewardReq message from the specified reader or buffer.
     * @function decode
     * @memberof RewardReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RewardReq} RewardReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RewardReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RewardReq();
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
     * Decodes a RewardReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RewardReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RewardReq} RewardReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RewardReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RewardReq message.
     * @function verify
     * @memberof RewardReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RewardReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a RewardReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RewardReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RewardReq} RewardReq
     */
    RewardReq.fromObject = function fromObject(object) {
        if (object instanceof $root.RewardReq)
            return object;
        return new $root.RewardReq();
    };

    /**
     * Creates a plain object from a RewardReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RewardReq
     * @static
     * @param {RewardReq} message RewardReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RewardReq.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this RewardReq to JSON.
     * @function toJSON
     * @memberof RewardReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RewardReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RewardReq;
})();

$root.RewardRes = (function() {

    /**
     * Properties of a RewardRes.
     * @exports IRewardRes
     * @interface IRewardRes
     */

    /**
     * Constructs a new RewardRes.
     * @exports RewardRes
     * @classdesc Represents a RewardRes.
     * @implements IRewardRes
     * @constructor
     * @param {IRewardRes=} [properties] Properties to set
     */
    function RewardRes(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new RewardRes instance using the specified properties.
     * @function create
     * @memberof RewardRes
     * @static
     * @param {IRewardRes=} [properties] Properties to set
     * @returns {RewardRes} RewardRes instance
     */
    RewardRes.create = function create(properties) {
        return new RewardRes(properties);
    };

    /**
     * Encodes the specified RewardRes message. Does not implicitly {@link RewardRes.verify|verify} messages.
     * @function encode
     * @memberof RewardRes
     * @static
     * @param {IRewardRes} message RewardRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RewardRes.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified RewardRes message, length delimited. Does not implicitly {@link RewardRes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RewardRes
     * @static
     * @param {IRewardRes} message RewardRes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RewardRes.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RewardRes message from the specified reader or buffer.
     * @function decode
     * @memberof RewardRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RewardRes} RewardRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RewardRes.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RewardRes();
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
     * Decodes a RewardRes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RewardRes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RewardRes} RewardRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RewardRes.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RewardRes message.
     * @function verify
     * @memberof RewardRes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RewardRes.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates a RewardRes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RewardRes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RewardRes} RewardRes
     */
    RewardRes.fromObject = function fromObject(object) {
        if (object instanceof $root.RewardRes)
            return object;
        return new $root.RewardRes();
    };

    /**
     * Creates a plain object from a RewardRes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RewardRes
     * @static
     * @param {RewardRes} message RewardRes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RewardRes.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this RewardRes to JSON.
     * @function toJSON
     * @memberof RewardRes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RewardRes.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RewardRes;
})();

module.exports = $root;
