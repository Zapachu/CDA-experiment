import * as $protobuf from "protobufjs";
/** Represents an AdminService */
export class AdminService extends $protobuf.rpc.Service {

    /**
     * Constructs a new AdminService service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new AdminService service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): AdminService;

    /**
     * Calls GetAuthorizedTemplates.
     * @param request GetAuthorizedTemplatesReq message or plain object
     * @param callback Node-style callback called with the error, if any, and GetAuthorizedTemplatesRes
     */
    public getAuthorizedTemplates(request: IGetAuthorizedTemplatesReq, callback: AdminService.GetAuthorizedTemplatesCallback): void;

    /**
     * Calls GetAuthorizedTemplates.
     * @param request GetAuthorizedTemplatesReq message or plain object
     * @returns Promise
     */
    public getAuthorizedTemplates(request: IGetAuthorizedTemplatesReq): Promise<GetAuthorizedTemplatesRes>;
}

export namespace AdminService {

    /**
     * Callback as used by {@link AdminService#getAuthorizedTemplates}.
     * @param error Error, if any
     * @param [response] GetAuthorizedTemplatesRes
     */
    type GetAuthorizedTemplatesCallback = (error: (Error|null), response?: GetAuthorizedTemplatesRes) => void;
}

/** Properties of a GetAuthorizedTemplatesReq. */
export interface IGetAuthorizedTemplatesReq {

    /** GetAuthorizedTemplatesReq userId */
    userId?: (string|null);
}

/** Represents a GetAuthorizedTemplatesReq. */
export class GetAuthorizedTemplatesReq implements IGetAuthorizedTemplatesReq {

    /**
     * Constructs a new GetAuthorizedTemplatesReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGetAuthorizedTemplatesReq);

    /** GetAuthorizedTemplatesReq userId. */
    public userId: string;

    /**
     * Creates a new GetAuthorizedTemplatesReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetAuthorizedTemplatesReq instance
     */
    public static create(properties?: IGetAuthorizedTemplatesReq): GetAuthorizedTemplatesReq;

    /**
     * Encodes the specified GetAuthorizedTemplatesReq message. Does not implicitly {@link GetAuthorizedTemplatesReq.verify|verify} messages.
     * @param message GetAuthorizedTemplatesReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGetAuthorizedTemplatesReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetAuthorizedTemplatesReq message, length delimited. Does not implicitly {@link GetAuthorizedTemplatesReq.verify|verify} messages.
     * @param message GetAuthorizedTemplatesReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGetAuthorizedTemplatesReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetAuthorizedTemplatesReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetAuthorizedTemplatesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetAuthorizedTemplatesReq;

    /**
     * Decodes a GetAuthorizedTemplatesReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetAuthorizedTemplatesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetAuthorizedTemplatesReq;

    /**
     * Verifies a GetAuthorizedTemplatesReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GetAuthorizedTemplatesReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetAuthorizedTemplatesReq
     */
    public static fromObject(object: { [k: string]: any }): GetAuthorizedTemplatesReq;

    /**
     * Creates a plain object from a GetAuthorizedTemplatesReq message. Also converts values to other types if specified.
     * @param message GetAuthorizedTemplatesReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GetAuthorizedTemplatesReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GetAuthorizedTemplatesReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a GetAuthorizedTemplatesRes. */
export interface IGetAuthorizedTemplatesRes {

    /** GetAuthorizedTemplatesRes namespaces */
    namespaces?: (string[]|null);
}

/** Represents a GetAuthorizedTemplatesRes. */
export class GetAuthorizedTemplatesRes implements IGetAuthorizedTemplatesRes {

    /**
     * Constructs a new GetAuthorizedTemplatesRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGetAuthorizedTemplatesRes);

    /** GetAuthorizedTemplatesRes namespaces. */
    public namespaces: string[];

    /**
     * Creates a new GetAuthorizedTemplatesRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetAuthorizedTemplatesRes instance
     */
    public static create(properties?: IGetAuthorizedTemplatesRes): GetAuthorizedTemplatesRes;

    /**
     * Encodes the specified GetAuthorizedTemplatesRes message. Does not implicitly {@link GetAuthorizedTemplatesRes.verify|verify} messages.
     * @param message GetAuthorizedTemplatesRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGetAuthorizedTemplatesRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetAuthorizedTemplatesRes message, length delimited. Does not implicitly {@link GetAuthorizedTemplatesRes.verify|verify} messages.
     * @param message GetAuthorizedTemplatesRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGetAuthorizedTemplatesRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetAuthorizedTemplatesRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetAuthorizedTemplatesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetAuthorizedTemplatesRes;

    /**
     * Decodes a GetAuthorizedTemplatesRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetAuthorizedTemplatesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetAuthorizedTemplatesRes;

    /**
     * Verifies a GetAuthorizedTemplatesRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GetAuthorizedTemplatesRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetAuthorizedTemplatesRes
     */
    public static fromObject(object: { [k: string]: any }): GetAuthorizedTemplatesRes;

