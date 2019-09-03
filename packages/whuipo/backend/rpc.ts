import XJWT, {Type as XJWTType} from './XJWT';
import {Phase, UserGameStatus} from '@micro-experiment/share';
import {User} from './models';
import setting from './setting';
import {PhaseScore, inProduction} from './config';
import {RedisTools} from './redis';
import {URL} from 'url';
import qs from 'qs';
import request from 'request-promise-native';
import {RedisCall, Trial} from '@elf/protocol';
import {Log} from '@elf/util'

async function sendBackData(body) {
    if(!inProduction){
        Log.d(body)
        return
    }
    const token = XJWT.encode(XJWTType.SYS);
    const url = `http://ilab-x.com/project/log/upload?xjwt=${encodeURIComponent(
        token
    )}`;
    const response = await request({
        url,
        method: 'POST',
        body,
        json: true
    });
    Log.d(response)
}

export function runRPC() {
    RedisCall.handle<Trial.Done.IReq, Trial.Done.IRes>(
        Trial.Done.name,
        async ({userId, onceMore, namespace}) => {
            const phase = namespace as Phase;
            const uid = userId;
            const user = await User.findById(uid);
            let lobbyUrl = setting.lobbyUrl;
            if (user) {
                await sendBackData({timestamp: Date.now()});
                const phaseScore = (user.phaseScore || []).slice();
                phaseScore[phase] = PhaseScore[phase];
                user.phaseScore = phaseScore;
                await user.save();
                await RedisTools.setUserGameData(uid, phase, {
                    status: UserGameStatus.notStarted
                });
                if (onceMore) {
                    const urlObj = new URL(lobbyUrl);
                    const queryObj = qs.parse(urlObj.search.replace('?', '')) || {};
                    queryObj.gamePhase = phase;
                    urlObj.search = qs.stringify(queryObj);
                    lobbyUrl = urlObj.toString();
                }
            }
            return {lobbyUrl};
        }
    );
}
