import * as $protobuf from "protobufjs";
/** Properties of an Unit. */
export interface IUnit {

    /** Unit price */
    price?: (number|null);

    /** Unit count */
    count?: (number|null);
}

/** Represents an Unit. */
export class Unit implements IUnit {

    /**
     * Constructs a new Unit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUnit);

    /** Unit price. */
    public price: number;

    /** Unit count. */
    public count: number;

    /**
     * Creates a new Unit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Unit instance
     */
    public static create(properties?: IUnit): Unit;

    /**
     * Encodes the specified Unit message. Does not implicitly {@link Unit.verify|verify} messages.
     * @param message Unit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUnit, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Unit message, length delimited. Does not implicitly {@link Unit.verify|verify} messages.
     * @param message Unit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUnit, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Unit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Unit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Unit;

    /**
     * Decodes an Unit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Unit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Unit;

    /**
     * Verifies an Unit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Unit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Unit
     */
    public static fromObject(object: { [k: string]: any }): Unit;

    /**
     * Creates a plain object from an Unit message. Also converts values to other types if specified.
     * @param message Unit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Unit, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Unit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CreateParams. */
export interface ICreateParams {

    /** CreateParams roles */
    roles?: (number[]|null);

    /** CreateParams prepareTime */
    prepareTime?: (number|null);

    /** CreateParams tradeTime */
    tradeTime?: (number|null);

    /** CreateParams units */
    units?: (CreateParams.IUnits[]|null);
}

/** Represents a CreateParams. */
export class CreateParams implements ICreateParams {

    /**
     * Constructs a new CreateParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICreateParams);

    /** CreateParams roles. */
    public roles: number[];

    /** CreateParams prepareTime. */
    public prepareTime: number;

    /** CreateParams tradeTime. */
    public tradeTime: number;

    /** CreateParams units. */
    public units: CreateParams.IUnits[];

    /**
     * Creates a new CreateParams instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CreateParams instance
     */
    public static create(properties?: ICreateParams): CreateParams;

    /**
     * Encodes the specified CreateParams message. Does not implicitly {@link CreateParams.verify|verify} messages.
     * @param message CreateParams message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICreateParams, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CreateParams message, length delimited. Does not implicitly {@link CreateParams.verify|verify} messages.
     * @param message CreateParams message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICreateParams, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CreateParams message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CreateParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CreateParams;

    /**
     * Decodes a CreateParams message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CreateParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CreateParams;

    /**
     * Verifies a CreateParams message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CreateParams message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CreateParams
     */
    public static fromObject(object: { [k: string]: any }): CreateParams;

    /**
     * Creates a plain object from a CreateParams message. Also converts values to other types if specified.
     * @param message CreateParams
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CreateParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CreateParams to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace CreateParams {

    /** Properties of an Units. */
    interface IUnits {

        /** Units units */
        units?: (IUnit[]|null);
    }

    /** Represents an Units. */
    class Units implements IUnits {

        /**
         * Constructs a new Units.
         * @param [properties] Properties to set
         */
        constructor(properties?: CreateParams.IUnits);

        /** Units units. */
        public units: IUnit[];

        /**
         * Creates a new Units instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Units instance
         */
        public static create(properties?: CreateParams.IUnits): CreateParams.Units;

        /**
         * Encodes the specified Units message. Does not implicitly {@link CreateParams.Units.verify|verify} messages.
         * @param message Units message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: CreateParams.IUnits, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Units message, length delimited. Does not implicitly {@link CreateParams.Units.verify|verify} messages.
         * @param message Units message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: CreateParams.IUnits, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Units message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Units
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CreateParams.Units;

        /**
         * Decodes an Units message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Units
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CreateParams.Units;

        /**
         * Verifies an Units message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Units message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Units
         */
        public static fromObject(object: { [k: string]: any }): CreateParams.Units;

        /**
         * Creates a plain object from an Units message. Also converts values to other types if specified.
         * @param message Units
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: CreateParams.Units, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Units to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a GameGroupState. */
export interface IGameGroupState {

    /** GameGroupState stage */
    stage?: (number|null);

    /** GameGroupState orderId */
    orderId?: (number|null);