    /**
     * Creates a plain object from a GetAuthorizedTemplatesRes message. Also converts values to other types if specified.
     * @param message GetAuthorizedTemplatesRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GetAuthorizedTemplatesRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GetAuthorizedTemplatesRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Represents an ElfService */
export class ElfService extends $protobuf.rpc.Service {

    /**
     * Constructs a new ElfService service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new ElfService service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): ElfService;

    /**
     * Calls GetOnlineTemplates.
     * @param request GetOnlineTemplatesReq message or plain object
     * @param callback Node-style callback called with the error, if any, and GetOnlineTemplatesRes
     */
    public getOnlineTemplates(request: IGetOnlineTemplatesReq, callback: ElfService.GetOnlineTemplatesCallback): void;

    /**
     * Calls GetOnlineTemplates.
     * @param request GetOnlineTemplatesReq message or plain object
     * @returns Promise
     */
    public getOnlineTemplates(request: IGetOnlineTemplatesReq): Promise<GetOnlineTemplatesRes>;
}

export namespace ElfService {

    /**
     * Callback as used by {@link ElfService#getOnlineTemplates}.
     * @param error Error, if any
     * @param [response] GetOnlineTemplatesRes
     */
    type GetOnlineTemplatesCallback = (error: (Error|null), response?: GetOnlineTemplatesRes) => void;
}

/** Properties of a GetOnlineTemplatesReq. */
export interface IGetOnlineTemplatesReq {
}

/** Represents a GetOnlineTemplatesReq. */
export class GetOnlineTemplatesReq implements IGetOnlineTemplatesReq {

    /**
     * Constructs a new GetOnlineTemplatesReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGetOnlineTemplatesReq);

    /**
     * Creates a new GetOnlineTemplatesReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetOnlineTemplatesReq instance
     */
    public static create(properties?: IGetOnlineTemplatesReq): GetOnlineTemplatesReq;

    /**
     * Encodes the specified GetOnlineTemplatesReq message. Does not implicitly {@link GetOnlineTemplatesReq.verify|verify} messages.
     * @param message GetOnlineTemplatesReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGetOnlineTemplatesReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetOnlineTemplatesReq message, length delimited. Does not implicitly {@link GetOnlineTemplatesReq.verify|verify} messages.
     * @param message GetOnlineTemplatesReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGetOnlineTemplatesReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetOnlineTemplatesReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetOnlineTemplatesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetOnlineTemplatesReq;

    /**
     * Decodes a GetOnlineTemplatesReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetOnlineTemplatesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetOnlineTemplatesReq;

    /**
     * Verifies a GetOnlineTemplatesReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GetOnlineTemplatesReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetOnlineTemplatesReq
     */
    public static fromObject(object: { [k: string]: any }): GetOnlineTemplatesReq;

    /**
     * Creates a plain object from a GetOnlineTemplatesReq message. Also converts values to other types if specified.
     * @param message GetOnlineTemplatesReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GetOnlineTemplatesReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GetOnlineTemplatesReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a GetOnlineTemplatesRes. */
export interface IGetOnlineTemplatesRes {

    /** GetOnlineTemplatesRes namespaces */
    namespaces?: (string[]|null);
}

/** Represents a GetOnlineTemplatesRes. */
export class GetOnlineTemplatesRes implements IGetOnlineTemplatesRes {

    /**
     * Constructs a new GetOnlineTemplatesRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGetOnlineTemplatesRes);

    /** GetOnlineTemplatesRes namespaces. */
    public namespaces: string[];

    /**
     * Creates a new GetOnlineTemplatesRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetOnlineTemplatesRes instance
     */
    public static create(properties?: IGetOnlineTemplatesRes): GetOnlineTemplatesRes;

    /**
     * Encodes the specified GetOnlineTemplatesRes message. Does not implicitly {@link GetOnlineTemplatesRes.verify|verify} messages.
     * @param message GetOnlineTemplatesRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGetOnlineTemplatesRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetOnlineTemplatesRes message, length delimited. Does not implicitly {@link GetOnlineTemplatesRes.verify|verify} messages.
     * @param message GetOnlineTemplatesRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGetOnlineTemplatesRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetOnlineTemplatesRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetOnlineTemplatesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetOnlineTemplatesRes;

    /**
     * Decodes a GetOnlineTemplatesRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetOnlineTemplatesRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetOnlineTemplatesRes;

    /**
     * Verifies a GetOnlineTemplatesRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GetOnlineTemplatesRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetOnlineTemplatesRes
     */
    public static fromObject(object: { [k: string]: any }): GetOnlineTemplatesRes;

    /**
     * Creates a plain object from a GetOnlineTemplatesRes message. Also converts values to other types if specified.
     * @param message GetOnlineTemplatesRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GetOnlineTemplatesRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GetOnlineTemplatesRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
