import XJWT, {Type as XJWTType} from './XJWT';
import {Phase, UserGameStatus} from '@micro-experiment/share';
import {User} from './models';
import setting from './setting';
import {RedisTools} from './redis';
import request from 'request-promise-native';
import {RedisCall, Trial} from '@elf/protocol';
import {Log} from '@elf/util';

async function sendBackData(body) {
    try {
        const token = XJWT.encode(XJWTType.SYS);
        const response = await request({
            url: `http://ilab-x.com/project/log/upload?xjwt=${encodeURIComponent(token)}`,
            method: 'POST',
            body,
            json: true
        });
        Log.d(response);
    } catch (e) {
        Log.e('Failed to post data',body);
    }
}

export function runRPC() {
    RedisCall.handle<Trial.Done.IReq, Trial.Done.IRes>(
        Trial.Done.name,
        async ({userId, namespace}) => {
            const phase = namespace as Phase;
            const uid = userId;
            const user = await User.findById(uid);
            if (user) {
                await sendBackData({timestamp: Date.now()});
                user.score += 10;
                await user.save();
                await RedisTools.setUserGameData(uid, phase, {
                    status: UserGameStatus.notStarted
                });
            }
            return {lobbyUrl:setting.lobbyUrl};
        }
    );
}
