import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, baseEnum, Label, Switch, BtnGroup} from 'bespoke-client'
import {FetchType, GameType} from '../config'
import {ICreateParams} from '../interface'

function getEnumKeys<E>(e:{}):Array<string> {
    const keys:Array<string> = []
    for(let key in e){
        if(typeof e[key] === "number"){
            keys.push(key)
        }
    }
    return keys
}

interface ICreateState {
    historyGames: Array<{
        id: string,
        title: string
    }>
}

export class Create extends Core.Create<ICreateParams, FetchType, ICreateState> {

    lang = Lang.extractLang({
        gameType: ['游戏类型', 'Game Type'],
        vsRobot: ['VS机器人', 'VS Robot'],
        robotInputSeq: ['机器人输入序列', 'Robot Input Seq'],
        [GameType[GameType.Card]]:['卡牌实验','Card Game'],
        [GameType[GameType.LeftRight]]:['左右实验','LeftRight Game'],
    })


    state: ICreateState = {
        historyGames: []
    }

    async componentDidMount() {
        const {props: {setParams, fetcher}} = this
        setParams({
            gameType: GameType.Card
        })
        const {code, historyGames} = await fetcher.getFromNamespace(FetchType.getRobotInputSeqList)
        if (code === baseEnum.ResponseCode.success) {
            this.setState({
                historyGames
            })
        }
    }

    render() {
        const {lang, props: {params: {gameType, vsRobot, historyGameId}, setParams}, state: {historyGames}} = this
        return <section className={style.create}>
            <BtnGroup {...{
                size: BtnGroup.Size.small,
                label: lang.gameType,
                options: getEnumKeys(GameType).map(key => lang[key]),
                value: gameType,
                onChange: gameType => setParams({gameType})
            }}/>
            <div>
                <Label label={lang.vsRobot}/>
                <Switch {...{
                    checked: vsRobot,
                    onChange: () => setParams({vsRobot: !vsRobot})
                }}/>
            </div>
            {
                !vsRobot ? null :
                    <div>
                        <Label label={lang.robotInputSeq}/>
                        <select value={historyGameId}
                                onChange={({target: {value}}) => setParams({historyGameId: value})}>
                            {
                                historyGames.map(({id, title}) => <option key={id} value={id}>{title}</option>)
                            }
                        </select>
                    </div>
            }
        </section>
    }
}