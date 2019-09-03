export declare namespace Linker {
    namespace HeartBeat {
        const intervalSeconds = 10;
        const key: (namespace: any) => string;
        interface IHeartBeat {
            namespace: string;
            jsUrl: string;
        }
    }
    namespace Create {
        const name: (namespace: any) => string;
        interface IReq {
            elfGameId: string;
            owner: string;
            params: any;
        }
        interface IRes {
            playUrl: string;
        }
    }
    namespace Result {
        const name = "Linker:Result";
        interface IResult {
            uniKey?: string;
            point?: number;
            detailIframeUrl?: string;
        }
        interface IReq {
            elfGameId: string;
            playerToken: string;
            result?: IResult;
        }
        type IRes = null;
    }
}
export declare namespace Trial {
    namespace Create {
        const name: (namespace: string) => string;
        type IReq<ICreateParams = {}> = ICreateParams;
        interface IRes {
            playUrl: string;
        }
    }
    namespace Done {
        const name = "Trial:Done";
        interface IReq {
            namespace: string;
            userId: string;
            onceMore?: boolean;
        }
        interface IRes {
            lobbyUrl: string;
        }
    }
}
