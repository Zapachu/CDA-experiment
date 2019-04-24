import * as $protobuf from "protobufjs";
/** Represents a GameService */
export class GameService extends $protobuf.rpc.Service {

    /**
     * Constructs a new GameService service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new GameService service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): GameService;

    /**
     * Calls registerPhases.
     * @param request RegisterPhasesReq message or plain object
     * @param callback Node-style callback called with the error, if any, and RegisterPhasesRes
     */
    public registerPhases(request: IRegisterPhasesReq, callback: GameService.registerPhasesCallback): void;

    /**
     * Calls registerPhases.
     * @param request RegisterPhasesReq message or plain object
     * @returns Promise
     */
    public registerPhases(request: IRegisterPhasesReq): Promise<RegisterPhasesRes>;

    /**
     * Calls setPhaseResult.
     * @param request SetPhaseResultReq message or plain object
     * @param callback Node-style callback called with the error, if any, and SetPhaseResultRes
     */
    public setPhaseResult(request: ISetPhaseResultReq, callback: GameService.setPhaseResultCallback): void;

    /**
     * Calls setPhaseResult.
     * @param request SetPhaseResultReq message or plain object
     * @returns Promise
     */
    public setPhaseResult(request: ISetPhaseResultReq): Promise<SetPhaseResultRes>;

    /**
     * Calls sendBackPlayer.
     * @param request SendBackPlayerReq message or plain object
     * @param callback Node-style callback called with the error, if any, and SendBackPlayerRes
     */
    public sendBackPlayer(request: ISendBackPlayerReq, callback: GameService.sendBackPlayerCallback): void;

    /**
     * Calls sendBackPlayer.
     * @param request SendBackPlayerReq message or plain object
     * @returns Promise
     */
    public sendBackPlayer(request: ISendBackPlayerReq): Promise<SendBackPlayerRes>;
}

export namespace GameService {

    /**
     * Callback as used by {@link GameService#registerPhases}.
     * @param error Error, if any
     * @param [response] RegisterPhasesRes
     */
    type registerPhasesCallback = (error: (Error|null), response?: RegisterPhasesRes) => void;

    /**
     * Callback as used by {@link GameService#setPhaseResult}.
     * @param error Error, if any
     * @param [response] SetPhaseResultRes
     */
    type setPhaseResultCallback = (error: (Error|null), response?: SetPhaseResultRes) => void;

    /**
     * Callback as used by {@link GameService#sendBackPlayer}.
     * @param error Error, if any
     * @param [response] SendBackPlayerRes
     */
    type sendBackPlayerCallback = (error: (Error|null), response?: SendBackPlayerRes) => void;
}

/** Properties of a RegisterPhasesReq. */
export interface IRegisterPhasesReq {

    /** RegisterPhasesReq phases */
    phases?: (RegisterPhasesReq.IphaseRegInfo[]|null);
}

/** Represents a RegisterPhasesReq. */
export class RegisterPhasesReq implements IRegisterPhasesReq {

    /**
     * Constructs a new RegisterPhasesReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRegisterPhasesReq);

    /** RegisterPhasesReq phases. */
    public phases: RegisterPhasesReq.IphaseRegInfo[];

    /**
     * Creates a new RegisterPhasesReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RegisterPhasesReq instance
     */
    public static create(properties?: IRegisterPhasesReq): RegisterPhasesReq;

    /**
     * Encodes the specified RegisterPhasesReq message. Does not implicitly {@link RegisterPhasesReq.verify|verify} messages.
     * @param message RegisterPhasesReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRegisterPhasesReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RegisterPhasesReq message, length delimited. Does not implicitly {@link RegisterPhasesReq.verify|verify} messages.
     * @param message RegisterPhasesReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRegisterPhasesReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RegisterPhasesReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RegisterPhasesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RegisterPhasesReq;

    /**
     * Decodes a RegisterPhasesReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RegisterPhasesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RegisterPhasesReq;

    /**
     * Verifies a RegisterPhasesReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RegisterPhasesReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RegisterPhasesReq
     */
    public static fromObject(object: { [k: string]: any }): RegisterPhasesReq;

