import * as $protobuf from "protobufjs";
/** Properties of a CreateParams. */
export interface ICreateParams {

    /** CreateParams phases */
    phases?: (CreateParams.IPhase[]|null);

    /** CreateParams nextPhaseKey */
    nextPhaseKey?: (string|null);
}

/** Represents a CreateParams. */
export class CreateParams implements ICreateParams {

    /**
     * Constructs a new CreateParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICreateParams);

    /** CreateParams phases. */
    public phases: CreateParams.IPhase[];

    /** CreateParams nextPhaseKey. */
    public nextPhaseKey: string;

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

    /** Properties of a Phase. */
    interface IPhase {

        /** Phase templateName */
        templateName?: (string|null);

        /** Phase params */
        params?: (CreateParams.Phase.IParams|null);
    }

    /** Represents a Phase. */
    class Phase implements IPhase {

        /**
         * Constructs a new Phase.
         * @param [properties] Properties to set
         */
        constructor(properties?: CreateParams.IPhase);

        /** Phase templateName. */
        public templateName: string;

        /** Phase params. */
        public params?: (CreateParams.Phase.IParams|null);

        /**
         * Creates a new Phase instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Phase instance
         */
        public static create(properties?: CreateParams.IPhase): CreateParams.Phase;

        /**
         * Encodes the specified Phase message. Does not implicitly {@link CreateParams.Phase.verify|verify} messages.
         * @param message Phase message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: CreateParams.IPhase, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Phase message, length delimited. Does not implicitly {@link CreateParams.Phase.verify|verify} messages.
         * @param message Phase message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: CreateParams.IPhase, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Phase message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Phase
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CreateParams.Phase;

        /**
         * Decodes a Phase message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Phase
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CreateParams.Phase;

        /**
         * Verifies a Phase message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Phase message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Phase
         */
        public static fromObject(object: { [k: string]: any }): CreateParams.Phase;

        /**
         * Creates a plain object from a Phase message. Also converts values to other types if specified.
         * @param message Phase
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: CreateParams.Phase, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Phase to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Phase {

        /** Properties of a Params. */
        interface IParams {

            /** Params participationFee */
            participationFee?: (number|null);

            /** Params positions */
            positions?: (CreateParams.Phase.Params.IPosition[]|null);

            /** Params practicePhase */
            practicePhase?: (boolean|null);

            /** Params time2ReadInfo */
            time2ReadInfo?: (number|null);

            /** Params durationOfEachPeriod */
            durationOfEachPeriod?: (number|null);

            /** Params unitLists */
            unitLists?: (string[]|null);

            /** Params startTime */
            startTime?: (number[]|null);
        }

        /** Represents a Params. */
        class Params implements IParams {

            /**
             * Constructs a new Params.
             * @param [properties] Properties to set
             */
            constructor(properties?: CreateParams.Phase.IParams);

            /** Params participationFee. */
            public participationFee: number;

            /** Params positions. */
            public positions: CreateParams.Phase.Params.IPosition[];

            /** Params practicePhase. */
            public practicePhase: boolean;

            /** Params time2ReadInfo. */
            public time2ReadInfo: number;

            /** Params durationOfEachPeriod. */
            public durationOfEachPeriod: number;

            /** Params unitLists. */
            public unitLists: string[];

            /** Params startTime. */
            public startTime: number[];

            /**
             * Creates a new Params instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Params instance
             */
            public static create(properties?: CreateParams.Phase.IParams): CreateParams.Phase.Params;

            /**
             * Encodes the specified Params message. Does not implicitly {@link CreateParams.Phase.Params.verify|verify} messages.
             * @param message Params message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: CreateParams.Phase.IParams, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Params message, length delimited. Does not implicitly {@link CreateParams.Phase.Params.verify|verify} messages.
             * @param message Params message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: CreateParams.Phase.IParams, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Params message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Params
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CreateParams.Phase.Params;

            /**
             * Decodes a Params message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Params
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CreateParams.Phase.Params;

            /**
             * Verifies a Params message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Params message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Params
             */
            public static fromObject(object: { [k: string]: any }): CreateParams.Phase.Params;

            /**
             * Creates a plain object from a Params message. Also converts values to other types if specified.
             * @param message Params
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: CreateParams.Phase.Params, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Params to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace Params {

            /** Properties of a Position. */
            interface IPosition {

                /** Position role */
                role?: (number|null);

                /** Position identity */
                identity?: (number|null);

                /** Position exchangeRate */
                exchangeRate?: (number|null);

