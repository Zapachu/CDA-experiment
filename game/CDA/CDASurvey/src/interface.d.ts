import * as $protobuf from "protobufjs";
/** Properties of a CreateParams. */
export interface ICreateParams {}

/** Represents a CreateParams. */
export class CreateParams implements ICreateParams {
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

  /** PlayerState surveyStage */
  surveyStage?: number | null;

  /** PlayerState surveyBasic */
  surveyBasic?: string[] | null;

  /** PlayerState surveyFeedback */
  surveyFeedback?: string[] | null;

  /** PlayerState surveyTest */
  surveyTest?: string[] | null;
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

  /** PlayerState surveyStage. */
  public surveyStage: number;

  /** PlayerState surveyBasic. */
  public surveyBasic: string[];

  /** PlayerState surveyFeedback. */
  public surveyFeedback: string[];

  /** PlayerState surveyTest. */
  public surveyTest: string[];

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

/** Properties of a MoveParams. */
export interface IMoveParams {
  /** MoveParams seatNumber */
  seatNumber?: number | null;

  /** MoveParams inputs */
  inputs?: string[] | null;

  /** MoveParams stage */
  stage?: number | null;
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

  /** MoveParams inputs. */
  public inputs: string[];

  /** MoveParams stage. */
  public stage: number;

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
