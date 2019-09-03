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
        game: Phase,
        data: { playerUrl?: string; status?: UserGameStatus }
    ) => {
        const key = RedisTools._getUserGameKey(uid, game);
        const oldData = await redisClient.get(key);
        const oldDataObj = oldData ? JSON.parse(oldData) : {};
        const mergeData = Object.assign(oldDataObj, data);
        await redisClient.set(key, JSON.stringify(mergeData));
    },
    getUserGameData: async (uid: string, game: Phase): Promise<UserGameData> => {
        const key = RedisTools._getUserGameKey(uid, game);
        const oldData = await redisClient.get(key);
        return oldData ? JSON.parse(oldData) : null;
    },
    recordPlayerUrl: async (playerUrl: string, uid: string) => {
        await redisClient.set(RedisTools._getRecordPlayerUrlKey(playerUrl), uid);
    }
};