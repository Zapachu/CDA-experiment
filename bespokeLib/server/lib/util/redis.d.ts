import { NationCode } from '@bespoke/share';
export declare const RedisKey: {
    verifyCodeSendTimes: (nationCode: NationCode, phoneNumber: string) => string;
    verifyCode: (nationCode: NationCode, phoneNumber: string) => string;
    share_GameCode: (gameId: string) => string;
    share_CodeGame: (code: string) => string;
    gameState: (gameId: string) => string;
    playerState: (gameId: string, token: string) => string;
    playerStates: (gameId: string) => string;
    gameServer: (namespace: string) => string;
};
