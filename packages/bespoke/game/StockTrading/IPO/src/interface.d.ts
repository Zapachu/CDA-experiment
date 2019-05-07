import * as $protobuf from "protobufjs";
/** Properties of a CreateParams. */
export interface ICreateParams {

    /** CreateParams nextPhaseKey */
    nextPhaseKey?: (string|null);

    /** CreateParams groupSize */
    groupSize?: (number|null);

    /** CreateParams total */
    total?: (number|null);

    /** CreateParams type */
    type?: (number|null);
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

    /** CreateParams groupSize. */
    public groupSize: number;

    /** CreateParams total. */
    public total: number;

    /** CreateParams type. */
    public type: number;

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

/** Properties of a MoveParams. */
export interface IMoveParams {

    /** MoveParams price */
    price?: (number|null);

    /** MoveParams num */
    num?: (number|null);
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

    /** MoveParams num. */
    public num: number;

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

    /** PushParams matchTimer */
    matchTimer?: (number|null);

    /** PushParams matchMsg */
    matchMsg?: (string|null);

    /** PushParams groupIndex */
    groupIndex?: (number|null);

    /** PushParams matchNum */
    matchNum?: (number|null);
}

/** Represents a PushParams. */
export class PushParams implements IPushParams {

    /**
     * Constructs a new PushParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPushParams);

    /** PushParams matchTimer. */
    public matchTimer: number;

    /** PushParams matchMsg. */
    public matchMsg: string;

    /** PushParams groupIndex. */
    public groupIndex: number;

    /** PushParams matchNum. */
    public matchNum: number;

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

/** Properties of a GameState. */
export interface IGameState {

    /** GameState groups */
    groups?: (GameState.IGroup[]|null);
}

/** Represents a GameState. */
export class GameState implements IGameState {

    /**
     * Constructs a new GameState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameState);

    /** GameState groups. */
    public groups: GameState.IGroup[];

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

    /** Properties of a Group. */
    interface IGroup {

        /** Group players */
        players?: (string[]|null);

        /** Group strikePrice */
        strikePrice?: (number|null);

        /** Group min */
        min?: (number|null);

        /** Group max */
        max?: (number|null);
    }

    /** Represents a Group. */
    class Group implements IGroup {

        /**
         * Constructs a new Group.
         * @param [properties] Properties to set
         */
        constructor(properties?: GameState.IGroup);

        /** Group players. */
        public players: string[];

        /** Group strikePrice. */
        public strikePrice: number;

        /** Group min. */
        public min: number;

        /** Group max. */
        public max: number;

        /**
         * Creates a new Group instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Group instance
         */
        public static create(properties?: GameState.IGroup): GameState.Group;

        /**
         * Encodes the specified Group message. Does not implicitly {@link GameState.Group.verify|verify} messages.
         * @param message Group message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: GameState.IGroup, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Group message, length delimited. Does not implicitly {@link GameState.Group.verify|verify} messages.
         * @param message Group message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: GameState.IGroup, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Group message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Group
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameState.Group;

        /**
         * Decodes a Group message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Group
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameState.Group;

        /**
         * Verifies a Group message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Group message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Group
         */
        public static fromObject(object: { [k: string]: any }): GameState.Group;

        /**
         * Creates a plain object from a Group message. Also converts values to other types if specified.
         * @param message Group
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: GameState.Group, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Group to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a PlayerState. */
export interface IPlayerState {

    /** PlayerState multi */
    multi?: (PlayerState.IMulti|null);

    /** PlayerState single */
    single?: (PlayerState.ISingle|null);

    /** PlayerState playerStatus */
    playerStatus?: (number|null);
}

/** Represents a PlayerState. */
export class PlayerState implements IPlayerState {

    /**
     * Constructs a new PlayerState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPlayerState);

    /** PlayerState multi. */
    public multi?: (PlayerState.IMulti|null);

    /** PlayerState single. */
    public single?: (PlayerState.ISingle|null);

    /** PlayerState playerStatus. */
    public playerStatus: number;

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

    /** Properties of a Multi. */
    interface IMulti {

        /** Multi groupIndex */
        groupIndex?: (number|null);

        /** Multi positionIndex */
        positionIndex?: (number|null);

        /** Multi privateValue */
        privateValue?: (number|null);

        /** Multi price */
        price?: (number|null);

        /** Multi bidNum */
        bidNum?: (number|null);

        /** Multi actualNum */
        actualNum?: (number|null);

        /** Multi profit */
        profit?: (number|null);

        /** Multi startingPrice */
        startingPrice?: (number|null);
    }

    /** Represents a Multi. */
    class Multi implements IMulti {

        /**
         * Constructs a new Multi.
         * @param [properties] Properties to set
         */
        constructor(properties?: PlayerState.IMulti);

        /** Multi groupIndex. */
        public groupIndex: number;