                /** Position k */
                k?: (number|null);

                /** Position interval */
                interval?: (number|null);
            }

            /** Represents a Position. */
            class Position implements IPosition {

                /**
                 * Constructs a new Position.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: CreateParams.Phase.Params.IPosition);

                /** Position role. */
                public role: number;

                /** Position identity. */
                public identity: number;

                /** Position exchangeRate. */
                public exchangeRate: number;

                /** Position k. */
                public k: number;

                /** Position interval. */
                public interval: number;

                /**
                 * Creates a new Position instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Position instance
                 */
                public static create(properties?: CreateParams.Phase.Params.IPosition): CreateParams.Phase.Params.Position;

                /**
                 * Encodes the specified Position message. Does not implicitly {@link CreateParams.Phase.Params.Position.verify|verify} messages.
                 * @param message Position message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: CreateParams.Phase.Params.IPosition, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Position message, length delimited. Does not implicitly {@link CreateParams.Phase.Params.Position.verify|verify} messages.
                 * @param message Position message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: CreateParams.Phase.Params.IPosition, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Position message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Position
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CreateParams.Phase.Params.Position;

                /**
                 * Decodes a Position message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Position
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CreateParams.Phase.Params.Position;

                /**
                 * Verifies a Position message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Position message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Position
                 */
                public static fromObject(object: { [k: string]: any }): CreateParams.Phase.Params.Position;

                /**
                 * Creates a plain object from a Position message. Also converts values to other types if specified.
                 * @param message Position
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: CreateParams.Phase.Params.Position, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Position to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }
    }
}

/** Properties of a GameState. */
export interface IGameState {

    /** GameState gamePhaseIndex */
    gamePhaseIndex?: (number|null);

    /** GameState orders */
    orders?: (GameState.IOrder[]|null);

    /** GameState phases */
    phases?: (GameState.IGamePhaseState[]|null);

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

    /** GameState gamePhaseIndex. */
    public gamePhaseIndex: number;

    /** GameState orders. */
    public orders: GameState.IOrder[];

    /** GameState phases. */
    public phases: GameState.IGamePhaseState[];

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

    /** Properties of a GamePhaseState. */
    interface IGamePhaseState {

        /** GamePhaseState marketStage */
        marketStage?: (number|null);

        /** GamePhaseState orderId */
        orderId?: (number|null);

        /** GamePhaseState buyOrderIds */
        buyOrderIds?: (number[]|null);

        /** GamePhaseState sellOrderIds */
        sellOrderIds?: (number[]|null);

        /** GamePhaseState trades */
        trades?: (GameState.GamePhaseState.ITrade[]|null);

        /** GamePhaseState positionUnitIndex */
        positionUnitIndex?: (number[]|null);
    }

    /** Represents a GamePhaseState. */
    class GamePhaseState implements IGamePhaseState {

        /**
         * Constructs a new GamePhaseState.
         * @param [properties] Properties to set
         */
        constructor(properties?: GameState.IGamePhaseState);

        /** GamePhaseState marketStage. */
        public marketStage: number;

        /** GamePhaseState orderId. */
        public orderId: number;

        /** GamePhaseState buyOrderIds. */
        public buyOrderIds: number[];

        /** GamePhaseState sellOrderIds. */
        public sellOrderIds: number[];

        /** GamePhaseState trades. */
        public trades: GameState.GamePhaseState.ITrade[];

        /** GamePhaseState positionUnitIndex. */
        public positionUnitIndex: number[];

        /**
         * Creates a new GamePhaseState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GamePhaseState instance
         */
        public static create(properties?: GameState.IGamePhaseState): GameState.GamePhaseState;

        /**
         * Encodes the specified GamePhaseState message. Does not implicitly {@link GameState.GamePhaseState.verify|verify} messages.
         * @param message GamePhaseState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: GameState.IGamePhaseState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GamePhaseState message, length delimited. Does not implicitly {@link GameState.GamePhaseState.verify|verify} messages.
         * @param message GamePhaseState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: GameState.IGamePhaseState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GamePhaseState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GamePhaseState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameState.GamePhaseState;

        /**
         * Decodes a GamePhaseState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GamePhaseState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameState.GamePhaseState;

        /**
         * Verifies a GamePhaseState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GamePhaseState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GamePhaseState
         */
        public static fromObject(object: { [k: string]: any }): GameState.GamePhaseState;

