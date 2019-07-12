export declare namespace PhaseReg {
    const intervalSeconds = 10;
    const key: (namespace: any) => string;
    interface IRegInfo {
        namespace: string;
        jsUrl: string;
    }
}
export declare namespace NewPhase {
    const name: (namespace: any) => string;
    interface IReq {
        elfGameId: string;
        namespace: string;
        param: string;
        owner: string;
    }
    interface IRes {
        playUrl: string;
    }
}
export declare namespace SetPlayerResult {
    const name = "Elf:SetPlayerResult";
    interface IResult {
        uniKey?: string;
        point?: number;
        detailIframeUrl?: string;
    }
    interface IReq {
        elfGameId: string;
        playUrl: string;
        playerToken: string;
        result?: IResult;
    }
    type IRes = null;
}
export declare namespace CreateGame {
    const name: (namespace: string) => string;
    const playerLimit = 12;
    interface IReq {
        keys: string[];
    }
    interface IRes {
        playUrls: string[];
    }
}
export declare namespace GameOver {
    const name = "Trial:GameOver";
    interface IReq {
        playUrl: string;
        onceMore: boolean;
        namespace: string;
    }
    interface IRes {
        lobbyUrl: string;
    }
}