        /** Multi positionIndex. */
        public positionIndex: number;

        /** Multi privateValue. */
        public privateValue: number;

        /** Multi price. */
        public price: number;

        /** Multi bidNum. */
        public bidNum: number;

        /** Multi actualNum. */
        public actualNum: number;

        /** Multi profit. */
        public profit: number;

        /** Multi startingPrice. */
        public startingPrice: number;

        /**
         * Creates a new Multi instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Multi instance
         */
        public static create(properties?: PlayerState.IMulti): PlayerState.Multi;

        /**
         * Encodes the specified Multi message. Does not implicitly {@link PlayerState.Multi.verify|verify} messages.
         * @param message Multi message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: PlayerState.IMulti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Multi message, length delimited. Does not implicitly {@link PlayerState.Multi.verify|verify} messages.
         * @param message Multi message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: PlayerState.IMulti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Multi message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Multi
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PlayerState.Multi;

        /**
         * Decodes a Multi message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Multi
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PlayerState.Multi;

        /**
         * Verifies a Multi message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Multi message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Multi
         */
        public static fromObject(object: { [k: string]: any }): PlayerState.Multi;

        /**
         * Creates a plain object from a Multi message. Also converts values to other types if specified.
         * @param message Multi
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: PlayerState.Multi, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Multi to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Single. */
    interface ISingle {

        /** Single roundIndex */
        roundIndex?: (number|null);

        /** Single rounds */
        rounds?: (PlayerState.Single.IRound[]|null);
    }

    /** Represents a Single. */
    class Single implements ISingle {

        /**
         * Constructs a new Single.
         * @param [properties] Properties to set
         */
        constructor(properties?: PlayerState.ISingle);

        /** Single roundIndex. */
        public roundIndex: number;

        /** Single rounds. */
        public rounds: PlayerState.Single.IRound[];

        /**
         * Creates a new Single instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Single instance
         */
        public static create(properties?: PlayerState.ISingle): PlayerState.Single;

        /**
         * Encodes the specified Single message. Does not implicitly {@link PlayerState.Single.verify|verify} messages.
         * @param message Single message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: PlayerState.ISingle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Single message, length delimited. Does not implicitly {@link PlayerState.Single.verify|verify} messages.
         * @param message Single message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: PlayerState.ISingle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Single message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Single
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PlayerState.Single;

        /**
         * Decodes a Single message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Single
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PlayerState.Single;

        /**
         * Verifies a Single message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Single message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Single
         */
        public static fromObject(object: { [k: string]: any }): PlayerState.Single;

        /**
         * Creates a plain object from a Single message. Also converts values to other types if specified.
         * @param message Single
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: PlayerState.Single, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Single to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Single {

        /** Properties of a Round. */
        interface IRound {

            /** Round privateValue */
            privateValue?: (number|null);

            /** Round price */
            price?: (number|null);

            /** Round bidNum */
            bidNum?: (number|null);

            /** Round actualNum */
            actualNum?: (number|null);

            /** Round profit */
            profit?: (number|null);

            /** Round startingPrice */
            startingPrice?: (number|null);

            /** Round strikePrice */
            strikePrice?: (number|null);

            /** Round min */
            min?: (number|null);

            /** Round max */
            max?: (number|null);
        }

        /** Represents a Round. */
        class Round implements IRound {

            /**
             * Constructs a new Round.
             * @param [properties] Properties to set
             */
            constructor(properties?: PlayerState.Single.IRound);

            /** Round privateValue. */
            public privateValue: number;

            /** Round price. */
            public price: number;

            /** Round bidNum. */
            public bidNum: number;

            /** Round actualNum. */
            public actualNum: number;

            /** Round profit. */
            public profit: number;

            /** Round startingPrice. */
            public startingPrice: number;

            /** Round strikePrice. */
            public strikePrice: number;

            /** Round min. */
            public min: number;

            /** Round max. */
            public max: number;

            /**
             * Creates a new Round instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Round instance
             */
            public static create(properties?: PlayerState.Single.IRound): PlayerState.Single.Round;

            /**
             * Encodes the specified Round message. Does not implicitly {@link PlayerState.Single.Round.verify|verify} messages.
             * @param message Round message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: PlayerState.Single.IRound, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Round message, length delimited. Does not implicitly {@link PlayerState.Single.Round.verify|verify} messages.
             * @param message Round message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: PlayerState.Single.IRound, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Round message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Round
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PlayerState.Single.Round;

            /**
             * Decodes a Round message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Round
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PlayerState.Single.Round;

            /**
             * Verifies a Round message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Round message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Round
             */
            public static fromObject(object: { [k: string]: any }): PlayerState.Single.Round;

            /**
             * Creates a plain object from a Round message. Also converts values to other types if specified.
             * @param message Round
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: PlayerState.Single.Round, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Round to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