    /**
     * Creates a plain object from a RegisterPhasesReq message. Also converts values to other types if specified.
     * @param message RegisterPhasesReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RegisterPhasesReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RegisterPhasesReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace RegisterPhasesReq {

    /** Properties of a phaseRegInfo. */
    interface IphaseRegInfo {

        /** phaseRegInfo namespace */
        namespace?: (string|null);

        /** phaseRegInfo jsUrl */
        jsUrl?: (string|null);

        /** phaseRegInfo rpcPort */
        rpcPort?: (number|null);
    }

    /** Represents a phaseRegInfo. */
    class phaseRegInfo implements IphaseRegInfo {

        /**
         * Constructs a new phaseRegInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: RegisterPhasesReq.IphaseRegInfo);

        /** phaseRegInfo namespace. */
        public namespace: string;

        /** phaseRegInfo jsUrl. */
        public jsUrl: string;

        /** phaseRegInfo rpcPort. */
        public rpcPort: number;

        /**
         * Creates a new phaseRegInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns phaseRegInfo instance
         */
        public static create(properties?: RegisterPhasesReq.IphaseRegInfo): RegisterPhasesReq.phaseRegInfo;

        /**
         * Encodes the specified phaseRegInfo message. Does not implicitly {@link RegisterPhasesReq.phaseRegInfo.verify|verify} messages.
         * @param message phaseRegInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: RegisterPhasesReq.IphaseRegInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified phaseRegInfo message, length delimited. Does not implicitly {@link RegisterPhasesReq.phaseRegInfo.verify|verify} messages.
         * @param message phaseRegInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: RegisterPhasesReq.IphaseRegInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a phaseRegInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns phaseRegInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RegisterPhasesReq.phaseRegInfo;

        /**
         * Decodes a phaseRegInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns phaseRegInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RegisterPhasesReq.phaseRegInfo;

        /**
         * Verifies a phaseRegInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a phaseRegInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns phaseRegInfo
         */
        public static fromObject(object: { [k: string]: any }): RegisterPhasesReq.phaseRegInfo;

        /**
         * Creates a plain object from a phaseRegInfo message. Also converts values to other types if specified.
         * @param message phaseRegInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: RegisterPhasesReq.phaseRegInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this phaseRegInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a RegisterPhasesRes. */
export interface IRegisterPhasesRes {
}

/** Represents a RegisterPhasesRes. */
export class RegisterPhasesRes implements IRegisterPhasesRes {

    /**
     * Constructs a new RegisterPhasesRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRegisterPhasesRes);

    /**
     * Creates a new RegisterPhasesRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RegisterPhasesRes instance
     */
    public static create(properties?: IRegisterPhasesRes): RegisterPhasesRes;

    /**
     * Encodes the specified RegisterPhasesRes message. Does not implicitly {@link RegisterPhasesRes.verify|verify} messages.
     * @param message RegisterPhasesRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRegisterPhasesRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RegisterPhasesRes message, length delimited. Does not implicitly {@link RegisterPhasesRes.verify|verify} messages.
     * @param message RegisterPhasesRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRegisterPhasesRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RegisterPhasesRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RegisterPhasesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RegisterPhasesRes;

    /**
     * Decodes a RegisterPhasesRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RegisterPhasesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RegisterPhasesRes;

    /**
     * Verifies a RegisterPhasesRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RegisterPhasesRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RegisterPhasesRes
     */
    public static fromObject(object: { [k: string]: any }): RegisterPhasesRes;

    /**
     * Creates a plain object from a RegisterPhasesRes message. Also converts values to other types if specified.
     * @param message RegisterPhasesRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RegisterPhasesRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RegisterPhasesRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PhaseResult. */
export interface IPhaseResult {

    /** PhaseResult uniKey */
    uniKey?: (string|null);

    /** PhaseResult point */
    point?: (string|null);

    /** PhaseResult detailIframeUrl */
    detailIframeUrl?: (string|null);
}

/** Represents a PhaseResult. */
export class PhaseResult implements IPhaseResult {

    /**
     * Constructs a new PhaseResult.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPhaseResult);

    /** PhaseResult uniKey. */
    public uniKey: string;

    /** PhaseResult point. */
    public point: string;

    /** PhaseResult detailIframeUrl. */
    public detailIframeUrl: string;

