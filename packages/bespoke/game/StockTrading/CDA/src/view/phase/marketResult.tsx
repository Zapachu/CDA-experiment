import * as React from 'react'
import * as style from './style.scss'
import {Lang, Button, FrameEmitter, IGame} from 'bespoke-client-util'
import {BasePhase} from './BasePhase'
import {MoveType, PushType} from '../../config'
import {ICreateParams, IMoveParams, IPushParams} from '../../interface'

class Play extends BasePhase.Play {
    lang = Lang.extractLang({
        title1: ['在 ', 'Here are your transactions and profits in last '],
        title2: [' 期的市场实验中，您每期的交易及盈利情况如下：', ' periods :'],
        period: ['时期', 'Peroid'],
        tradedCount: ['交易单位', 'Traded Count'],
        profit: ['利润', 'Profit'],
        footLabel1: ['在该部分的实验中，您的收益为：', 'In this part of the game, your income is: '],
        footLabel2: [' 实验币，可换算为', ' game currency, can be converted to RMB'],
        footLabel3: [' 人民币', ''],
        total: ['合计', 'Total']
    })

    render() {
        const {props: {game, frameEmitter}} = this
        return <section>
            <PhaseOver {...{game, frameEmitter}}/>
        </section>
    }
}

export default {Play}

export const PhaseOver: React.FC<{
    game: IGame<ICreateParams>,
    frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
}> = ({game, frameEmitter}) => {
    return <section className={style.phaseOver}>
        <p>您已完成该部分的实验，请在实验说明的结果记录表上填写您该部分的实验收益。</p>
        <p>点击下方按钮，跳转到输入快速加入码页面，并耐心等待实验员发放下一部分实验的快速加入码。</p>
        <div className={style.btnWrapper}>
            <Button {...{
                label: '进入实验下一部分',
                onClick: () => game.params.nextPhaseKey ?
                    frameEmitter.emit(MoveType.sendBackPlayer) :
                    location.href = '/bespoke/join'
            }}/>
        </div>
    </section>
}
