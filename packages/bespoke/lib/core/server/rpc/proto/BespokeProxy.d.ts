import * as $protobuf from "protobufjs";
/** Namespace proto. */
export namespace proto {

    /** Represents a ProxyService */
    class ProxyService extends $protobuf.rpc.Service {

        /**
         * Constructs a new ProxyService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new ProxyService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): ProxyService;

        /**
         * Calls registerGame.
         * @param request registerGameReq message or plain object
         * @param callback Node-style callback called with the error, if any, and registerGameRes
         */
        public registerGame(request: proto.IregisterGameReq, callback: proto.ProxyService.registerGameCallback): void;

        /**
         * Calls registerGame.
         * @param request registerGameReq message or plain object
         * @returns Promise
         */
        public registerGame(request: proto.IregisterGameReq): Promise<proto.registerGameRes>;
    }

    namespace ProxyService {

        /**
         * Callback as used by {@link proto.ProxyService#registerGame}.
         * @param error Error, if any
         * @param [response] registerGameRes
         */
        type registerGameCallback = (error: (Error|null), response?: proto.registerGameRes) => void;
    }

    /** Properties of a registerGameReq. */
    interface IregisterGameReq {

        /** registerGameReq namespace */
        namespace?: (string|null);

        /** registerGameReq host */
        host?: (string|null);

        /** registerGameReq port */
        port?: (string|null);
    }

    /** Represents a registerGameReq. */
    class registerGameReq implements IregisterGameReq {

        /**
         * Constructs a new registerGameReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IregisterGameReq);

        /** registerGameReq namespace. */
        public namespace: string;

        /** registerGameReq host. */
        public host: string;

        /** registerGameReq port. */
        public port: string;

        /**
         * Creates a new registerGameReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns registerGameReq instance
         */
        public static create(properties?: proto.IregisterGameReq): proto.registerGameReq;

        /**
         * Encodes the specified registerGameReq message. Does not implicitly {@link proto.registerGameReq.verify|verify} messages.
         * @param message registerGameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IregisterGameReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified registerGameReq message, length delimited. Does not implicitly {@link proto.registerGameReq.verify|verify} messages.
         * @param message registerGameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IregisterGameReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a registerGameReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns registerGameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.registerGameReq;

        /**
         * Decodes a registerGameReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns registerGameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.registerGameReq;

        /**
         * Verifies a registerGameReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a registerGameReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns registerGameReq
         */
        public static fromObject(object: { [k: string]: any }): proto.registerGameReq;

        /**
         * Creates a plain object from a registerGameReq message. Also converts values to other types if specified.
         * @param message registerGameReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.registerGameReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this registerGameReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a registerGameRes. */
    interface IregisterGameRes {

        /** registerGameRes result */
        result?: (boolean|null);
    }

    /** Represents a registerGameRes. */
    class registerGameRes implements IregisterGameRes {

        /**
         * Constructs a new registerGameRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IregisterGameRes);

        /** registerGameRes result. */
        public result: boolean;

        /**
         * Creates a new registerGameRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns registerGameRes instance
         */
        public static create(properties?: proto.IregisterGameRes): proto.registerGameRes;

        /**
         * Encodes the specified registerGameRes message. Does not implicitly {@link proto.registerGameRes.verify|verify} messages.
         * @param message registerGameRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IregisterGameRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified registerGameRes message, length delimited. Does not implicitly {@link proto.registerGameRes.verify|verify} messages.
         * @param message registerGameRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IregisterGameRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a registerGameRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns registerGameRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.registerGameRes;

        /**
         * Decodes a registerGameRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns registerGameRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.registerGameRes;

        /**
         * Verifies a registerGameRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a registerGameRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns registerGameRes
         */
        public static fromObject(object: { [k: string]: any }): proto.registerGameRes;

        /**
         * Creates a plain object from a registerGameRes message. Also converts values to other types if specified.
         * @param message registerGameRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.registerGameRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this registerGameRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