    /** GameGroupState orders */
    orders?: (GameGroupState.IOrder[]|null);

    /** GameGroupState buyOrderIds */
    buyOrderIds?: (number[]|null);

    /** GameGroupState sellOrderIds */
    sellOrderIds?: (number[]|null);

    /** GameGroupState trades */
    trades?: (GameGroupState.ITrade[]|null);

    /** GameGroupState roleIndex */
    roleIndex?: (number|null);

    /** GameGroupState type */
    type?: (number|null);
}

/** Represents a GameGroupState. */
export class GameGroupState implements IGameGroupState {

    /**
     * Constructs a new GameGroupState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameGroupState);

    /** GameGroupState stage. */
    public stage: number;

    /** GameGroupState orderId. */
    public orderId: number;

    /** GameGroupState orders. */
    public orders: GameGroupState.IOrder[];

    /** GameGroupState buyOrderIds. */
    public buyOrderIds: number[];

    /** GameGroupState sellOrderIds. */
    public sellOrderIds: number[];

    /** GameGroupState trades. */
    public trades: GameGroupState.ITrade[];

    /** GameGroupState roleIndex. */
    public roleIndex: number;

    /** GameGroupState type. */
    public type: number;

    /**
     * Creates a new GameGroupState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameGroupState instance
     */
    public static create(properties?: IGameGroupState): GameGroupState;

    /**
     * Encodes the specified GameGroupState message. Does not implicitly {@link GameGroupState.verify|verify} messages.
     * @param message GameGroupState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGameGroupState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GameGroupState message, length delimited. Does not implicitly {@link GameGroupState.verify|verify} messages.
     * @param message GameGroupState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGameGroupState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GameGroupState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameGroupState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameGroupState;

    /**
     * Decodes a GameGroupState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GameGroupState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameGroupState;

    /**
     * Verifies a GameGroupState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GameGroupState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GameGroupState
     */
    public static fromObject(object: { [k: string]: any }): GameGroupState;

    /**
     * Creates a plain object from a GameGroupState message. Also converts values to other types if specified.
     * @param message GameGroupState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GameGroupState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GameGroupState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace GameGroupState {

    /** Properties of an Order. */
    interface IOrder {

        /** Order id */
        id?: (number|null);

        /** Order roleIndex */
        roleIndex?: (number|null);

        /** Order unitIndex */
        unitIndex?: (number|null);

        /** Order price */
        price?: (number|null);

        /** Order count */
        count?: (number|null);
    }

    /** Represents an Order. */
    class Order implements IOrder {

        /**
         * Constructs a new Order.
         * @param [properties] Properties to set
         */
        constructor(properties?: GameGroupState.IOrder);

        /** Order id. */
        public id: number;

        /** Order roleIndex. */
        public roleIndex: number;

        /** Order unitIndex. */
        public unitIndex: number;

        /** Order price. */
        public price: number;

        /** Order count. */
        public count: number;

        /**
         * Creates a new Order instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Order instance
         */
        public static create(properties?: GameGroupState.IOrder): GameGroupState.Order;

        /**
         * Encodes the specified Order message. Does not implicitly {@link GameGroupState.Order.verify|verify} messages.
         * @param message Order message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: GameGroupState.IOrder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Order message, length delimited. Does not implicitly {@link GameGroupState.Order.verify|verify} messages.
         * @param message Order message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: GameGroupState.IOrder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Order message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Order
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameGroupState.Order;

        /**
         * Decodes an Order message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Order
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameGroupState.Order;

        /**
         * Verifies an Order message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Order message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Order
         */
        public static fromObject(object: { [k: string]: any }): GameGroupState.Order;

        /**
         * Creates a plain object from an Order message. Also converts values to other types if specified.
         * @param message Order
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: GameGroupState.Order, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Order to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Trade. */
    interface ITrade {

        /** Trade reqOrderId */
        reqOrderId?: (number|null);

        /** Trade resOrderId */
        resOrderId?: (number|null);

        /** Trade count */
        count?: (number|null);

        /** Trade subOrderId */
        subOrderId?: (number|null);
    }

    /** Represents a Trade. */
    class Trade implements ITrade {

