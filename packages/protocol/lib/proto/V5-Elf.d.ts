import * as $protobuf from "protobufjs";
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
     * Calls getActivePhases.
     * @param request GetActivePhaseReq message or plain object
     * @param callback Node-style callback called with the error, if any, and GetActivePhaseRes
     */
    public getActivePhases(request: IGetActivePhaseReq, callback: ElfService.getActivePhasesCallback): void;

    /**
     * Calls getActivePhases.
     * @param request GetActivePhaseReq message or plain object
     * @returns Promise
     */
    public getActivePhases(request: IGetActivePhaseReq): Promise<GetActivePhaseRes>;
}

export namespace ElfService {

    /**
     * Callback as used by {@link ElfService#getActivePhases}.
     * @param error Error, if any
     * @param [response] GetActivePhaseRes
     */
    type getActivePhasesCallback = (error: (Error|null), response?: GetActivePhaseRes) => void;
}

/** Properties of a GetActivePhaseReq. */
export interface IGetActivePhaseReq {
}

/** Represents a GetActivePhaseReq. */
export class GetActivePhaseReq implements IGetActivePhaseReq {

    /**
     * Constructs a new GetActivePhaseReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGetActivePhaseReq);

    /**
     * Creates a new GetActivePhaseReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetActivePhaseReq instance
     */
    public static create(properties?: IGetActivePhaseReq): GetActivePhaseReq;

    /**
     * Encodes the specified GetActivePhaseReq message. Does not implicitly {@link GetActivePhaseReq.verify|verify} messages.
     * @param message GetActivePhaseReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGetActivePhaseReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetActivePhaseReq message, length delimited. Does not implicitly {@link GetActivePhaseReq.verify|verify} messages.
     * @param message GetActivePhaseReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGetActivePhaseReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetActivePhaseReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetActivePhaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetActivePhaseReq;

    /**
     * Decodes a GetActivePhaseReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetActivePhaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetActivePhaseReq;

    /**
     * Verifies a GetActivePhaseReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GetActivePhaseReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetActivePhaseReq
     */
    public static fromObject(object: { [k: string]: any }): GetActivePhaseReq;

    /**
     * Creates a plain object from a GetActivePhaseReq message. Also converts values to other types if specified.
     * @param message GetActivePhaseReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GetActivePhaseReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GetActivePhaseReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a GetActivePhaseRes. */
export interface IGetActivePhaseRes {

    /** GetActivePhaseRes phases */
    phases?: (GetActivePhaseRes.IPhase[]|null);
}

/** Represents a GetActivePhaseRes. */
export class GetActivePhaseRes implements IGetActivePhaseRes {

    /**
     * Constructs a new GetActivePhaseRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGetActivePhaseRes);

    /** GetActivePhaseRes phases. */
    public phases: GetActivePhaseRes.IPhase[];

    /**
     * Creates a new GetActivePhaseRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetActivePhaseRes instance
     */
    public static create(properties?: IGetActivePhaseRes): GetActivePhaseRes;

    /**
     * Encodes the specified GetActivePhaseRes message. Does not implicitly {@link GetActivePhaseRes.verify|verify} messages.
     * @param message GetActivePhaseRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGetActivePhaseRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetActivePhaseRes message, length delimited. Does not implicitly {@link GetActivePhaseRes.verify|verify} messages.
     * @param message GetActivePhaseRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGetActivePhaseRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetActivePhaseRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetActivePhaseRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetActivePhaseRes;

    /**
     * Decodes a GetActivePhaseRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetActivePhaseRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetActivePhaseRes;

    /**
     * Verifies a GetActivePhaseRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GetActivePhaseRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetActivePhaseRes
     */
    public static fromObject(object: { [k: string]: any }): GetActivePhaseRes;

    /**
     * Creates a plain object from a GetActivePhaseRes message. Also converts values to other types if specified.
     * @param message GetActivePhaseRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GetActivePhaseRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GetActivePhaseRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace GetActivePhaseRes {

    /** Properties of a Phase. */
    interface IPhase {

        /** Phase namespace */
        namespace?: (string|null);

        /** Phase type */
        type?: (string|null);
    }

