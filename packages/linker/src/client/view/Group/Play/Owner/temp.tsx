import * as React from 'react'
import * as style from './style.scss'

import {configs, baseEnum} from 'anlint-bespoke-core-config'
import {tsConnect, TConnectProps} from '@lib/utilFunction'
import {Btn2, Toast, MaskLoading} from '@Component'
import {GET, POST, urls} from "@Api"
import {TResult} from '../../Result'

declare type TGameResultState={
    loading:boolean
    result:{[userId:string]:TResult}
}

class GameResult extends React.Component<TConnectProps, TGameResultState>{
    state={
        loading:true,
        result:{}
    }

    componentDidMount(){
        const {lang, game:{id:gameId},user:{id:userId,role}} = this.props
        GET(urls.getResult, {gameId}, {userId, role}).then(({code, result})=>{
            if(code !== baseEnum.HTTP_CODE.Success){
                Toast.error(lang.GetResultFailed)
            }else{
                this.setState({
                    loading:false,
                    result
                })
            }
        })
    }

    render(){
        const {lang, game, view} = this.props,
            {loading, result} = this.state
        return loading? <MaskLoading/>:
            <section className={style.gameResult}>
            <div className={style.extraMenuBar}>
            <h3 className={style.title}>{lang.Console_GameResult}</h3>
                <div className={style.btnGroup}>
            <Btn2 {...{
                    type:Btn2.Types.flat,
                    color:Btn2.Colors.blue,
                    icon:'analytics',
                    onClick:()=>location.href = `/${configs.rootName}/result/${game.id}`
                }}/>
        </div>
        </div>
        <table className={style.resultTable}>
            <tr>
                <th>{lang.Console_Player}</th>
            <th>{lang.Console_Point}</th>
            <th colSpan={2}>{lang.Result}</th>
            <th>{lang.Console_Award}</th>
            </tr>
        {
            view.sortResult(Object.entries(result)).map(([playerId,result])=>{
                const {name, point, params} = result as TResult
                return <tr key={playerId}>
                    <td>{name}</td>
                    <td style={{fontWeight:'bold'}}>{point}</td>
                <td colSpan={2}>{
                        view.renderResult4Owner({lang, params})
                    }</td>
                    <td>
                    <ConnectedRewardPanel {...{
                            playerId,
                            result
                        }}/>
                </td>
                </tr>
            })
        }
        </table>
        </section>
    }
}

export default tsConnect(GameResult)

declare type TRewardPanelProps={
    playerId:string
    result:TResult
}

declare type TRewardPanelState={
    money:number|string
    rewarding:boolean
    reward:number
}

class RewardPanel extends React.Component<TConnectProps&TRewardPanelProps, TRewardPanelState>{
    constructor(props){
        super(props)
        this.state={
            money:'',
            rewarding:false,
            reward: Number(props.result.reward)
        }
    }

    render(){
        const {lang, game, user, playerId, result} = this.props,
            {money, rewarding, reward} = this.state
        return user.id === result.user._id? null:
            <section className={style.rewardPanel}>
            <div className={style.rewardedMoney}>
                <label>{lang.Console_RewardedMoney}</label>
                <em>{reward}</em>
                <a {...{
            className:style.withdrawBtn,
                onClick:()=>{
                POST(urls.academus_postBespokeWithdrawAward, {gameId:game.id} ,null , {
                    type: 10,
                    tasker: playerId,
                    payee: result.user._id,
                }).then(({err})=>{
                    if(err !== baseEnum.HTTP_CODE_ACADEMUS.Success){
                        Toast.error(lang.WithdrawFailed)
                    }else{
                        Toast.success(lang.WithdrawSuccess)
                        this.setState({
                            money:'',
                            rewarding:false,
                            reward: 0
                        })
                    }
                })
            }
        }}>{lang.Console_WithdrawAward}</a>
        </div>
        <div className={style.rewardInputSpan}>
            <input {...{
                    className:`${style.rewardInput} ${rewarding?style.active:''}`,
                    type:'number',
                    value:money,
                    onChange:(({target:{value:money}})=>this.setState({money}))
                }}/>
        <a {...{
            className:style.rewardBtn,
                onClick:()=>{
                if(rewarding){
                    const _money = Number(money)
                    if(isNaN(_money) || _money<=0){
                        return Toast.warning(lang.InvalidAwardAmount)
                    }
                    POST(urls.academus_postBespokeAward, {gameId:game.id} ,null , {
                        money,
                        type: 10,
                        task: game.id,
                        tasker: playerId,
                        id: result.user._id,
                        name: result.user.name
                    }).then(({err})=>{
                        if(err !== baseEnum.HTTP_CODE_ACADEMUS.Success){
                            Toast.error(lang.RewardFailed)
                        }else{
                            Toast.success(lang.RewardSuccess)
                            this.setState({
                                money:'',
                                rewarding:false,
                                reward: reward + _money
                            })
                        }
                    })
                }else{
                    this.setState({
                        rewarding:true
                    })
                }
            }
        }}>{rewarding?lang.Submit:lang.Console_AwardTo}</a>
        </div>
        </section>
    }
}

const ConnectedRewardPanel = tsConnect(RewardPanel)