import {Phase} from 'bespoke-game-stock-trading-config'
import settings from '../settings'

// 实验config文件
export default {
    [Phase.TBM]: {
        img: `${settings.rootname}/static/pxzy_p.png`,
        name: '集合竞价',
    },
    [Phase.CBM]: {
        img: `${settings.rootname}/static/sxpm_p.png`,
        name: 'test',
    }
}