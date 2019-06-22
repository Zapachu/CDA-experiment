import {Phase} from 'bespoke-game-stock-trading-config'
import settings from '../settings'

// 实验config文件
export default {
    [Phase.DoubleAuction]: {
        img: `${settings.rootname}/static/sxpm_p.png`,
        name: '双向拍卖'
    },
    [Phase.ParallelApplication]: {
        img: `${settings.rootname}/static/pxzy_p.png`,
        name: '平行志愿'
    }
}