        /**
         * Creates a plain object from a GamePhaseState message. Also converts values to other types if specified.
         * @param message GamePhaseState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: GameState.GamePhaseState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GamePhaseState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace GamePhaseState {

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
            constructor(properties?: GameState.GamePhaseState.ITrade);

            /** Trade reqId. */
            public reqId: number;

            /** Trade resId. */
            public resId: number;

            /**
             * Creates a new Trade instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Trade instance
             */
            public static create(properties?: GameState.GamePhaseState.ITrade): GameState.GamePhaseState.Trade;

            /**
             * Encodes the specified Trade message. Does not implicitly {@link GameState.GamePhaseState.Trade.verify|verify} messages.
             * @param message Trade message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: GameState.GamePhaseState.ITrade, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Trade message, length delimited. Does not implicitly {@link GameState.GamePhaseState.Trade.verify|verify} messages.
             * @param message Trade message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: GameState.GamePhaseState.ITrade, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Trade message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Trade
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameState.GamePhaseState.Trade;

            /**
             * Decodes a Trade message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Trade
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameState.GamePhaseState.Trade;

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
            public static fromObject(object: { [k: string]: any }): GameState.GamePhaseState.Trade;

            /**
             * Creates a plain object from a Trade message. Also converts values to other types if specified.
             * @param message Trade
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: GameState.GamePhaseState.Trade, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Trade to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
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

    /** PlayerState unitLists */
    unitLists?: (string[]|null);

    /** PlayerState point */
    point?: (number|null);

    /** PlayerState phases */
    phases?: (PlayerState.IPlayerPhaseState[]|null);

    /** PlayerState seatNumber */
    seatNumber?: (number|null);
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

    /** PlayerState unitLists. */
    public unitLists: string[];

    /** PlayerState point. */
    public point: number;

    /** PlayerState phases. */
    public phases: PlayerState.IPlayerPhaseState[];

    /** PlayerState seatNumber. */
    public seatNumber: number;

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

export namespace PlayerState {

    /** Properties of a PlayerPhaseState. */
    interface IPlayerPhaseState {

        /** PlayerPhaseState periodProfit */
        periodProfit?: (number|null);

        /** PlayerPhaseState tradedCount */
        tradedCount?: (number|null);
    }

    /** Represents a PlayerPhaseState. */
    class PlayerPhaseState implements IPlayerPhaseState {

        /**
         * Constructs a new PlayerPhaseState.
         * @param [properties] Properties to set
         */
        constructor(properties?: PlayerState.IPlayerPhaseState);

        /** PlayerPhaseState periodProfit. */
        public periodProfit: number;

        /** PlayerPhaseState tradedCount. */
        public tradedCount: number;

        /**
         * Creates a new PlayerPhaseState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerPhaseState instance
         */
        public static create(properties?: PlayerState.IPlayerPhaseState): PlayerState.PlayerPhaseState;

        /**
         * Encodes the specified PlayerPhaseState message. Does not implicitly {@link PlayerState.PlayerPhaseState.verify|verify} messages.
         * @param message PlayerPhaseState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: PlayerState.IPlayerPhaseState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerPhaseState message, length delimited. Does not implicitly {@link PlayerState.PlayerPhaseState.verify|verify} messages.
         * @param message PlayerPhaseState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: PlayerState.IPlayerPhaseState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerPhaseState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerPhaseState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PlayerState.PlayerPhaseState;

        /**
         * Decodes a PlayerPhaseState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerPhaseState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PlayerState.PlayerPhaseState;

        /**
         * Verifies a PlayerPhaseState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerPhaseState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerPhaseState
         */
        public static fromObject(object: { [k: string]: any }): PlayerState.PlayerPhaseState;

        /**
         * Creates a plain object from a PlayerPhaseState message. Also converts values to other types if specified.
         * @param message PlayerPhaseState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: PlayerState.PlayerPhaseState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerPhaseState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a MoveParams. */
export interface IMoveParams {

    /** MoveParams price */
    price?: (number|null);

    /** MoveParams unitIndex */
    unitIndex?: (number|null);

    /** MoveParams gamePhaseIndex */
    gamePhaseIndex?: (number|null);

    /** MoveParams playerPhaseIndex */
    playerPhaseIndex?: (number|null);

    /** MoveParams seatNumber */
    seatNumber?: (number|null);
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

    /** MoveParams gamePhaseIndex. */
    public gamePhaseIndex: number;

    /** MoveParams playerPhaseIndex. */
    public playerPhaseIndex: number;

    /** MoveParams seatNumber. */
    public seatNumber: number;

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