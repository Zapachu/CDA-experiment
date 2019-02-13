import * as $protobuf from "protobufjs";
/** Represents an AcademusBespoke */
export class AcademusBespoke extends $protobuf.rpc.Service {

    /**
     * Constructs a new AcademusBespoke service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new AcademusBespoke service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): AcademusBespoke;

    /**
     * Calls checkAuthority.
     * @param request CheckAuthorityReq message or plain object
     * @param callback Node-style callback called with the error, if any, and CheckAuthorityRes
     */
    public checkAuthority(request: ICheckAuthorityReq, callback: AcademusBespoke.checkAuthorityCallback): void;

    /**
     * Calls checkAuthority.
     * @param request CheckAuthorityReq message or plain object
     * @returns Promise
     */
    public checkAuthority(request: ICheckAuthorityReq): Promise<CheckAuthorityRes>;

    /**
     * Calls checkShareCode.
     * @param request CheckShareCodeReq message or plain object
     * @param callback Node-style callback called with the error, if any, and CheckShareCodeRes
     */
    public checkShareCode(request: ICheckShareCodeReq, callback: AcademusBespoke.checkShareCodeCallback): void;

    /**
     * Calls checkShareCode.
     * @param request CheckShareCodeReq message or plain object
     * @returns Promise
     */
    public checkShareCode(request: ICheckShareCodeReq): Promise<CheckShareCodeRes>;
}

export namespace AcademusBespoke {

    /**
     * Callback as used by {@link AcademusBespoke#checkAuthority}.
     * @param error Error, if any
     * @param [response] CheckAuthorityRes
     */
    type checkAuthorityCallback = (error: (Error|null), response?: CheckAuthorityRes) => void;

    /**
     * Callback as used by {@link AcademusBespoke#checkShareCode}.
     * @param error Error, if any
     * @param [response] CheckShareCodeRes
     */
    type checkShareCodeCallback = (error: (Error|null), response?: CheckShareCodeRes) => void;
}

/** Properties of a CheckAuthorityReq. */
export interface ICheckAuthorityReq {

    /** CheckAuthorityReq userId */
    userId?: (string|null);

    /** CheckAuthorityReq namespace */
    namespace?: (string|null);
}

/** Represents a CheckAuthorityReq. */
export class CheckAuthorityReq implements ICheckAuthorityReq {

    /**
     * Constructs a new CheckAuthorityReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICheckAuthorityReq);

    /** CheckAuthorityReq userId. */
    public userId: string;

    /** CheckAuthorityReq namespace. */
    public namespace: string;

    /**
     * Creates a new CheckAuthorityReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CheckAuthorityReq instance
     */
    public static create(properties?: ICheckAuthorityReq): CheckAuthorityReq;

    /**
     * Encodes the specified CheckAuthorityReq message. Does not implicitly {@link CheckAuthorityReq.verify|verify} messages.
     * @param message CheckAuthorityReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICheckAuthorityReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CheckAuthorityReq message, length delimited. Does not implicitly {@link CheckAuthorityReq.verify|verify} messages.
     * @param message CheckAuthorityReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICheckAuthorityReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CheckAuthorityReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CheckAuthorityReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CheckAuthorityReq;

    /**
     * Decodes a CheckAuthorityReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CheckAuthorityReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CheckAuthorityReq;

    /**
     * Verifies a CheckAuthorityReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CheckAuthorityReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CheckAuthorityReq
     */
    public static fromObject(object: { [k: string]: any }): CheckAuthorityReq;

    /**
     * Creates a plain object from a CheckAuthorityReq message. Also converts values to other types if specified.
     * @param message CheckAuthorityReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CheckAuthorityReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CheckAuthorityReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CheckAuthorityRes. */
export interface ICheckAuthorityRes {

    /** CheckAuthorityRes result */
    result?: (boolean|null);
}

/** Represents a CheckAuthorityRes. */
export class CheckAuthorityRes implements ICheckAuthorityRes {

    /**
     * Constructs a new CheckAuthorityRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICheckAuthorityRes);

    /** CheckAuthorityRes result. */
    public result: boolean;

