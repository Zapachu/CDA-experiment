import * as $protobuf from "protobufjs";
/** Properties of a CreateParams. */
export interface ICreateParams {
  /** CreateParams nextPhaseKey */
  nextPhaseKey?: string | null;

  /** CreateParams exchangeRate */
  exchangeRate?: number | null;

  /** CreateParams timeLimit */
  timeLimit?: number | null;
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

  /** CreateParams exchangeRate. */
  public exchangeRate: number;

  /** CreateParams timeLimit. */
  public timeLimit: number;

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
  public static encode(
    message: ICreateParams,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Encodes the specified CreateParams message, length delimited. Does not implicitly {@link CreateParams.verify|verify} messages.
   * @param message CreateParams message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: ICreateParams,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Decodes a CreateParams message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns CreateParams
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number
  ): CreateParams;

  /**
   * Decodes a CreateParams message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns CreateParams
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array
  ): CreateParams;

  /**
   * Verifies a CreateParams message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null;

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
  public static toObject(
    message: CreateParams,
    options?: $protobuf.IConversionOptions
  ): { [k: string]: any };

  /**
   * Converts this CreateParams to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any };
}

/** Properties of a GameState. */
export interface IGameState {
  /** GameState gameStage */
  gameStage?: number | null;

  /** GameState time */
  time?: number | null;
}

/** Represents a GameState. */
export class GameState implements IGameState {
  /**
   * Constructs a new GameState.
   * @param [properties] Properties to set
   */
  constructor(properties?: IGameState);

  /** GameState gameStage. */
  public gameStage: number;

  /** GameState time. */
  public time: number;

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
  public static encode(
    message: IGameState,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Encodes the specified GameState message, length delimited. Does not implicitly {@link GameState.verify|verify} messages.
   * @param message GameState message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IGameState,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Decodes a GameState message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns GameState
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number
  ): GameState;

  /**
   * Decodes a GameState message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns GameState
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array
  ): GameState;

  /**
   * Verifies a GameState message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null;

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
  public static toObject(
    message: GameState,
    options?: $protobuf.IConversionOptions
  ): { [k: string]: any };

  /**
   * Converts this GameState to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any };
}

/** Properties of a PlayerState. */
export interface IPlayerState {
  /** PlayerState seatNumber */
  seatNumber?: number | null;

  /** PlayerState anwsers */
  anwsers?: PlayerState.IAnwser[] | null;

  /** PlayerState result */
  result?: PlayerState.IResult | null;
}

/** Represents a PlayerState. */
export class PlayerState implements IPlayerState {
  /**
   * Constructs a new PlayerState.
   * @param [properties] Properties to set
   */
  constructor(properties?: IPlayerState);

  /** PlayerState seatNumber. */
  public seatNumber: number;

  /** PlayerState anwsers. */
  public anwsers: PlayerState.IAnwser[];

  /** PlayerState result. */
  public result?: PlayerState.IResult | null;

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
  public static encode(
    message: IPlayerState,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Encodes the specified PlayerState message, length delimited. Does not implicitly {@link PlayerState.verify|verify} messages.
   * @param message PlayerState message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IPlayerState,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Decodes a PlayerState message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns PlayerState
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number
  ): PlayerState;

  /**
   * Decodes a PlayerState message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns PlayerState
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array
  ): PlayerState;

  /**
   * Verifies a PlayerState message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null;

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
  public static toObject(
    message: PlayerState,
    options?: $protobuf.IConversionOptions
  ): { [k: string]: any };

  /**
   * Converts this PlayerState to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any };
}

export namespace PlayerState {
  /** Properties of an Anwser. */
  interface IAnwser {
    /** Anwser emotion */
    emotion?: number | null;

    /** Anwser gender */
    gender?: number | null;

    /** Anwser time */
    time?: number | null;
  }

  /** Represents an Anwser. */
  class Anwser implements IAnwser {
    /**
     * Constructs a new Anwser.
     * @param [properties] Properties to set
     */
    constructor(properties?: PlayerState.IAnwser);

    /** Anwser emotion. */
    public emotion: number;

    /** Anwser gender. */
    public gender: number;

    /** Anwser time. */
    public time: number;

    /**
     * Creates a new Anwser instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Anwser instance
     */
    public static create(properties?: PlayerState.IAnwser): PlayerState.Anwser;

    /**
     * Encodes the specified Anwser message. Does not implicitly {@link PlayerState.Anwser.verify|verify} messages.
     * @param message Anwser message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: PlayerState.IAnwser,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Anwser message, length delimited. Does not implicitly {@link PlayerState.Anwser.verify|verify} messages.
     * @param message Anwser message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: PlayerState.IAnwser,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an Anwser message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Anwser
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): PlayerState.Anwser;

    /**
     * Decodes an Anwser message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Anwser
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): PlayerState.Anwser;

    /**
     * Verifies an Anwser message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Anwser message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Anwser
     */
    public static fromObject(object: { [k: string]: any }): PlayerState.Anwser;

    /**
     * Creates a plain object from an Anwser message. Also converts values to other types if specified.
     * @param message Anwser
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: PlayerState.Anwser,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Anwser to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }

  /** Properties of a Result. */
  interface IResult {
    /** Result genderNum */
    genderNum?: number | null;

