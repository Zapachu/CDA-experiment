import * as $protobuf from "protobufjs";
/** Properties of a CreateParams. */
export interface ICreateParams {

    /** CreateParams nextPhaseKey */
    nextPhaseKey?: (string|null);

    /** CreateParams roles */
    roles?: (number[]|null);

    /** CreateParams time2ReadInfo */
    time2ReadInfo?: (number|null);

    /** CreateParams durationOfEachPeriod */
    durationOfEachPeriod?: (number|null);

    /** CreateParams unitLists */
    unitLists?: (string[]|null);
}

/** Represents a CreateParams. */
export class CreateParams implements ICreateParams {

    /**
     * Constructs a new CreateParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICreateParams);

    /** CreateParams nextPhaseKey. */
    public nextPhaseKey: string;

    /** CreateParams roles. */
    public roles: number[];

    /** CreateParams time2ReadInfo. */
    public time2ReadInfo: number;

    /** CreateParams durationOfEachPeriod. */
    public durationOfEachPeriod: number;

    /** CreateParams unitLists. */
    public unitLists: string[];

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

/** Properties of a GameState. */
export interface IGameState {

    /** GameState marketStage */
    marketStage?: (number|null);

    /** GameState orderId */
    orderId?: (number|null);

    /** GameState buyOrderIds */
    buyOrderIds?: (number[]|null);

    /** GameState sellOrderIds */
    sellOrderIds?: (number[]|null);

    /** GameState trades */
    trades?: (GameState.ITrade[]|null);

    /** GameState positionUnitIndex */
    positionUnitIndex?: (number[]|null);

    /** GameState orders */
    orders?: (GameState.IOrder[]|null);

    /** GameState positionAssigned */
    positionAssigned?: (boolean|null);
}

/** Represents a GameState. */
export class GameState implements IGameState {

    /**
     * Constructs a new GameState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameState);

    /** GameState marketStage. */
    public marketStage: number;

    /** GameState orderId. */
    public orderId: number;

    /** GameState buyOrderIds. */
    public buyOrderIds: number[];

    /** GameState sellOrderIds. */
    public sellOrderIds: number[];

    /** GameState trades. */
    public trades: GameState.ITrade[];

    /** GameState positionUnitIndex. */
    public positionUnitIndex: number[];

    /** GameState orders. */
    public orders: GameState.IOrder[];

    /** GameState positionAssigned. */
    public positionAssigned: boolean;

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

export namespace GameState {

    /** Properties of an Order. */
    interface IOrder {

        /** Order id */
        id?: (number|null);

        /** Order positionIndex */
        positionIndex?: (number|null);

        /** Order unitIndex */
        unitIndex?: (number|null);

        /** Order price */
        price?: (number|null);
    }

    /** Represents an Order. */
    class Order implements IOrder {

        /**
         * Constructs a new Order.
         * @param [properties] Properties to set
         */
        constructor(properties?: GameState.IOrder);

        /** Order id. */
        public id: number;

        /** Order positionIndex. */
        public positionIndex: number;

        /** Order unitIndex. */
        public unitIndex: number;

        /** Order price. */
        public price: number;

        /**
         * Creates a new Order instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Order instance
         */
        public static create(properties?: GameState.IOrder): GameState.Order;

        /**
         * Encodes the specified Order message. Does not implicitly {@link GameState.Order.verify|verify} messages.
         * @param message Order message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: GameState.IOrder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Order message, length delimited. Does not implicitly {@link GameState.Order.verify|verify} messages.
         * @param message Order message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: GameState.IOrder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Order message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Order
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameState.Order;

        /**
         * Decodes an Order message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Order
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameState.Order;

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
        public static fromObject(object: { [k: string]: any }): GameState.Order;

        /**
         * Creates a plain object from an Order message. Also converts values to other types if specified.
         * @param message Order
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: GameState.Order, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Order to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Trade. */
    interface ITrade {

        /** Trade reqId */
        reqId?: (number|null);

        /** Trade resId */
        resId?: (number|null);
    }

    /** Represents a Trade. */
    class Trade implements ITrade {

        /**
         * Constructs a new Trade.
         * @param [properties] Properties to set
         */
        constructor(properties?: GameState.ITrade);

        /** Trade reqId. */
        public reqId: number;

        /** Trade resId. */
        public resId: number;

        /**
         * Creates a new Trade instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Trade instance
         */
        public static create(properties?: GameState.ITrade): GameState.Trade;

        /**
         * Encodes the specified Trade message. Does not implicitly {@link GameState.Trade.verify|verify} messages.
         * @param message Trade message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: GameState.ITrade, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Trade message, length delimited. Does not implicitly {@link GameState.Trade.verify|verify} messages.
         * @param message Trade message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: GameState.ITrade, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Trade message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Trade
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameState.Trade;

        /**
         * Decodes a Trade message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Trade
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameState.Trade;

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
        public static fromObject(object: { [k: string]: any }): GameState.Trade;

        /**
         * Creates a plain object from a Trade message. Also converts values to other types if specified.
         * @param message Trade
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: GameState.Trade, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Trade to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a PlayerState. */
export interface IPlayerState {

    /** PlayerState token */
    token?: (string|null);

    /** PlayerState status */
    status?: (number|null);

    /** PlayerState positionIndex */
    positionIndex?: (number|null);

    /** PlayerState unitList */
    unitList?: (string|null);

    /** PlayerState point */
    point?: (number|null);

    /** PlayerState tradedCount */
    tradedCount?: (number|null);
}

/** Represents a PlayerState. */
export class PlayerState implements IPlayerState {

    /**
     * Constructs a new PlayerState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPlayerState);

    /** PlayerState token. */
    public token: string;

    /** PlayerState status. */
    public status: number;

    /** PlayerState positionIndex. */
    public positionIndex: number;

    /** PlayerState unitList. */
    public unitList: string;

    /** PlayerState point. */
    public point: number;

    /** PlayerState tradedCount. */
    public tradedCount: number;

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

    /** MoveParams price */
    price?: (number|null);

    /** MoveParams unitIndex */
    unitIndex?: (number|null);
}

/** Represents a MoveParams. */
export class MoveParams implements IMoveParams {

    /**
     * Constructs a new MoveParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMoveParams);

    /** MoveParams price. */
    public price: number;

    /** MoveParams unitIndex. */
    public unitIndex: number;

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

    /** PushParams newOrderId */
    newOrderId?: (number|null);

    /** PushParams resOrderId */
    resOrderId?: (number|null);

    /** PushParams periodCountDown */
    periodCountDown?: (number|null);
}

/** Represents a PushParams. */
export class PushParams implements IPushParams {

    /**
     * Constructs a new PushParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPushParams);

    /** PushParams newOrderId. */
    public newOrderId: number;

    /** PushParams resOrderId. */
    public resOrderId: number;

    /** PushParams periodCountDown. */
    public periodCountDown: number;

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