    /**
     * Creates a new PhaseResult instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PhaseResult instance
     */
    public static create(properties?: IPhaseResult): PhaseResult;

    /**
     * Encodes the specified PhaseResult message. Does not implicitly {@link PhaseResult.verify|verify} messages.
     * @param message PhaseResult message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPhaseResult, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PhaseResult message, length delimited. Does not implicitly {@link PhaseResult.verify|verify} messages.
     * @param message PhaseResult message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPhaseResult, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PhaseResult message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PhaseResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PhaseResult;

    /**
     * Decodes a PhaseResult message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PhaseResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PhaseResult;

    /**
     * Verifies a PhaseResult message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PhaseResult message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PhaseResult
     */
    public static fromObject(object: { [k: string]: any }): PhaseResult;

    /**
     * Creates a plain object from a PhaseResult message. Also converts values to other types if specified.
     * @param message PhaseResult
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PhaseResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PhaseResult to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SendBackPlayerReq. */
export interface ISendBackPlayerReq {

    /** SendBackPlayerReq elfGameId */
    elfGameId?: (string|null);

    /** SendBackPlayerReq playUrl */
    playUrl?: (string|null);

    /** SendBackPlayerReq playerToken */
    playerToken?: (string|null);

    /** SendBackPlayerReq nextPhaseKey */
    nextPhaseKey?: (string|null);

    /** SendBackPlayerReq phaseResult */
    phaseResult?: (IPhaseResult|null);
}

/** Represents a SendBackPlayerReq. */
export class SendBackPlayerReq implements ISendBackPlayerReq {

    /**
     * Constructs a new SendBackPlayerReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISendBackPlayerReq);

    /** SendBackPlayerReq elfGameId. */
    public elfGameId: string;

    /** SendBackPlayerReq playUrl. */
    public playUrl: string;

    /** SendBackPlayerReq playerToken. */
    public playerToken: string;

    /** SendBackPlayerReq nextPhaseKey. */
    public nextPhaseKey: string;

    /** SendBackPlayerReq phaseResult. */
    public phaseResult?: (IPhaseResult|null);

    /**
     * Creates a new SendBackPlayerReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SendBackPlayerReq instance
     */
    public static create(properties?: ISendBackPlayerReq): SendBackPlayerReq;

    /**
     * Encodes the specified SendBackPlayerReq message. Does not implicitly {@link SendBackPlayerReq.verify|verify} messages.
     * @param message SendBackPlayerReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISendBackPlayerReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SendBackPlayerReq message, length delimited. Does not implicitly {@link SendBackPlayerReq.verify|verify} messages.
     * @param message SendBackPlayerReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISendBackPlayerReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SendBackPlayerReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SendBackPlayerReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SendBackPlayerReq;

    /**
     * Decodes a SendBackPlayerReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SendBackPlayerReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SendBackPlayerReq;

    /**
     * Verifies a SendBackPlayerReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SendBackPlayerReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SendBackPlayerReq
     */
    public static fromObject(object: { [k: string]: any }): SendBackPlayerReq;

    /**
     * Creates a plain object from a SendBackPlayerReq message. Also converts values to other types if specified.
     * @param message SendBackPlayerReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SendBackPlayerReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SendBackPlayerReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SetPhaseResultReq. */
export interface ISetPhaseResultReq {

    /** SetPhaseResultReq elfGameId */
    elfGameId?: (string|null);

    /** SetPhaseResultReq playUrl */
    playUrl?: (string|null);

    /** SetPhaseResultReq playerToken */
    playerToken?: (string|null);

    /** SetPhaseResultReq phaseResult */
    phaseResult?: (IPhaseResult|null);
}

/** Represents a SetPhaseResultReq. */
export class SetPhaseResultReq implements ISetPhaseResultReq {

    /**
     * Constructs a new SetPhaseResultReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISetPhaseResultReq);

    /** SetPhaseResultReq elfGameId. */
    public elfGameId: string;

    /** SetPhaseResultReq playUrl. */
    public playUrl: string;

    /** SetPhaseResultReq playerToken. */
    public playerToken: string;

    /** SetPhaseResultReq phaseResult. */
    public phaseResult?: (IPhaseResult|null);

