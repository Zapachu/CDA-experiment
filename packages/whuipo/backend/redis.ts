import Redis from 'ioredis';
import {elfSetting} from '@elf/setting';
import {Phase, UserGameStatus} from '@micro-experiment/share';

export const redisClient = new Redis({
    port: elfSetting.redisPort,
    host: elfSetting.redisHost
});

interface UserGameData {
    playerUrl?: string;
    status: UserGameStatus;
}

export const RedisTools = {
    _getUserGameKey: (uid: string, game: Phase) => `usergamedata:${uid}/${game}`,
    _getRecordPlayerUrlKey: (playerUrl: string) => `playerUrlToUid:${playerUrl}`,
    setUserGameData: async (
        uid: string,
        phase: Phase,
        data: { playerUrl?: string; status?: UserGameStatus }
    ) => {
        const key = RedisTools._getUserGameKey(uid, phase);
        const oldData = await redisClient.get(key);
        const oldDataObj = oldData ? JSON.parse(oldData) : {};
        const mergeData = Object.assign(oldDataObj, data);
        await redisClient.set(key, JSON.stringify(mergeData));
    },
    getUserGameData: async (uid: string, phase: Phase): Promise<UserGameData> => {
        const key = RedisTools._getUserGameKey(uid, phase);
        const oldData = await redisClient.get(key);
        return oldData ? JSON.parse(oldData) : null;
    },
    recordPlayerUrl: async (playerUrl: string, uid: string) => {
        await redisClient.set(RedisTools._getRecordPlayerUrlKey(playerUrl), uid);
    },
    phaseServerUsageKey: (phase: Phase) => `PhaseServerUsage:${phase}`,
    incrByPhaseServerUsage: async (phase: Phase, increment: number) => await redisClient.incrby(RedisTools.phaseServerUsageKey(phase), increment),
};