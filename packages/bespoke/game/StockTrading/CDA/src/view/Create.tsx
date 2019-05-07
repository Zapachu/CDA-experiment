import * as React from 'react'
import * as style from './style.scss'
import {assignPosition, mainGame} from './phase'
import {ICreateParams} from '../interface'
import {Core} from 'bespoke-client-util'
import {FetchType, ROLE} from '../config'

export class Create extends Core.Create<ICreateParams, FetchType> {
    componentDidMount() {
        const {props: {setParams}} = this
        const roles = [
            ...Array(6).fill(null).map(() => ROLE.Seller),
            ...Array(6).fill(null).map(() => ROLE.Buyer)
        ]
        setParams({
            roles,
            durationOfEachPeriod: 180,
            time2ReadInfo: 15,
            unitLists: roles.map(role => role === ROLE.Buyer ?
                '325 325 305 260 220' :
                '185 185 235 260 270'
            )
        })
    }

    render(): React.ReactNode {
        const {props: {fetcher, params, setParams}} = this
        if (!params.roles) {
            return null
        }
        return <section className={style.create}>
            <ul className={style.phases}>
                <li className={style.phase}>
                    <div className={style.createWrapper}>
                        <assignPosition.Create {...{
                            params,
                            fetcher,
                            updateParams: newParams => setParams(newParams)
                        }}/>
                    </div>
                </li>
            </ul>
            <ul className={style.phases}>
                <li className={style.phase}>
                    <div className={style.createWrapper}>
                        <mainGame.Create {...{
                            params,
                            fetcher,
                            updateParams: newParams => setParams(newParams)
                        }}/>
                    </div>
                </li>
            </ul>
        </section>
    }
}
