import * as $protobuf from 'protobufjs';

/** Properties of a CreateParams. */
export interface ICreateParams {

    /** CreateParams playersPerGroup */
    playersPerGroup?: (number | null);

    /** CreateParams rounds */
    rounds?: (number | null);

    /** CreateParams gameType */
    gameType?: (number | null);

    /** CreateParams version */
    version?: (number | null);

    /** CreateParams a */
    a?: (number | null);

    /** CreateParams b */
    b?: (number | null);

    /** CreateParams c */
    c?: (number | null);

    /** CreateParams d */
    d?: (number | null);

    /** CreateParams eH */
    eH?: (number | null);

    /** CreateParams eL */
    eL?: (number | null);

    /** CreateParams s */
    s?: (number | null);

    /** CreateParams p */
    p?: (number | null);

    /** CreateParams b0 */
    b0?: (number | null);

    /** CreateParams b1 */
    b1?: (number | null);

    /** CreateParams participationFee */
    participationFee?: (number | null);

    /** CreateParams nextPhaseKey */
    nextPhaseKey?: (string | null);

    /** CreateParams id */
    id?: (string | null);
}

/** Represents a CreateParams. */
export class CreateParams implements ICreateParams {

    /** CreateParams playersPerGroup. */
    public playersPerGroup: number;
    /** CreateParams rounds. */
    public rounds: number;
    /** CreateParams gameType. */
    public gameType: number;
    /** CreateParams version. */
    public version: number;
    /** CreateParams a. */
    public a: number;
    /** CreateParams b. */
    public b: number;
    /** CreateParams c. */
    public c: number;
    /** CreateParams d. */
    public d: number;
    /** CreateParams eH. */
    public eH: number;
    /** CreateParams eL. */
    public eL: number;
    /** CreateParams s. */
    public s: number;
    /** CreateParams p. */
    public p: number;
    /** CreateParams b0. */
    public b0: number;
    /** CreateParams b1. */
    public b1: number;
    /** CreateParams participationFee. */
    public participationFee: number;
    /** CreateParams nextPhaseKey. */
    public nextPhaseKey: string;
    /** CreateParams id. */
    public id: string;

    /**
     * Constructs a new CreateParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICreateParams);

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
    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): CreateParams;

    /**
     * Decodes a CreateParams message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CreateParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): CreateParams;

    /**
     * Verifies a CreateParams message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string | null);

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

    /** GameState groups */
    groups?: (GameState.IGroup[] | null);
}

/** Represents a GameState. */
export class GameState implements IGameState {

    /** GameState groups. */
    public groups: GameState.IGroup[];

    /**
     * Constructs a new GameState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameState);

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
    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): GameState;

    /**
     * Decodes a GameState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): GameState;

    /**
     * Verifies a GameState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string | null);

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

        /** Group playerNum */
        playerNum?: (number | null);

        /** Group probs */
        probs?: (boolean[] | null);

        /** Group ones */
        ones?: (boolean[] | null);

        /** Group mins */
        mins?: (number[] | null);
    }

    /** Represents a Group. */
    class Group implements IGroup {

        /** Group playerNum. */
        public playerNum: number;
        /** Group probs. */
        public probs: boolean[];
        /** Group ones. */
        public ones: boolean[];
        /** Group mins. */
        public mins: number[];

        /**
         * Constructs a new Group.
         * @param [properties] Properties to set
         */
        constructor(properties?: GameState.IGroup);

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
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): GameState.Group;

        /**
         * Decodes a Group message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Group
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): GameState.Group;

        /**
         * Verifies a Group message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

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

    /** PlayerState groupIndex */
    groupIndex?: (number | null);

    /** PlayerState positionIndex */
    positionIndex?: (number | null);

    /** PlayerState seatNumber */
    seatNumber?: (string | null);

    /** PlayerState stage */
    stage?: (number | null);

    /** PlayerState stageIndex */
    stageIndex?: (number | null);

    /** PlayerState choices */
    choices?: (PlayerState.IChoice[] | null);

    /** PlayerState profits */
    profits?: (number[] | null);

    /** PlayerState finalProfit */
    finalProfit?: (number | null);

    /** PlayerState surveyAnswers */
    surveyAnswers?: (string[] | null);

    /** PlayerState roundIndex */
    roundIndex?: (number | null);

    /** PlayerState mobile */
    mobile?: (string | null);
}

