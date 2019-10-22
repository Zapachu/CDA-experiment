
export interface ICreateParams {
    playersPerGroup?: (number | null);
    rounds?: (number | null);
    gameType?: (number | null);
    version?: (number | null);
    minType?: (number | null);
    a?: (number | null);
    b?: (number | null);
    c?: (number | null);
    d?: (number | null);
    eH?: (number | null);
    eL?: (number | null);
    s?: (number | null);
    p?: (number | null);
    b0?: (number | null);
    b1?: (number | null);
    participationFee?: (number | null);
    nextPhaseKey?: (string | null);
    id?: (string | null);
}

export class CreateParams implements ICreateParams {
    public playersPerGroup: number;
    public rounds: number;
    public gameType: number;
    public version: number;
    public a: number;
    public b: number;
    public c: number;
    public d: number;
    public eH: number;
    public eL: number;
    public s: number;
    public p: number;
    public b0: number;
    public b1: number;
    public participationFee: number;
    public nextPhaseKey: string;
    public id: string;

    constructor(properties?: ICreateParams);

    public static create(properties?: ICreateParams): CreateParams;

    public static encode(message: ICreateParams, writer?: $protobuf.Writer): $protobuf.Writer;

    public static encodeDelimited(message: ICreateParams, writer?: $protobuf.Writer): $protobuf.Writer;

    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): CreateParams;

    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): CreateParams;

    public static verify(message: { [k: string]: any }): (string | null);

    public static fromObject(object: { [k: string]: any }): CreateParams;

    public static toObject(message: CreateParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

    public toJSON(): { [k: string]: any };
}

export interface IGameState {

    groups?: (GameState.IGroup[] | null);
}

export class GameState implements IGameState {

    public groups: GameState.IGroup[];

    constructor(properties?: IGameState);

    public static create(properties?: IGameState): GameState;

    public static encode(message: IGameState, writer?: $protobuf.Writer): $protobuf.Writer;

    public static encodeDelimited(message: IGameState, writer?: $protobuf.Writer): $protobuf.Writer;

    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): GameState;

    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): GameState;

    public static verify(message: { [k: string]: any }): (string | null);

    public static fromObject(object: { [k: string]: any }): GameState;

    public static toObject(message: GameState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    public toJSON(): { [k: string]: any };
}

export namespace GameState {

    interface IGroup {

        playerNum?: (number | null);

        probs?: (boolean[] | null);

        ones?: (boolean[] | null);

        mins?: (number[] | null);

        rounds?: {
            x1: number
            y1: number
            x: number
            y: number
            min: number
        }[];
    }

    class Group implements IGroup {

        public playerNum: number;
        public probs: boolean[];
        public ones: boolean[];
        public mins: number[];

        public rounds: {
            x1: number
            y1: number
            x: number
            y: number
            min: number
        }[];

        constructor(properties?: GameState.IGroup);

        public static create(properties?: GameState.IGroup): GameState.Group;

        public static encode(message: GameState.IGroup, writer?: $protobuf.Writer): $protobuf.Writer;

        public static encodeDelimited(message: GameState.IGroup, writer?: $protobuf.Writer): $protobuf.Writer;

        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): GameState.Group;

        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): GameState.Group;

        public static verify(message: { [k: string]: any }): (string | null);

        public static fromObject(object: { [k: string]: any }): GameState.Group;

        public static toObject(message: GameState.Group, options?: $protobuf.IConversionOptions): { [k: string]: any };

        public toJSON(): { [k: string]: any };
    }
}

export interface IPlayerState {

    groupIndex?: (number | null);

    positionIndex?: (number | null);

    seatNumber?: (string | null);

    stage?: (number | null);

    stageIndex?: (number | null);

    choices?: (PlayerState.IChoice[] | null);

    profits?: (number[] | null);

    finalProfit?: (number | null);

    surveyAnswers?: (string[] | null);

    roundIndex?: (number | null);

    mobile?: (string | null);
}

export class PlayerState implements IPlayerState {

    public groupIndex: number;
    public positionIndex: number;
    public seatNumber: string;
    public stage: number;
    public stageIndex: number;
    public choices: PlayerState.IChoice[];
    public profits: number[];
    public finalProfit: number;
    public surveyAnswers: string[];
    public roundIndex: number;
    public mobile: string;

    constructor(properties?: IPlayerState);

    public static create(properties?: IPlayerState): PlayerState;

    public static encode(message: IPlayerState, writer?: $protobuf.Writer): $protobuf.Writer;

    public static encodeDelimited(message: IPlayerState, writer?: $protobuf.Writer): $protobuf.Writer;

    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): PlayerState;

    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): PlayerState;

    public static verify(message: { [k: string]: any }): (string | null);

    public static fromObject(object: { [k: string]: any }): PlayerState;

    public static toObject(message: PlayerState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    public toJSON(): { [k: string]: any };
}

export namespace PlayerState {

    interface IChoice {

        c1?: (number | null);

        c2?: (number[] | null);

        c?: (number | null);
    }

    class Choice implements IChoice {

        public c1: number;
        public c2: number[];
        public c: number;

        constructor(properties?: PlayerState.IChoice);

        public static create(properties?: PlayerState.IChoice): PlayerState.Choice;

        public static encode(message: PlayerState.IChoice, writer?: $protobuf.Writer): $protobuf.Writer;

        public static encodeDelimited(message: PlayerState.IChoice, writer?: $protobuf.Writer): $protobuf.Writer;

        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): PlayerState.Choice;

        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): PlayerState.Choice;

        public static verify(message: { [k: string]: any }): (string | null);

        public static fromObject(object: { [k: string]: any }): PlayerState.Choice;

        public static toObject(message: PlayerState.Choice, options?: $protobuf.IConversionOptions): { [k: string]: any };

        public toJSON(): { [k: string]: any };
    }
}

export interface IMoveParams {

    seatNumber?: (string | null);

    c1?: (number | null);

    c2?: (number[] | null);

    surveys?: (string[] | null);

    nextRoundIndex?: (number | null);
}

export class MoveParams implements IMoveParams {

    public seatNumber: string;
    public c1: number;
    public c2: number[];
    public surveys: string[];
    public nextRoundIndex: number;

    constructor(properties?: IMoveParams);

    public static create(properties?: IMoveParams): MoveParams;

    public static encode(message: IMoveParams, writer?: $protobuf.Writer): $protobuf.Writer;

    public static encodeDelimited(message: IMoveParams, writer?: $protobuf.Writer): $protobuf.Writer;

    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): MoveParams;

    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): MoveParams;

    public static verify(message: { [k: string]: any }): (string | null);

    public static fromObject(object: { [k: string]: any }): MoveParams;

    public static toObject(message: MoveParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

    public toJSON(): { [k: string]: any };
}

export interface IPushParams {
}

export class PushParams implements IPushParams {

    constructor(properties?: IPushParams);

    public static create(properties?: IPushParams): PushParams;

    public static encode(message: IPushParams, writer?: $protobuf.Writer): $protobuf.Writer;

    public static encodeDelimited(message: IPushParams, writer?: $protobuf.Writer): $protobuf.Writer;

    public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): PushParams;

    public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): PushParams;

    public static verify(message: { [k: string]: any }): (string | null);

    public static fromObject(object: { [k: string]: any }): PushParams;

    public static toObject(message: PushParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

    public toJSON(): { [k: string]: any };
}