    /** Result emotionNum */
    emotionNum?: number | null;

    /** Result point */
    point?: number | null;
  }

  /** Represents a Result. */
  class Result implements IResult {
    /**
     * Constructs a new Result.
     * @param [properties] Properties to set
     */
    constructor(properties?: PlayerState.IResult);

    /** Result genderNum. */
    public genderNum: number;

    /** Result emotionNum. */
    public emotionNum: number;

    /** Result point. */
    public point: number;

    /**
     * Creates a new Result instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Result instance
     */
    public static create(properties?: PlayerState.IResult): PlayerState.Result;

    /**
     * Encodes the specified Result message. Does not implicitly {@link PlayerState.Result.verify|verify} messages.
     * @param message Result message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: PlayerState.IResult,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Result message, length delimited. Does not implicitly {@link PlayerState.Result.verify|verify} messages.
     * @param message Result message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: PlayerState.IResult,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Result message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): PlayerState.Result;

    /**
     * Decodes a Result message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): PlayerState.Result;

    /**
     * Verifies a Result message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Result message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Result
     */
    public static fromObject(object: { [k: string]: any }): PlayerState.Result;

    /**
     * Creates a plain object from a Result message. Also converts values to other types if specified.
     * @param message Result
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: PlayerState.Result,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Result to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }
}

/** Properties of a MoveParams. */
export interface IMoveParams {
  /** MoveParams seatNumber */
  seatNumber?: number | null;

  /** MoveParams newanwser */
  newanwser?: MoveParams.INewAnwser | null;
}

/** Represents a MoveParams. */
export class MoveParams implements IMoveParams {
  /**
   * Constructs a new MoveParams.
   * @param [properties] Properties to set
   */
  constructor(properties?: IMoveParams);

  /** MoveParams seatNumber. */
  public seatNumber: number;

  /** MoveParams newanwser. */
  public newanwser?: MoveParams.INewAnwser | null;

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
  public static encode(
    message: IMoveParams,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Encodes the specified MoveParams message, length delimited. Does not implicitly {@link MoveParams.verify|verify} messages.
   * @param message MoveParams message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IMoveParams,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Decodes a MoveParams message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns MoveParams
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number
  ): MoveParams;

  /**
   * Decodes a MoveParams message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns MoveParams
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array
  ): MoveParams;

  /**
   * Verifies a MoveParams message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null;

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
  public static toObject(
    message: MoveParams,
    options?: $protobuf.IConversionOptions
  ): { [k: string]: any };

  /**
   * Converts this MoveParams to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any };
}

export namespace MoveParams {
  /** Properties of a NewAnwser. */
  interface INewAnwser {
    /** NewAnwser index */
    index?: number | null;

    /** NewAnwser gender */
    gender?: number | null;

    /** NewAnwser emotion */
    emotion?: number | null;
  }

  /** Represents a NewAnwser. */
  class NewAnwser implements INewAnwser {
    /**
     * Constructs a new NewAnwser.
     * @param [properties] Properties to set
     */
    constructor(properties?: MoveParams.INewAnwser);

    /** NewAnwser index. */
    public index: number;

    /** NewAnwser gender. */
    public gender: number;

    /** NewAnwser emotion. */
    public emotion: number;

    /**
     * Creates a new NewAnwser instance using the specified properties.
     * @param [properties] Properties to set
     * @returns NewAnwser instance
     */
    public static create(
      properties?: MoveParams.INewAnwser
    ): MoveParams.NewAnwser;

    /**
     * Encodes the specified NewAnwser message. Does not implicitly {@link MoveParams.NewAnwser.verify|verify} messages.
     * @param message NewAnwser message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: MoveParams.INewAnwser,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified NewAnwser message, length delimited. Does not implicitly {@link MoveParams.NewAnwser.verify|verify} messages.
     * @param message NewAnwser message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: MoveParams.INewAnwser,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a NewAnwser message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns NewAnwser
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): MoveParams.NewAnwser;

    /**
     * Decodes a NewAnwser message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns NewAnwser
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): MoveParams.NewAnwser;

    /**
     * Verifies a NewAnwser message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a NewAnwser message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns NewAnwser
     */
    public static fromObject(object: {
      [k: string]: any;
    }): MoveParams.NewAnwser;

    /**
     * Creates a plain object from a NewAnwser message. Also converts values to other types if specified.
     * @param message NewAnwser
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: MoveParams.NewAnwser,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this NewAnwser to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
  }
}

/** Properties of a PushParams. */
export interface IPushParams {}

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
  public static encode(
    message: IPushParams,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Encodes the specified PushParams message, length delimited. Does not implicitly {@link PushParams.verify|verify} messages.
   * @param message PushParams message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IPushParams,
    writer?: $protobuf.Writer
  ): $protobuf.Writer;

  /**
   * Decodes a PushParams message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns PushParams
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number
  ): PushParams;

  /**
   * Decodes a PushParams message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns PushParams
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array
  ): PushParams;

  /**
   * Verifies a PushParams message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null;

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
  public static toObject(
    message: PushParams,
    options?: $protobuf.IConversionOptions
  ): { [k: string]: any };

  /**
   * Converts this PushParams to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any };
}
