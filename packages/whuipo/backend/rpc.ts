import XJWT, {Type as XJWTType} from './XJWT';
import {Phase, UserGameStatus} from '@micro-experiment/share';
import {User} from './models';
import setting from './setting';
import {RedisTools} from './redis';
import request from 'request-promise-native';
import {RedisCall, Trial} from '@elf/protocol';
import {Log} from '@elf/util';

export async function sendBackData(iLabXUserName: string, childProjectTitle:string) {
    //TODO 字段待完善
    const score = ~~(Math.random() * 30 + 70), timeUsed = (Math.random() * 10 + 2);
    const data = {
        username: iLabXUserName,
        projectTitle: '金融市场与算法交易虚拟仿真教学平台',
        childProjectTitle,
        status: '1',
        score,
        startDate: Date.now() - ~~(timeUsed * 6e4 - Math.random() * 1e4),
        endDate: Date.now(),
        timeUsed: ~~timeUsed,
        issuerId: setting.issuerId
    };
    try {
        const token = XJWT.encode(XJWTType.SYS, data);
        const response = await request({
            url: `${setting.iLabXGateWay}/project/log/upload?xjwt=${encodeURIComponent(token)}`
        });
        Log.d(response);
    } catch (e) {
        Log.e('Failed to post data', data);
    }
}

export async function sendUserStatus(userName: string) {
    const _xjwt = XJWT.encode(XJWTType.SYS, {
        username: userName,
        issuerId: setting.issuerId
    });
    const xjwt = encodeURIComponent(_xjwt);
    const response = await request({
        url: `${setting.iLabXGateWay}/third/api/test/result/upload?xjwt=${xjwt}`
    });
    Log.d(response);
}

export function runRPC() {
    RedisCall.handle<Trial.Done.IReq, Trial.Done.IRes>(
        Trial.Done.name,
        async ({userId, namespace}) => {
            const phase = namespace as Phase;
            const uid = userId;
            const user = await User.findById(uid);
            if (user) {
                await sendUserStatus(user.iLabXUserName);
                await sendBackData(user.iLabXUserName, {
                    [Phase.IPO_Median]: '中位数定价',
                    [Phase.IPO_TopK]: '荷兰式拍卖',
                    [Phase.IPO_FPSBA]: '第一价格密封拍卖',
                    [Phase.OpenAuction]:'公开竞价拍卖',
                    [Phase.TBM]:'集合竞价',
                    [Phase.CBM]: '连续竞价',
                    [Phase.CBM_L]: '融资融券',
                }[phase]);
                user.score += 10;
                await user.save();
                await RedisTools.setUserGameData(uid, phase, {
                    status: UserGameStatus.notStarted
                });
            }
            return {lobbyUrl: setting.lobbyUrl};
        }
    );
}