/** Represents a PlayerState. */
export class PlayerState implements IPlayerState {

    /** PlayerState groupIndex. */
    public groupIndex: number;
    /** PlayerState positionIndex. */
    public positionIndex: number;
    /** PlayerState seatNumber. */
    public seatNumber: string;
    /** PlayerState stage. */
    public stage: number;
    /** PlayerState stageIndex. */
    public stageIndex: number;
    /** PlayerState choices. */
    public choices: PlayerState.IChoice[];
    /** PlayerState profits. */
    public profits: number[];
    /** PlayerState finalProfit. */
    public finalProfit: number;
    /** PlayerState surveyAnswers. */
    public surveyAnswers: string[];
    /** PlayerState roundIndex. */
    public roundIndex: number;
    /** PlayerState mobile. */
    public mobile: string;

    /**
     * Constructs a new PlayerState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPlayerState);

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
    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): PlayerState;

    /**
     * Decodes a PlayerState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PlayerState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): PlayerState;

    /**
     * Verifies a PlayerState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string | null);

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

    /** Properties of a Choice. */
    interface IChoice {

        /** Choice c1 */
        c1?: (number | null);

        /** Choice c2 */
        c2?: (number[] | null);

        /** Choice c */
        c?: (number | null);
    }

    /** Represents a Choice. */
    class Choice implements IChoice {

        /** Choice c1. */
        public c1: number;
        /** Choice c2. */
        public c2: number[];
        /** Choice c. */
        public c: number;

        /**
         * Constructs a new Choice.
         * @param [properties] Properties to set
         */
        constructor(properties?: PlayerState.IChoice);

        /**
         * Creates a new Choice instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Choice instance
         */
        public static create(properties?: PlayerState.IChoice): PlayerState.Choice;

        /**
         * Encodes the specified Choice message. Does not implicitly {@link PlayerState.Choice.verify|verify} messages.
         * @param message Choice message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: PlayerState.IChoice, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Choice message, length delimited. Does not implicitly {@link PlayerState.Choice.verify|verify} messages.
         * @param message Choice message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: PlayerState.IChoice, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Choice message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Choice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): PlayerState.Choice;

        /**
         * Decodes a Choice message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Choice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): PlayerState.Choice;

        /**
         * Verifies a Choice message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a Choice message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Choice
         */
        public static fromObject(object: { [k: string]: any }): PlayerState.Choice;

        /**
         * Creates a plain object from a Choice message. Also converts values to other types if specified.
         * @param message Choice
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: PlayerState.Choice, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Choice to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a MoveParams. */
export interface IMoveParams {

    /** MoveParams seatNumber */
    seatNumber?: (string | null);

    /** MoveParams c1 */
    c1?: (number | null);

    /** MoveParams c2 */
    c2?: (number[] | null);

    /** MoveParams surveys */
    surveys?: (string[] | null);

    /** MoveParams nextRoundIndex */
    nextRoundIndex?: (number | null);
}

/** Represents a MoveParams. */
export class MoveParams implements IMoveParams {

    /** MoveParams seatNumber. */
    public seatNumber: string;
    /** MoveParams c1. */
    public c1: number;
    /** MoveParams c2. */
    public c2: number[];
    /** MoveParams surveys. */
    public surveys: string[];
    /** MoveParams nextRoundIndex. */
    public nextRoundIndex: number;

    /**
     * Constructs a new MoveParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMoveParams);

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
    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): MoveParams;

    /**
     * Decodes a MoveParams message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MoveParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): MoveParams;

    /**
     * Verifies a MoveParams message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string | null);

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
}

/** Represents a PushParams. */
export class PushParams implements IPushParams {

    /**
     * Constructs a new PushParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPushParams);

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
    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): PushParams;

    /**
     * Decodes a PushParams message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PushParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): PushParams;

    /**
     * Verifies a PushParams message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string | null);

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