    /**
     * Creates a new CheckAuthorityRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CheckAuthorityRes instance
     */
    public static create(properties?: ICheckAuthorityRes): CheckAuthorityRes;

    /**
     * Encodes the specified CheckAuthorityRes message. Does not implicitly {@link CheckAuthorityRes.verify|verify} messages.
     * @param message CheckAuthorityRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICheckAuthorityRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CheckAuthorityRes message, length delimited. Does not implicitly {@link CheckAuthorityRes.verify|verify} messages.
     * @param message CheckAuthorityRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICheckAuthorityRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CheckAuthorityRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CheckAuthorityRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CheckAuthorityRes;

    /**
     * Decodes a CheckAuthorityRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CheckAuthorityRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CheckAuthorityRes;

    /**
     * Verifies a CheckAuthorityRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CheckAuthorityRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CheckAuthorityRes
     */
    public static fromObject(object: { [k: string]: any }): CheckAuthorityRes;

    /**
     * Creates a plain object from a CheckAuthorityRes message. Also converts values to other types if specified.
     * @param message CheckAuthorityRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CheckAuthorityRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CheckAuthorityRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CheckShareCodeReq. */
export interface ICheckShareCodeReq {

    /** CheckShareCodeReq code */
    code?: (string|null);
}

/** Represents a CheckShareCodeReq. */
export class CheckShareCodeReq implements ICheckShareCodeReq {

    /**
     * Constructs a new CheckShareCodeReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICheckShareCodeReq);

    /** CheckShareCodeReq code. */
    public code: string;

    /**
     * Creates a new CheckShareCodeReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CheckShareCodeReq instance
     */
    public static create(properties?: ICheckShareCodeReq): CheckShareCodeReq;

    /**
     * Encodes the specified CheckShareCodeReq message. Does not implicitly {@link CheckShareCodeReq.verify|verify} messages.
     * @param message CheckShareCodeReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICheckShareCodeReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CheckShareCodeReq message, length delimited. Does not implicitly {@link CheckShareCodeReq.verify|verify} messages.
     * @param message CheckShareCodeReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICheckShareCodeReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CheckShareCodeReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CheckShareCodeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CheckShareCodeReq;

    /**
     * Decodes a CheckShareCodeReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CheckShareCodeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CheckShareCodeReq;

    /**
     * Verifies a CheckShareCodeReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CheckShareCodeReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CheckShareCodeReq
     */
    public static fromObject(object: { [k: string]: any }): CheckShareCodeReq;

    /**
     * Creates a plain object from a CheckShareCodeReq message. Also converts values to other types if specified.
     * @param message CheckShareCodeReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CheckShareCodeReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CheckShareCodeReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CheckShareCodeRes. */
export interface ICheckShareCodeRes {

    /** CheckShareCodeRes gameId */
    gameId?: (string|null);
}

/** Represents a CheckShareCodeRes. */
export class CheckShareCodeRes implements ICheckShareCodeRes {

    /**
     * Constructs a new CheckShareCodeRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICheckShareCodeRes);

    /** CheckShareCodeRes gameId. */
    public gameId: string;

    /**
     * Creates a new CheckShareCodeRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CheckShareCodeRes instance
     */
    public static create(properties?: ICheckShareCodeRes): CheckShareCodeRes;

    /**
     * Encodes the specified CheckShareCodeRes message. Does not implicitly {@link CheckShareCodeRes.verify|verify} messages.
     * @param message CheckShareCodeRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICheckShareCodeRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CheckShareCodeRes message, length delimited. Does not implicitly {@link CheckShareCodeRes.verify|verify} messages.
     * @param message CheckShareCodeRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICheckShareCodeRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CheckShareCodeRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CheckShareCodeRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CheckShareCodeRes;

    /**
     * Decodes a CheckShareCodeRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CheckShareCodeRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CheckShareCodeRes;

    /**
     * Verifies a CheckShareCodeRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CheckShareCodeRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CheckShareCodeRes
     */
    public static fromObject(object: { [k: string]: any }): CheckShareCodeRes;

    /**
     * Creates a plain object from a CheckShareCodeRes message. Also converts values to other types if specified.
     * @param message CheckShareCodeRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CheckShareCodeRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CheckShareCodeRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