    /** Represents a Phase. */
    class Phase implements IPhase {

        /**
         * Constructs a new Phase.
         * @param [properties] Properties to set
         */
        constructor(properties?: GetActivePhaseRes.IPhase);

        /** Phase namespace. */
        public namespace: string;

        /** Phase type. */
        public type: string;

        /**
         * Creates a new Phase instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Phase instance
         */
        public static create(properties?: GetActivePhaseRes.IPhase): GetActivePhaseRes.Phase;

        /**
         * Encodes the specified Phase message. Does not implicitly {@link GetActivePhaseRes.Phase.verify|verify} messages.
         * @param message Phase message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: GetActivePhaseRes.IPhase, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Phase message, length delimited. Does not implicitly {@link GetActivePhaseRes.Phase.verify|verify} messages.
         * @param message Phase message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: GetActivePhaseRes.IPhase, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Phase message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Phase
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetActivePhaseRes.Phase;

        /**
         * Decodes a Phase message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Phase
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetActivePhaseRes.Phase;

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
        public static fromObject(object: { [k: string]: any }): GetActivePhaseRes.Phase;

        /**
         * Creates a plain object from a Phase message. Also converts values to other types if specified.
         * @param message Phase
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: GetActivePhaseRes.Phase, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Phase to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Represents a V5Service */
export class V5Service extends $protobuf.rpc.Service {

    /**
     * Constructs a new V5Service service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new V5Service service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): V5Service;

    /**
     * Calls reward.
     * @param request RewardReq message or plain object
     * @param callback Node-style callback called with the error, if any, and RewardRes
     */
    public reward(request: IRewardReq, callback: V5Service.rewardCallback): void;

    /**
     * Calls reward.
     * @param request RewardReq message or plain object
     * @returns Promise
     */
    public reward(request: IRewardReq): Promise<RewardRes>;
}

export namespace V5Service {

    /**
     * Callback as used by {@link V5Service#reward}.
     * @param error Error, if any
     * @param [response] RewardRes
     */
    type rewardCallback = (error: (Error|null), response?: RewardRes) => void;
}

/** Properties of a RewardReq. */
export interface IRewardReq {
}

/** Represents a RewardReq. */
export class RewardReq implements IRewardReq {

    /**
     * Constructs a new RewardReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRewardReq);

    /**
     * Creates a new RewardReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RewardReq instance
     */
    public static create(properties?: IRewardReq): RewardReq;

    /**
     * Encodes the specified RewardReq message. Does not implicitly {@link RewardReq.verify|verify} messages.
     * @param message RewardReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRewardReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RewardReq message, length delimited. Does not implicitly {@link RewardReq.verify|verify} messages.
     * @param message RewardReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRewardReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RewardReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RewardReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RewardReq;

    /**
     * Decodes a RewardReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RewardReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RewardReq;

    /**
     * Verifies a RewardReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RewardReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RewardReq
     */
    public static fromObject(object: { [k: string]: any }): RewardReq;

    /**
     * Creates a plain object from a RewardReq message. Also converts values to other types if specified.
     * @param message RewardReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RewardReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RewardReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a RewardRes. */
export interface IRewardRes {
}

/** Represents a RewardRes. */
export class RewardRes implements IRewardRes {

    /**
     * Constructs a new RewardRes.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRewardRes);

    /**
     * Creates a new RewardRes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RewardRes instance
     */
    public static create(properties?: IRewardRes): RewardRes;

    /**
     * Encodes the specified RewardRes message. Does not implicitly {@link RewardRes.verify|verify} messages.
     * @param message RewardRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRewardRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RewardRes message, length delimited. Does not implicitly {@link RewardRes.verify|verify} messages.
     * @param message RewardRes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRewardRes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RewardRes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RewardRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RewardRes;

    /**
     * Decodes a RewardRes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RewardRes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RewardRes;

    /**
     * Verifies a RewardRes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RewardRes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RewardRes
     */
    public static fromObject(object: { [k: string]: any }): RewardRes;

    /**
     * Creates a plain object from a RewardRes message. Also converts values to other types if specified.
     * @param message RewardRes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RewardRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RewardRes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
