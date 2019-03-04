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

        /** phaseRegInfo rpcUri */
        rpcUri?: (string|null);
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

        /** phaseRegInfo rpcUri. */
        public rpcUri: string;

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

    /** RegisterPhasesRes success */
    success?: (boolean|null);

    /** RegisterPhasesRes waitURL */
    waitURL?: (string|null);
}

/** Represents a RegisterPhasesRes. */
export class RegisterPhasesRes implements IRegisterPhasesRes {

    /**
     * Constructs a new RegisterPhasesRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRegisterPhasesRes);

    /** RegisterPhasesRes success. */
    public success: boolean;

    /** RegisterPhasesRes waitURL. */
    public waitURL: string;

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

/** Properties of a SendBackPlayerReq. */
export interface ISendBackPlayerReq {

    /** SendBackPlayerReq groupId */
    groupId?: (string|null);

    /** SendBackPlayerReq playUrl */
    playUrl?: (string|null);

    /** SendBackPlayerReq playerToken */
    playerToken?: (string|null);

    /** SendBackPlayerReq nextPhaseKey */
    nextPhaseKey?: (string|null);

    /** SendBackPlayerReq point */
    point?: (number|null);
}

/** Represents a SendBackPlayerReq. */
export class SendBackPlayerReq implements ISendBackPlayerReq {

    /**
     * Constructs a new SendBackPlayerReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISendBackPlayerReq);

    /** SendBackPlayerReq groupId. */
    public groupId: string;

    /** SendBackPlayerReq playUrl. */
    public playUrl: string;

    /** SendBackPlayerReq playerToken. */
    public playerToken: string;

    /** SendBackPlayerReq nextPhaseKey. */
    public nextPhaseKey: string;

    /** SendBackPlayerReq point. */
    public point: number;

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

    /** NewPhaseReq groupId */
    groupId?: (string|null);

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

    /** NewPhaseReq groupId. */
    public groupId: string;

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
