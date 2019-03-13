/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.CreateParams = (function() {

    /**
     * Properties of a CreateParams.
     * @exports ICreateParams
     * @interface ICreateParams
     * @property {number|null} [round] CreateParams round
     * @property {number|null} [groupSize] CreateParams groupSize
     * @property {Array.<number>|null} [sellerPrivatePrice] CreateParams sellerPrivatePrice
     * @property {Array.<number>|null} [buyerPrivatePrice] CreateParams buyerPrivatePrice
     * @property {string|null} [nextPhaseKey] CreateParams nextPhaseKey
     */

    /**
     * Constructs a new CreateParams.
     * @exports CreateParams
     * @classdesc Represents a CreateParams.
     * @implements ICreateParams
     * @constructor
     * @param {ICreateParams=} [properties] Properties to set
     */
    function CreateParams(properties) {
        this.sellerPrivatePrice = [];
        this.buyerPrivatePrice = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CreateParams round.
     * @member {number} round
     * @memberof CreateParams
     * @instance
     */
    CreateParams.prototype.round = 0;

    /**
     * CreateParams groupSize.
     * @member {number} groupSize
     * @memberof CreateParams
     * @instance
     */
    CreateParams.prototype.groupSize = 0;

    /**
     * CreateParams sellerPrivatePrice.
     * @member {Array.<number>} sellerPrivatePrice
     * @memberof CreateParams
     * @instance
     */
    CreateParams.prototype.sellerPrivatePrice = $util.emptyArray;

    /**
     * CreateParams buyerPrivatePrice.
     * @member {Array.<number>} buyerPrivatePrice
     * @memberof CreateParams
     * @instance
     */
    CreateParams.prototype.buyerPrivatePrice = $util.emptyArray;

    /**
     * CreateParams nextPhaseKey.
     * @member {string} nextPhaseKey
     * @memberof CreateParams
     * @instance
     */
    CreateParams.prototype.nextPhaseKey = "";

    /**
     * Creates a new CreateParams instance using the specified properties.
     * @function create
     * @memberof CreateParams
     * @static
     * @param {ICreateParams=} [properties] Properties to set
     * @returns {CreateParams} CreateParams instance
     */
    CreateParams.create = function create(properties) {
        return new CreateParams(properties);
    };

    /**
     * Encodes the specified CreateParams message. Does not implicitly {@link CreateParams.verify|verify} messages.
     * @function encode
     * @memberof CreateParams
     * @static
     * @param {ICreateParams} message CreateParams message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CreateParams.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.round != null && message.hasOwnProperty("round"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.round);
        if (message.groupSize != null && message.hasOwnProperty("groupSize"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.groupSize);
        if (message.sellerPrivatePrice != null && message.sellerPrivatePrice.length) {
            writer.uint32(/* id 3, wireType 2 =*/26).fork();
            for (var i = 0; i < message.sellerPrivatePrice.length; ++i)
                writer.int32(message.sellerPrivatePrice[i]);
            writer.ldelim();
        }
        if (message.buyerPrivatePrice != null && message.buyerPrivatePrice.length) {
            writer.uint32(/* id 4, wireType 2 =*/34).fork();
            for (var i = 0; i < message.buyerPrivatePrice.length; ++i)
                writer.int32(message.buyerPrivatePrice[i]);
            writer.ldelim();
        }
        if (message.nextPhaseKey != null && message.hasOwnProperty("nextPhaseKey"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.nextPhaseKey);
        return writer;
    };

    /**
     * Encodes the specified CreateParams message, length delimited. Does not implicitly {@link CreateParams.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CreateParams
     * @static
     * @param {ICreateParams} message CreateParams message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CreateParams.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CreateParams message from the specified reader or buffer.
     * @function decode
     * @memberof CreateParams
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CreateParams} CreateParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CreateParams.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CreateParams();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.round = reader.int32();
                break;
            case 2:
                message.groupSize = reader.int32();
                break;
            case 3:
                if (!(message.sellerPrivatePrice && message.sellerPrivatePrice.length))
                    message.sellerPrivatePrice = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.sellerPrivatePrice.push(reader.int32());
                } else
                    message.sellerPrivatePrice.push(reader.int32());
                break;
            case 4:
                if (!(message.buyerPrivatePrice && message.buyerPrivatePrice.length))
                    message.buyerPrivatePrice = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.buyerPrivatePrice.push(reader.int32());
                } else
                    message.buyerPrivatePrice.push(reader.int32());
                break;
            case 5:
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
     * Decodes a CreateParams message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CreateParams
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CreateParams} CreateParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CreateParams.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CreateParams message.
     * @function verify
     * @memberof CreateParams
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CreateParams.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.round != null && message.hasOwnProperty("round"))
            if (!$util.isInteger(message.round))
                return "round: integer expected";
        if (message.groupSize != null && message.hasOwnProperty("groupSize"))
            if (!$util.isInteger(message.groupSize))
                return "groupSize: integer expected";
        if (message.sellerPrivatePrice != null && message.hasOwnProperty("sellerPrivatePrice")) {
            if (!Array.isArray(message.sellerPrivatePrice))
                return "sellerPrivatePrice: array expected";
            for (var i = 0; i < message.sellerPrivatePrice.length; ++i)
                if (!$util.isInteger(message.sellerPrivatePrice[i]))
                    return "sellerPrivatePrice: integer[] expected";
        }
        if (message.buyerPrivatePrice != null && message.hasOwnProperty("buyerPrivatePrice")) {
            if (!Array.isArray(message.buyerPrivatePrice))
                return "buyerPrivatePrice: array expected";
            for (var i = 0; i < message.buyerPrivatePrice.length; ++i)
                if (!$util.isInteger(message.buyerPrivatePrice[i]))
                    return "buyerPrivatePrice: integer[] expected";
        }
        if (message.nextPhaseKey != null && message.hasOwnProperty("nextPhaseKey"))
            if (!$util.isString(message.nextPhaseKey))
                return "nextPhaseKey: string expected";
        return null;
    };

    /**
     * Creates a CreateParams message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CreateParams
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CreateParams} CreateParams
     */
    CreateParams.fromObject = function fromObject(object) {
        if (object instanceof $root.CreateParams)
            return object;
        var message = new $root.CreateParams();
        if (object.round != null)
            message.round = object.round | 0;
        if (object.groupSize != null)
            message.groupSize = object.groupSize | 0;
        if (object.sellerPrivatePrice) {
            if (!Array.isArray(object.sellerPrivatePrice))
                throw TypeError(".CreateParams.sellerPrivatePrice: array expected");
            message.sellerPrivatePrice = [];
            for (var i = 0; i < object.sellerPrivatePrice.length; ++i)
                message.sellerPrivatePrice[i] = object.sellerPrivatePrice[i] | 0;
        }
        if (object.buyerPrivatePrice) {
            if (!Array.isArray(object.buyerPrivatePrice))
                throw TypeError(".CreateParams.buyerPrivatePrice: array expected");
            message.buyerPrivatePrice = [];
            for (var i = 0; i < object.buyerPrivatePrice.length; ++i)
                message.buyerPrivatePrice[i] = object.buyerPrivatePrice[i] | 0;
        }
        if (object.nextPhaseKey != null)
            message.nextPhaseKey = String(object.nextPhaseKey);
        return message;
    };

    /**
     * Creates a plain object from a CreateParams message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CreateParams
     * @static
     * @param {CreateParams} message CreateParams
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CreateParams.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.sellerPrivatePrice = [];
            object.buyerPrivatePrice = [];
        }
        if (options.defaults) {
            object.round = 0;
            object.groupSize = 0;
            object.nextPhaseKey = "";
        }
        if (message.round != null && message.hasOwnProperty("round"))
            object.round = message.round;
        if (message.groupSize != null && message.hasOwnProperty("groupSize"))
            object.groupSize = message.groupSize;
        if (message.sellerPrivatePrice && message.sellerPrivatePrice.length) {
            object.sellerPrivatePrice = [];
            for (var j = 0; j < message.sellerPrivatePrice.length; ++j)
                object.sellerPrivatePrice[j] = message.sellerPrivatePrice[j];
        }
        if (message.buyerPrivatePrice && message.buyerPrivatePrice.length) {
            object.buyerPrivatePrice = [];
            for (var j = 0; j < message.buyerPrivatePrice.length; ++j)
                object.buyerPrivatePrice[j] = message.buyerPrivatePrice[j];
        }
        if (message.nextPhaseKey != null && message.hasOwnProperty("nextPhaseKey"))
            object.nextPhaseKey = message.nextPhaseKey;
        return object;
    };

    /**
     * Converts this CreateParams to JSON.
     * @function toJSON
     * @memberof CreateParams
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CreateParams.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CreateParams;
})();

$root.MoveParams = (function() {

    /**
     * Properties of a MoveParams.
     * @exports IMoveParams
     * @interface IMoveParams
     * @property {number|null} [price] MoveParams price
     */

    /**
     * Constructs a new MoveParams.
     * @exports MoveParams
     * @classdesc Represents a MoveParams.
     * @implements IMoveParams
     * @constructor
     * @param {IMoveParams=} [properties] Properties to set
     */
    function MoveParams(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MoveParams price.
     * @member {number} price
     * @memberof MoveParams
     * @instance
     */
    MoveParams.prototype.price = 0;

    /**
     * Creates a new MoveParams instance using the specified properties.
     * @function create
     * @memberof MoveParams
     * @static
     * @param {IMoveParams=} [properties] Properties to set
     * @returns {MoveParams} MoveParams instance
     */
    MoveParams.create = function create(properties) {
        return new MoveParams(properties);
    };

    /**
     * Encodes the specified MoveParams message. Does not implicitly {@link MoveParams.verify|verify} messages.
     * @function encode
     * @memberof MoveParams
     * @static
     * @param {IMoveParams} message MoveParams message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MoveParams.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.price != null && message.hasOwnProperty("price"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.price);
        return writer;
    };

    /**
     * Encodes the specified MoveParams message, length delimited. Does not implicitly {@link MoveParams.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MoveParams
     * @static
     * @param {IMoveParams} message MoveParams message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MoveParams.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MoveParams message from the specified reader or buffer.
     * @function decode
     * @memberof MoveParams
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MoveParams} MoveParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MoveParams.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MoveParams();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.price = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MoveParams message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MoveParams
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MoveParams} MoveParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MoveParams.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MoveParams message.
     * @function verify
     * @memberof MoveParams
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MoveParams.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.price != null && message.hasOwnProperty("price"))
            if (!$util.isInteger(message.price))
                return "price: integer expected";
        return null;
    };

    /**
     * Creates a MoveParams message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MoveParams
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MoveParams} MoveParams
     */
    MoveParams.fromObject = function fromObject(object) {
        if (object instanceof $root.MoveParams)
            return object;
        var message = new $root.MoveParams();
        if (object.price != null)
            message.price = object.price | 0;
        return message;
    };

    /**
     * Creates a plain object from a MoveParams message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MoveParams
     * @static
     * @param {MoveParams} message MoveParams
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MoveParams.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.price = 0;
        if (message.price != null && message.hasOwnProperty("price"))
            object.price = message.price;
        return object;
    };

    /**
     * Converts this MoveParams to JSON.
     * @function toJSON
     * @memberof MoveParams
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MoveParams.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MoveParams;
})();

$root.PushParams = (function() {

    /**
     * Properties of a PushParams.
     * @exports IPushParams
     * @interface IPushParams
     * @property {number|null} [roundIndex] PushParams roundIndex
     * @property {number|null} [dealTimer] PushParams dealTimer
     * @property {number|null} [newRoundTimer] PushParams newRoundTimer
     */

    /**
     * Constructs a new PushParams.
     * @exports PushParams
     * @classdesc Represents a PushParams.
     * @implements IPushParams
     * @constructor
     * @param {IPushParams=} [properties] Properties to set
     */
    function PushParams(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PushParams roundIndex.
     * @member {number} roundIndex
     * @memberof PushParams
     * @instance
     */
    PushParams.prototype.roundIndex = 0;

    /**
     * PushParams dealTimer.
     * @member {number} dealTimer
     * @memberof PushParams
     * @instance
     */
    PushParams.prototype.dealTimer = 0;

    /**
     * PushParams newRoundTimer.
     * @member {number} newRoundTimer
     * @memberof PushParams
     * @instance
     */
    PushParams.prototype.newRoundTimer = 0;

    /**
     * Creates a new PushParams instance using the specified properties.
     * @function create
     * @memberof PushParams
     * @static
     * @param {IPushParams=} [properties] Properties to set
     * @returns {PushParams} PushParams instance
     */
    PushParams.create = function create(properties) {
        return new PushParams(properties);
    };

    /**
     * Encodes the specified PushParams message. Does not implicitly {@link PushParams.verify|verify} messages.
     * @function encode
     * @memberof PushParams
     * @static
     * @param {IPushParams} message PushParams message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PushParams.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.roundIndex != null && message.hasOwnProperty("roundIndex"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roundIndex);
        if (message.dealTimer != null && message.hasOwnProperty("dealTimer"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.dealTimer);
        if (message.newRoundTimer != null && message.hasOwnProperty("newRoundTimer"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.newRoundTimer);
        return writer;
    };

    /**
     * Encodes the specified PushParams message, length delimited. Does not implicitly {@link PushParams.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PushParams
     * @static
     * @param {IPushParams} message PushParams message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PushParams.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PushParams message from the specified reader or buffer.
     * @function decode
     * @memberof PushParams
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PushParams} PushParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PushParams.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PushParams();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.roundIndex = reader.int32();
                break;
            case 2:
                message.dealTimer = reader.int32();
                break;
            case 3:
                message.newRoundTimer = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PushParams message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PushParams
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PushParams} PushParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PushParams.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PushParams message.
     * @function verify
     * @memberof PushParams
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PushParams.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.roundIndex != null && message.hasOwnProperty("roundIndex"))
            if (!$util.isInteger(message.roundIndex))
                return "roundIndex: integer expected";
        if (message.dealTimer != null && message.hasOwnProperty("dealTimer"))
            if (!$util.isInteger(message.dealTimer))
                return "dealTimer: integer expected";
        if (message.newRoundTimer != null && message.hasOwnProperty("newRoundTimer"))
            if (!$util.isInteger(message.newRoundTimer))
                return "newRoundTimer: integer expected";
        return null;
    };

    /**
     * Creates a PushParams message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PushParams
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PushParams} PushParams
     */
    PushParams.fromObject = function fromObject(object) {
        if (object instanceof $root.PushParams)
            return object;
        var message = new $root.PushParams();
        if (object.roundIndex != null)
            message.roundIndex = object.roundIndex | 0;
        if (object.dealTimer != null)
            message.dealTimer = object.dealTimer | 0;
        if (object.newRoundTimer != null)
            message.newRoundTimer = object.newRoundTimer | 0;
        return message;
    };

    /**
     * Creates a plain object from a PushParams message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PushParams
     * @static
     * @param {PushParams} message PushParams
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PushParams.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.roundIndex = 0;
            object.dealTimer = 0;
            object.newRoundTimer = 0;
        }
        if (message.roundIndex != null && message.hasOwnProperty("roundIndex"))
            object.roundIndex = message.roundIndex;
        if (message.dealTimer != null && message.hasOwnProperty("dealTimer"))
            object.dealTimer = message.dealTimer;
        if (message.newRoundTimer != null && message.hasOwnProperty("newRoundTimer"))
            object.newRoundTimer = message.newRoundTimer;
        return object;
    };

    /**
     * Converts this PushParams to JSON.
     * @function toJSON
     * @memberof PushParams
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PushParams.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PushParams;
})();

$root.GameState = (function() {

    /**
     * Properties of a GameState.
     * @exports IGameState
     * @interface IGameState
     * @property {Array.<GameState.IGroup>|null} [groups] GameState groups
     */

    /**
     * Constructs a new GameState.
     * @exports GameState
     * @classdesc Represents a GameState.
     * @implements IGameState
     * @constructor
     * @param {IGameState=} [properties] Properties to set
     */
    function GameState(properties) {
        this.groups = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GameState groups.
     * @member {Array.<GameState.IGroup>} groups
     * @memberof GameState
     * @instance
     */
    GameState.prototype.groups = $util.emptyArray;

    /**
     * Creates a new GameState instance using the specified properties.
     * @function create
     * @memberof GameState
     * @static
     * @param {IGameState=} [properties] Properties to set
     * @returns {GameState} GameState instance
     */
    GameState.create = function create(properties) {
        return new GameState(properties);
    };

    /**
     * Encodes the specified GameState message. Does not implicitly {@link GameState.verify|verify} messages.
     * @function encode
     * @memberof GameState
     * @static
     * @param {IGameState} message GameState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameState.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.groups != null && message.groups.length)
            for (var i = 0; i < message.groups.length; ++i)
                $root.GameState.Group.encode(message.groups[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GameState message, length delimited. Does not implicitly {@link GameState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GameState
     * @static
     * @param {IGameState} message GameState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameState.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GameState message from the specified reader or buffer.
     * @function decode
     * @memberof GameState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GameState} GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameState.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameState();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.groups && message.groups.length))
                    message.groups = [];
                message.groups.push($root.GameState.Group.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GameState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GameState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GameState} GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameState.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GameState message.
     * @function verify
     * @memberof GameState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GameState.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.groups != null && message.hasOwnProperty("groups")) {
            if (!Array.isArray(message.groups))
                return "groups: array expected";
            for (var i = 0; i < message.groups.length; ++i) {
                var error = $root.GameState.Group.verify(message.groups[i]);
                if (error)
                    return "groups." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GameState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GameState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GameState} GameState
     */
    GameState.fromObject = function fromObject(object) {
        if (object instanceof $root.GameState)
            return object;
        var message = new $root.GameState();
        if (object.groups) {
            if (!Array.isArray(object.groups))
                throw TypeError(".GameState.groups: array expected");
            message.groups = [];
            for (var i = 0; i < object.groups.length; ++i) {
                if (typeof object.groups[i] !== "object")
                    throw TypeError(".GameState.groups: object expected");
                message.groups[i] = $root.GameState.Group.fromObject(object.groups[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GameState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GameState
     * @static
     * @param {GameState} message GameState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GameState.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.groups = [];
        if (message.groups && message.groups.length) {
            object.groups = [];
            for (var j = 0; j < message.groups.length; ++j)
                object.groups[j] = $root.GameState.Group.toObject(message.groups[j], options);
        }
        return object;
    };

    /**
     * Converts this GameState to JSON.
     * @function toJSON
     * @memberof GameState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GameState.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    GameState.Group = (function() {

        /**
         * Properties of a Group.
         * @memberof GameState
         * @interface IGroup
         * @property {number|null} [roundIndex] Group roundIndex
         * @property {Array.<GameState.Group.IRound>|null} [rounds] Group rounds
         * @property {number|null} [playerNum] Group playerNum
         */

        /**
         * Constructs a new Group.
         * @memberof GameState
         * @classdesc Represents a Group.
         * @implements IGroup
         * @constructor
         * @param {GameState.IGroup=} [properties] Properties to set
         */
        function Group(properties) {
            this.rounds = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Group roundIndex.
         * @member {number} roundIndex
         * @memberof GameState.Group
         * @instance
         */
        Group.prototype.roundIndex = 0;

        /**
         * Group rounds.
         * @member {Array.<GameState.Group.IRound>} rounds
         * @memberof GameState.Group
         * @instance
         */
        Group.prototype.rounds = $util.emptyArray;

        /**
         * Group playerNum.
         * @member {number} playerNum
         * @memberof GameState.Group
         * @instance
         */
        Group.prototype.playerNum = 0;

        /**
         * Creates a new Group instance using the specified properties.
         * @function create
         * @memberof GameState.Group
         * @static
         * @param {GameState.IGroup=} [properties] Properties to set
         * @returns {GameState.Group} Group instance
         */
        Group.create = function create(properties) {
            return new Group(properties);
        };

        /**
         * Encodes the specified Group message. Does not implicitly {@link GameState.Group.verify|verify} messages.
         * @function encode
         * @memberof GameState.Group
         * @static
         * @param {GameState.IGroup} message Group message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Group.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roundIndex != null && message.hasOwnProperty("roundIndex"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roundIndex);
            if (message.rounds != null && message.rounds.length)
                for (var i = 0; i < message.rounds.length; ++i)
                    $root.GameState.Group.Round.encode(message.rounds[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.playerNum != null && message.hasOwnProperty("playerNum"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.playerNum);
            return writer;
        };

        /**
         * Encodes the specified Group message, length delimited. Does not implicitly {@link GameState.Group.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GameState.Group
         * @static
         * @param {GameState.IGroup} message Group message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Group.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Group message from the specified reader or buffer.
         * @function decode
         * @memberof GameState.Group
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GameState.Group} Group
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Group.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameState.Group();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roundIndex = reader.int32();
                    break;
                case 2:
                    if (!(message.rounds && message.rounds.length))
                        message.rounds = [];
                    message.rounds.push($root.GameState.Group.Round.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.playerNum = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Group message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GameState.Group
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GameState.Group} Group
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Group.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Group message.
         * @function verify
         * @memberof GameState.Group
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Group.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roundIndex != null && message.hasOwnProperty("roundIndex"))
                if (!$util.isInteger(message.roundIndex))
                    return "roundIndex: integer expected";
            if (message.rounds != null && message.hasOwnProperty("rounds")) {
                if (!Array.isArray(message.rounds))
                    return "rounds: array expected";
                for (var i = 0; i < message.rounds.length; ++i) {
                    var error = $root.GameState.Group.Round.verify(message.rounds[i]);
                    if (error)
                        return "rounds." + error;
                }
            }
            if (message.playerNum != null && message.hasOwnProperty("playerNum"))
                if (!$util.isInteger(message.playerNum))
                    return "playerNum: integer expected";
            return null;
        };

        /**
         * Creates a Group message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GameState.Group
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GameState.Group} Group
         */
        Group.fromObject = function fromObject(object) {
            if (object instanceof $root.GameState.Group)
                return object;
            var message = new $root.GameState.Group();
            if (object.roundIndex != null)
                message.roundIndex = object.roundIndex | 0;
            if (object.rounds) {
                if (!Array.isArray(object.rounds))
                    throw TypeError(".GameState.Group.rounds: array expected");
                message.rounds = [];
                for (var i = 0; i < object.rounds.length; ++i) {
                    if (typeof object.rounds[i] !== "object")
                        throw TypeError(".GameState.Group.rounds: object expected");
                    message.rounds[i] = $root.GameState.Group.Round.fromObject(object.rounds[i]);
                }
            }
            if (object.playerNum != null)
                message.playerNum = object.playerNum | 0;
            return message;
        };

        /**
         * Creates a plain object from a Group message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GameState.Group
         * @static
         * @param {GameState.Group} message Group
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Group.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.rounds = [];
            if (options.defaults) {
                object.roundIndex = 0;
                object.playerNum = 0;
            }
            if (message.roundIndex != null && message.hasOwnProperty("roundIndex"))
                object.roundIndex = message.roundIndex;
            if (message.rounds && message.rounds.length) {
                object.rounds = [];
                for (var j = 0; j < message.rounds.length; ++j)
                    object.rounds[j] = $root.GameState.Group.Round.toObject(message.rounds[j], options);
            }
            if (message.playerNum != null && message.hasOwnProperty("playerNum"))
                object.playerNum = message.playerNum;
            return object;
        };

        /**
         * Converts this Group to JSON.
         * @function toJSON
         * @memberof GameState.Group
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Group.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        Group.Round = (function() {

            /**
             * Properties of a Round.
             * @memberof GameState.Group
             * @interface IRound
             * @property {Array.<number>|null} [playerStatus] Round playerStatus
             */

            /**
             * Constructs a new Round.
             * @memberof GameState.Group
             * @classdesc Represents a Round.
             * @implements IRound
             * @constructor
             * @param {GameState.Group.IRound=} [properties] Properties to set
             */
            function Round(properties) {
                this.playerStatus = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Round playerStatus.
             * @member {Array.<number>} playerStatus
             * @memberof GameState.Group.Round
             * @instance
             */
            Round.prototype.playerStatus = $util.emptyArray;

            /**
             * Creates a new Round instance using the specified properties.
             * @function create
             * @memberof GameState.Group.Round
             * @static
             * @param {GameState.Group.IRound=} [properties] Properties to set
             * @returns {GameState.Group.Round} Round instance
             */
            Round.create = function create(properties) {
                return new Round(properties);
            };

            /**
             * Encodes the specified Round message. Does not implicitly {@link GameState.Group.Round.verify|verify} messages.
             * @function encode
             * @memberof GameState.Group.Round
             * @static
             * @param {GameState.Group.IRound} message Round message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Round.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.playerStatus != null && message.playerStatus.length) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork();
                    for (var i = 0; i < message.playerStatus.length; ++i)
                        writer.int32(message.playerStatus[i]);
                    writer.ldelim();
                }
                return writer;
            };

            /**
             * Encodes the specified Round message, length delimited. Does not implicitly {@link GameState.Group.Round.verify|verify} messages.
             * @function encodeDelimited
             * @memberof GameState.Group.Round
             * @static
             * @param {GameState.Group.IRound} message Round message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Round.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Round message from the specified reader or buffer.
             * @function decode
             * @memberof GameState.Group.Round
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {GameState.Group.Round} Round
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Round.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameState.Group.Round();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.playerStatus && message.playerStatus.length))
                            message.playerStatus = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.playerStatus.push(reader.int32());
                        } else
                            message.playerStatus.push(reader.int32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Round message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof GameState.Group.Round
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {GameState.Group.Round} Round
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Round.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Round message.
             * @function verify
             * @memberof GameState.Group.Round
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Round.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.playerStatus != null && message.hasOwnProperty("playerStatus")) {
                    if (!Array.isArray(message.playerStatus))
                        return "playerStatus: array expected";
                    for (var i = 0; i < message.playerStatus.length; ++i)
                        if (!$util.isInteger(message.playerStatus[i]))
                            return "playerStatus: integer[] expected";
                }
                return null;
            };

            /**
             * Creates a Round message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof GameState.Group.Round
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {GameState.Group.Round} Round
             */
            Round.fromObject = function fromObject(object) {
                if (object instanceof $root.GameState.Group.Round)
                    return object;
                var message = new $root.GameState.Group.Round();
                if (object.playerStatus) {
                    if (!Array.isArray(object.playerStatus))
                        throw TypeError(".GameState.Group.Round.playerStatus: array expected");
                    message.playerStatus = [];
                    for (var i = 0; i < object.playerStatus.length; ++i)
                        message.playerStatus[i] = object.playerStatus[i] | 0;
                }
                return message;
            };

            /**
             * Creates a plain object from a Round message. Also converts values to other types if specified.
             * @function toObject
             * @memberof GameState.Group.Round
             * @static
             * @param {GameState.Group.Round} message Round
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Round.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.playerStatus = [];
                if (message.playerStatus && message.playerStatus.length) {
                    object.playerStatus = [];
                    for (var j = 0; j < message.playerStatus.length; ++j)
                        object.playerStatus[j] = message.playerStatus[j];
                }
                return object;
            };

            /**
             * Converts this Round to JSON.
             * @function toJSON
             * @memberof GameState.Group.Round
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Round.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Round;
        })();

        return Group;
    })();

    return GameState;
})();

$root.PlayerState = (function() {

    /**
     * Properties of a PlayerState.
     * @exports IPlayerState
     * @interface IPlayerState
     * @property {number|null} [groupIndex] PlayerState groupIndex
     * @property {number|null} [positionIndex] PlayerState positionIndex
     * @property {Array.<number>|null} [privatePrices] PlayerState privatePrices
     * @property {Array.<number>|null} [prices] PlayerState prices
     * @property {Array.<number>|null} [profits] PlayerState profits
     */

    /**
     * Constructs a new PlayerState.
     * @exports PlayerState
     * @classdesc Represents a PlayerState.
     * @implements IPlayerState
     * @constructor
     * @param {IPlayerState=} [properties] Properties to set
     */
    function PlayerState(properties) {
        this.privatePrices = [];
        this.prices = [];
        this.profits = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PlayerState groupIndex.
     * @member {number} groupIndex
     * @memberof PlayerState
     * @instance
     */
    PlayerState.prototype.groupIndex = 0;

    /**
     * PlayerState positionIndex.
     * @member {number} positionIndex
     * @memberof PlayerState
     * @instance
     */
    PlayerState.prototype.positionIndex = 0;

    /**
     * PlayerState privatePrices.
     * @member {Array.<number>} privatePrices
     * @memberof PlayerState
     * @instance
     */
    PlayerState.prototype.privatePrices = $util.emptyArray;

    /**
     * PlayerState prices.
     * @member {Array.<number>} prices
     * @memberof PlayerState
     * @instance
     */
    PlayerState.prototype.prices = $util.emptyArray;

    /**
     * PlayerState profits.
     * @member {Array.<number>} profits
     * @memberof PlayerState
     * @instance
     */
    PlayerState.prototype.profits = $util.emptyArray;

    /**
     * Creates a new PlayerState instance using the specified properties.
     * @function create
     * @memberof PlayerState
     * @static
     * @param {IPlayerState=} [properties] Properties to set
     * @returns {PlayerState} PlayerState instance
     */
    PlayerState.create = function create(properties) {
        return new PlayerState(properties);
    };

    /**
     * Encodes the specified PlayerState message. Does not implicitly {@link PlayerState.verify|verify} messages.
     * @function encode
     * @memberof PlayerState
     * @static
     * @param {IPlayerState} message PlayerState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PlayerState.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.groupIndex != null && message.hasOwnProperty("groupIndex"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.groupIndex);
        if (message.positionIndex != null && message.hasOwnProperty("positionIndex"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.positionIndex);
        if (message.privatePrices != null && message.privatePrices.length) {
            writer.uint32(/* id 3, wireType 2 =*/26).fork();
            for (var i = 0; i < message.privatePrices.length; ++i)
                writer.int32(message.privatePrices[i]);
            writer.ldelim();
        }
        if (message.prices != null && message.prices.length) {
            writer.uint32(/* id 4, wireType 2 =*/34).fork();
            for (var i = 0; i < message.prices.length; ++i)
                writer.int32(message.prices[i]);
            writer.ldelim();
        }
        if (message.profits != null && message.profits.length) {
            writer.uint32(/* id 5, wireType 2 =*/42).fork();
            for (var i = 0; i < message.profits.length; ++i)
                writer.int32(message.profits[i]);
            writer.ldelim();
        }
        return writer;
    };

    /**
     * Encodes the specified PlayerState message, length delimited. Does not implicitly {@link PlayerState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PlayerState
     * @static
     * @param {IPlayerState} message PlayerState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PlayerState.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PlayerState message from the specified reader or buffer.
     * @function decode
     * @memberof PlayerState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PlayerState} PlayerState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PlayerState.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PlayerState();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.groupIndex = reader.int32();
                break;
            case 2:
                message.positionIndex = reader.int32();
                break;
            case 3:
                if (!(message.privatePrices && message.privatePrices.length))
                    message.privatePrices = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.privatePrices.push(reader.int32());
                } else
                    message.privatePrices.push(reader.int32());
                break;
            case 4:
                if (!(message.prices && message.prices.length))
                    message.prices = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.prices.push(reader.int32());
                } else
                    message.prices.push(reader.int32());
                break;
            case 5:
                if (!(message.profits && message.profits.length))
                    message.profits = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.profits.push(reader.int32());
                } else
                    message.profits.push(reader.int32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PlayerState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PlayerState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PlayerState} PlayerState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PlayerState.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PlayerState message.
     * @function verify
     * @memberof PlayerState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PlayerState.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.groupIndex != null && message.hasOwnProperty("groupIndex"))
            if (!$util.isInteger(message.groupIndex))
                return "groupIndex: integer expected";
        if (message.positionIndex != null && message.hasOwnProperty("positionIndex"))
            if (!$util.isInteger(message.positionIndex))
                return "positionIndex: integer expected";
        if (message.privatePrices != null && message.hasOwnProperty("privatePrices")) {
            if (!Array.isArray(message.privatePrices))
                return "privatePrices: array expected";
            for (var i = 0; i < message.privatePrices.length; ++i)
                if (!$util.isInteger(message.privatePrices[i]))
                    return "privatePrices: integer[] expected";
        }
        if (message.prices != null && message.hasOwnProperty("prices")) {
            if (!Array.isArray(message.prices))
                return "prices: array expected";
            for (var i = 0; i < message.prices.length; ++i)
                if (!$util.isInteger(message.prices[i]))
                    return "prices: integer[] expected";
        }
        if (message.profits != null && message.hasOwnProperty("profits")) {
            if (!Array.isArray(message.profits))
                return "profits: array expected";
            for (var i = 0; i < message.profits.length; ++i)
                if (!$util.isInteger(message.profits[i]))
                    return "profits: integer[] expected";
        }
        return null;
    };

    /**
     * Creates a PlayerState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PlayerState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PlayerState} PlayerState
     */
    PlayerState.fromObject = function fromObject(object) {
        if (object instanceof $root.PlayerState)
            return object;
        var message = new $root.PlayerState();
        if (object.groupIndex != null)
            message.groupIndex = object.groupIndex | 0;
        if (object.positionIndex != null)
            message.positionIndex = object.positionIndex | 0;
        if (object.privatePrices) {
            if (!Array.isArray(object.privatePrices))
                throw TypeError(".PlayerState.privatePrices: array expected");
            message.privatePrices = [];
            for (var i = 0; i < object.privatePrices.length; ++i)
                message.privatePrices[i] = object.privatePrices[i] | 0;
        }
        if (object.prices) {
            if (!Array.isArray(object.prices))
                throw TypeError(".PlayerState.prices: array expected");
            message.prices = [];
            for (var i = 0; i < object.prices.length; ++i)
                message.prices[i] = object.prices[i] | 0;
        }
        if (object.profits) {
            if (!Array.isArray(object.profits))
                throw TypeError(".PlayerState.profits: array expected");
            message.profits = [];
            for (var i = 0; i < object.profits.length; ++i)
                message.profits[i] = object.profits[i] | 0;
        }
        return message;
    };

    /**
     * Creates a plain object from a PlayerState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PlayerState
     * @static
     * @param {PlayerState} message PlayerState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PlayerState.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.privatePrices = [];
            object.prices = [];
            object.profits = [];
        }
        if (options.defaults) {
            object.groupIndex = 0;
            object.positionIndex = 0;
        }
        if (message.groupIndex != null && message.hasOwnProperty("groupIndex"))
            object.groupIndex = message.groupIndex;
        if (message.positionIndex != null && message.hasOwnProperty("positionIndex"))
            object.positionIndex = message.positionIndex;
        if (message.privatePrices && message.privatePrices.length) {
            object.privatePrices = [];
            for (var j = 0; j < message.privatePrices.length; ++j)
                object.privatePrices[j] = message.privatePrices[j];
        }
        if (message.prices && message.prices.length) {
            object.prices = [];
            for (var j = 0; j < message.prices.length; ++j)
                object.prices[j] = message.prices[j];
        }
        if (message.profits && message.profits.length) {
            object.profits = [];
            for (var j = 0; j < message.profits.length; ++j)
                object.profits[j] = message.profits[j];
        }
        return object;
    };

    /**
     * Converts this PlayerState to JSON.
     * @function toJSON
     * @memberof PlayerState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PlayerState.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PlayerState;
})();

module.exports = $root;