    /**
     * Creates a new SetPhaseResultReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SetPhaseResultReq instance
     */
    public static create(properties?: ISetPhaseResultReq): SetPhaseResultReq;

    /**
     * Encodes the specified SetPhaseResultReq message. Does not implicitly {@link SetPhaseResultReq.verify|verify} messages.
     * @param message SetPhaseResultReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISetPhaseResultReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SetPhaseResultReq message, length delimited. Does not implicitly {@link SetPhaseResultReq.verify|verify} messages.
     * @param message SetPhaseResultReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISetPhaseResultReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SetPhaseResultReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SetPhaseResultReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SetPhaseResultReq;

    /**
     * Decodes a SetPhaseResultReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SetPhaseResultReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SetPhaseResultReq;

    /**
     * Verifies a SetPhaseResultReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SetPhaseResultReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SetPhaseResultReq
     */
    public static fromObject(object: { [k: string]: any }): SetPhaseResultReq;

    /**
     * Creates a plain object from a SetPhaseResultReq message. Also converts values to other types if specified.
     * @param message SetPhaseResultReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SetPhaseResultReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SetPhaseResultReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SetPhaseResultRes. */
export interface ISetPhaseResultRes {

    /** SetPhaseResultRes success */
    success?: (boolean|null);
}

/** Represents a SetPhaseResultRes. */
export class SetPhaseResultRes implements ISetPhaseResultRes {

    /**
     * Constructs a new SetPhaseResultRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISetPhaseResultRes);

    /** SetPhaseResultRes success. */
    public success: boolean;

    /**
     * Creates a new SetPhaseResultRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SetPhaseResultRes instance
     */
    public static create(properties?: ISetPhaseResultRes): SetPhaseResultRes;

    /**
     * Encodes the specified SetPhaseResultRes message. Does not implicitly {@link SetPhaseResultRes.verify|verify} messages.
     * @param message SetPhaseResultRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISetPhaseResultRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SetPhaseResultRes message, length delimited. Does not implicitly {@link SetPhaseResultRes.verify|verify} messages.
     * @param message SetPhaseResultRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISetPhaseResultRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SetPhaseResultRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SetPhaseResultRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SetPhaseResultRes;

    /**
     * Decodes a SetPhaseResultRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SetPhaseResultRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SetPhaseResultRes;

    /**
     * Verifies a SetPhaseResultRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SetPhaseResultRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SetPhaseResultRes
     */
    public static fromObject(object: { [k: string]: any }): SetPhaseResultRes;

    /**
     * Creates a plain object from a SetPhaseResultRes message. Also converts values to other types if specified.
     * @param message SetPhaseResultRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SetPhaseResultRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SetPhaseResultRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SendBackPlayerRes. */
export interface ISendBackPlayerRes {

    /** SendBackPlayerRes sendBackUrl */
    sendBackUrl?: (string|null);
}

/** Represents a SendBackPlayerRes. */
export class SendBackPlayerRes implements ISendBackPlayerRes {

    /**
     * Constructs a new SendBackPlayerRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISendBackPlayerRes);

    /** SendBackPlayerRes sendBackUrl. */
    public sendBackUrl: string;

    /**
     * Creates a new SendBackPlayerRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SendBackPlayerRes instance
     */
    public static create(properties?: ISendBackPlayerRes): SendBackPlayerRes;

    /**
     * Encodes the specified SendBackPlayerRes message. Does not implicitly {@link SendBackPlayerRes.verify|verify} messages.
     * @param message SendBackPlayerRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISendBackPlayerRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SendBackPlayerRes message, length delimited. Does not implicitly {@link SendBackPlayerRes.verify|verify} messages.
     * @param message SendBackPlayerRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISendBackPlayerRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SendBackPlayerRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SendBackPlayerRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SendBackPlayerRes;

    /**
     * Decodes a SendBackPlayerRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SendBackPlayerRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SendBackPlayerRes;

    /**
     * Verifies a SendBackPlayerRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SendBackPlayerRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SendBackPlayerRes
     */
    public static fromObject(object: { [k: string]: any }): SendBackPlayerRes;

    /**
     * Creates a plain object from a SendBackPlayerRes message. Also converts values to other types if specified.
     * @param message SendBackPlayerRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SendBackPlayerRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SendBackPlayerRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Represents a PhaseService */
export class PhaseService extends $protobuf.rpc.Service {