        /**
         * Constructs a new Trade.
         * @param [properties] Properties to set
         */
        constructor(properties?: GameGroupState.ITrade);

        /** Trade reqOrderId. */
        public reqOrderId: number;

        /** Trade resOrderId. */
        public resOrderId: number;

        /** Trade count. */
        public count: number;

        /** Trade subOrderId. */
        public subOrderId: number;

        /**
         * Creates a new Trade instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Trade instance
         */
        public static create(properties?: GameGroupState.ITrade): GameGroupState.Trade;

        /**
         * Encodes the specified Trade message. Does not implicitly {@link GameGroupState.Trade.verify|verify} messages.
         * @param message Trade message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: GameGroupState.ITrade, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Trade message, length delimited. Does not implicitly {@link GameGroupState.Trade.verify|verify} messages.
         * @param message Trade message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: GameGroupState.ITrade, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Trade message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Trade
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameGroupState.Trade;

        /**
         * Decodes a Trade message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Trade
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameGroupState.Trade;

        /**
         * Verifies a Trade message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Trade message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Trade
         */
        public static fromObject(object: { [k: string]: any }): GameGroupState.Trade;

        /**
         * Creates a plain object from a Trade message. Also converts values to other types if specified.
         * @param message Trade
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: GameGroupState.Trade, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Trade to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a GameState. */
export interface IGameState {

    /** GameState groups */
    groups?: (IGameGroupState[]|null);
}

/** Represents a GameState. */
export class GameState implements IGameState {

    /**
     * Constructs a new GameState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameState);

    /** GameState groups. */
    public groups: IGameGroupState[];

    /**
     * Creates a new GameState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameState instance
     */
    public static create(properties?: IGameState): GameState;

    /**
     * Encodes the specified GameState message. Does not implicitly {@link GameState.verify|verify} messages.
     * @param message GameState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGameState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GameState message, length delimited. Does not implicitly {@link GameState.verify|verify} messages.
     * @param message GameState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGameState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GameState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameState;

    /**
     * Decodes a GameState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameState;

    /**
     * Verifies a GameState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GameState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GameState
     */
    public static fromObject(object: { [k: string]: any }): GameState;

    /**
     * Creates a plain object from a GameState message. Also converts values to other types if specified.
     * @param message GameState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GameState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GameState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PlayerGroupState. */
export interface IPlayerGroupState {

    /** PlayerGroupState roleIndex */
    roleIndex?: (number|null);

    /** PlayerGroupState units */
    units?: (IUnit[]|null);

    /** PlayerGroupState tradedCount */
    tradedCount?: (number|null);

    /** PlayerGroupState point */
    point?: (number|null);
}

/** Represents a PlayerGroupState. */
export class PlayerGroupState implements IPlayerGroupState {

    /**
     * Constructs a new PlayerGroupState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPlayerGroupState);

    /** PlayerGroupState roleIndex. */
    public roleIndex: number;

    /** PlayerGroupState units. */
    public units: IUnit[];

    /** PlayerGroupState tradedCount. */
    public tradedCount: number;

    /** PlayerGroupState point. */
    public point: number;

    /**
     * Creates a new PlayerGroupState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PlayerGroupState instance
     */
    public static create(properties?: IPlayerGroupState): PlayerGroupState;

    /**
     * Encodes the specified PlayerGroupState message. Does not implicitly {@link PlayerGroupState.verify|verify} messages.
     * @param message PlayerGroupState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPlayerGroupState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PlayerGroupState message, length delimited. Does not implicitly {@link PlayerGroupState.verify|verify} messages.
     * @param message PlayerGroupState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPlayerGroupState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PlayerGroupState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PlayerGroupState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PlayerGroupState;

    /**
     * Decodes a PlayerGroupState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PlayerGroupState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PlayerGroupState;

    /**
     * Verifies a PlayerGroupState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PlayerGroupState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PlayerGroupState
     */
    public static fromObject(object: { [k: string]: any }): PlayerGroupState;

    /**
     * Creates a plain object from a PlayerGroupState message. Also converts values to other types if specified.
     * @param message PlayerGroupState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PlayerGroupState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PlayerGroupState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PlayerState. */
export interface IPlayerState {

