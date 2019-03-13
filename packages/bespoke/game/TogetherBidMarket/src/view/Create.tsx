import * as React from 'react'
import {ICreateParams} from '../interface'
import {Core} from 'bespoke-client-util'

export class Create extends Core.Create<ICreateParams, any> {
    state = {
        params: {}
    }

    inputParams = (e) => this.setState({params: Object.assign({}, this.state.params, {[e.target.name]: e.target.value})})

    render() {
        return <div>
            <ul>
                <li>玩家数量: <input name='num' onChange={this.inputParams}/></li>
                <li>买家价值下限: <input name='buyerL' onChange={this.inputParams}/></li>
                <li>买家价值上限: <input name='buyerH' onChange={this.inputParams}/></li>
                <li>卖家成本下限: <input name='sellerL' onChange={this.inputParams}/></li>
                <li>卖家成本上限: <input name='sellerH' onChange={this.inputParams}/></li>
            </ul>
        </div>
    }
}