    /**
     * Constructs a new PhaseService service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new PhaseService service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): PhaseService;

    /**
     * Calls newPhase.
     * @param request NewPhaseReq message or plain object
     * @param callback Node-style callback called with the error, if any, and NewPhaseRes
     */
    public newPhase(request: INewPhaseReq, callback: PhaseService.newPhaseCallback): void;

    /**
     * Calls newPhase.
     * @param request NewPhaseReq message or plain object
     * @returns Promise
     */
    public newPhase(request: INewPhaseReq): Promise<NewPhaseRes>;
}

export namespace PhaseService {

    /**
     * Callback as used by {@link PhaseService#newPhase}.
     * @param error Error, if any
     * @param [response] NewPhaseRes
     */
    type newPhaseCallback = (error: (Error|null), response?: NewPhaseRes) => void;
}

/** Properties of a NewPhaseReq. */
export interface INewPhaseReq {

    /** NewPhaseReq elfGameId */
    elfGameId?: (string|null);

    /** NewPhaseReq namespace */
    namespace?: (string|null);

    /** NewPhaseReq param */
    param?: (string|null);

    /** NewPhaseReq owner */
    owner?: (string|null);
}

/** Represents a NewPhaseReq. */
export class NewPhaseReq implements INewPhaseReq {

    /**
     * Constructs a new NewPhaseReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: INewPhaseReq);

    /** NewPhaseReq elfGameId. */
    public elfGameId: string;

    /** NewPhaseReq namespace. */
    public namespace: string;

    /** NewPhaseReq param. */
    public param: string;

    /** NewPhaseReq owner. */
    public owner: string;

    /**
     * Creates a new NewPhaseReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns NewPhaseReq instance
     */
    public static create(properties?: INewPhaseReq): NewPhaseReq;

    /**
     * Encodes the specified NewPhaseReq message. Does not implicitly {@link NewPhaseReq.verify|verify} messages.
     * @param message NewPhaseReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: INewPhaseReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified NewPhaseReq message, length delimited. Does not implicitly {@link NewPhaseReq.verify|verify} messages.
     * @param message NewPhaseReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: INewPhaseReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a NewPhaseReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns NewPhaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): NewPhaseReq;

    /**
     * Decodes a NewPhaseReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns NewPhaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): NewPhaseReq;

    /**
     * Verifies a NewPhaseReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a NewPhaseReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns NewPhaseReq
     */
    public static fromObject(object: { [k: string]: any }): NewPhaseReq;

    /**
     * Creates a plain object from a NewPhaseReq message. Also converts values to other types if specified.
     * @param message NewPhaseReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: NewPhaseReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this NewPhaseReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a NewPhaseRes. */
export interface INewPhaseRes {

    /** NewPhaseRes playUrl */
    playUrl?: (string|null);
}

/** Represents a NewPhaseRes. */
export class NewPhaseRes implements INewPhaseRes {

    /**
     * Constructs a new NewPhaseRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: INewPhaseRes);

    /** NewPhaseRes playUrl. */
    public playUrl: string;

    /**
     * Creates a new NewPhaseRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns NewPhaseRes instance
     */
    public static create(properties?: INewPhaseRes): NewPhaseRes;

    /**
     * Encodes the specified NewPhaseRes message. Does not implicitly {@link NewPhaseRes.verify|verify} messages.
     * @param message NewPhaseRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: INewPhaseRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified NewPhaseRes message, length delimited. Does not implicitly {@link NewPhaseRes.verify|verify} messages.
     * @param message NewPhaseRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: INewPhaseRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a NewPhaseRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns NewPhaseRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): NewPhaseRes;

    /**
     * Decodes a NewPhaseRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns NewPhaseRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): NewPhaseRes;

    /**
     * Verifies a NewPhaseRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a NewPhaseRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns NewPhaseRes
     */
    public static fromObject(object: { [k: string]: any }): NewPhaseRes;

    /**
     * Creates a plain object from a NewPhaseRes message. Also converts values to other types if specified.
     * @param message NewPhaseRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: NewPhaseRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this NewPhaseRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