    /** PlayerState groups */
    groups?: (IPlayerGroupState[]|null);

    /** PlayerState groupIndex */
    groupIndex?: (number|null);
}

/** Represents a PlayerState. */
export class PlayerState implements IPlayerState {

    /**
     * Constructs a new PlayerState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPlayerState);

    /** PlayerState groups. */
    public groups: IPlayerGroupState[];

    /** PlayerState groupIndex. */
    public groupIndex: number;

    /**
     * Creates a new PlayerState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PlayerState instance
     */
    public static create(properties?: IPlayerState): PlayerState;

    /**
     * Encodes the specified PlayerState message. Does not implicitly {@link PlayerState.verify|verify} messages.
     * @param message PlayerState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPlayerState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PlayerState message, length delimited. Does not implicitly {@link PlayerState.verify|verify} messages.
     * @param message PlayerState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPlayerState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PlayerState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PlayerState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PlayerState;

    /**
     * Decodes a PlayerState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PlayerState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PlayerState;

    /**
     * Verifies a PlayerState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PlayerState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PlayerState
     */
    public static fromObject(object: { [k: string]: any }): PlayerState;

    /**
     * Creates a plain object from a PlayerState message. Also converts values to other types if specified.
     * @param message PlayerState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PlayerState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PlayerState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a MoveParams. */
export interface IMoveParams {

    /** MoveParams groupType */
    groupType?: (number|null);

    /** MoveParams unitIndex */
    unitIndex?: (number|null);

    /** MoveParams price */
    price?: (number|null);

    /** MoveParams count */
    count?: (number|null);
}

/** Represents a MoveParams. */
export class MoveParams implements IMoveParams {

    /**
     * Constructs a new MoveParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMoveParams);

    /** MoveParams groupType. */
    public groupType: number;

    /** MoveParams unitIndex. */
    public unitIndex: number;

    /** MoveParams price. */
    public price: number;

    /** MoveParams count. */
    public count: number;

    /**
     * Creates a new MoveParams instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MoveParams instance
     */
    public static create(properties?: IMoveParams): MoveParams;

    /**
     * Encodes the specified MoveParams message. Does not implicitly {@link MoveParams.verify|verify} messages.
     * @param message MoveParams message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMoveParams, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified MoveParams message, length delimited. Does not implicitly {@link MoveParams.verify|verify} messages.
     * @param message MoveParams message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMoveParams, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a MoveParams message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MoveParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MoveParams;

    /**
     * Decodes a MoveParams message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MoveParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MoveParams;

    /**
     * Verifies a MoveParams message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MoveParams message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MoveParams
     */
    public static fromObject(object: { [k: string]: any }): MoveParams;

    /**
     * Creates a plain object from a MoveParams message. Also converts values to other types if specified.
     * @param message MoveParams
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MoveParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MoveParams to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PushParams. */
export interface IPushParams {

    /** PushParams countDown */
    countDown?: (number|null);

    /** PushParams newOrderId */
    newOrderId?: (number|null);

    /** PushParams resOrderId */
    resOrderId?: (number|null);
}

/** Represents a PushParams. */
export class PushParams implements IPushParams {

    /**
     * Constructs a new PushParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPushParams);

    /** PushParams countDown. */
    public countDown: number;

    /** PushParams newOrderId. */
    public newOrderId: number;

    /** PushParams resOrderId. */
    public resOrderId: number;

    /**
     * Creates a new PushParams instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PushParams instance
     */
    public static create(properties?: IPushParams): PushParams;

    /**
     * Encodes the specified PushParams message. Does not implicitly {@link PushParams.verify|verify} messages.
     * @param message PushParams message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPushParams, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PushParams message, length delimited. Does not implicitly {@link PushParams.verify|verify} messages.
     * @param message PushParams message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPushParams, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PushParams message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PushParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PushParams;

    /**
     * Decodes a PushParams message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PushParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PushParams;

    /**
     * Verifies a PushParams message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PushParams message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PushParams
     */
    public static fromObject(object: { [k: string]: any }): PushParams;

    /**
     * Creates a plain object from a PushParams message. Also converts values to other types if specified.
     * @param message PushParams
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PushParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PushParams to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
