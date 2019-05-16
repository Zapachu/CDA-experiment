import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Label, RangeInput} from 'bespoke-client-util'
import {ICreateParams, CreateParams} from '../interface'
import {FetchType, ROLE} from '../config'

const POSITION_EXAMPLE = `B 280*10 280*10 280*10 280*10 280*10 280*10 280*10 280*10
S 240*10 240*10 240*10 240*10 240*10 240*10 240*10 240*10
`

export const Create: Core.CreateSFC<ICreateParams, FetchType> = ({submitable, setSubmitable, params, setParams}) => {
    const lang = Lang.extractLang({
        edit: ['编辑', 'EDIT'],
        convert: ['转换为物品序列', 'Convert to unit sequence'],
        done: ['完成', 'DONE'],
        [ROLE[ROLE.Seller]]: ['卖家', 'Seller'],
        [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
        Role: ['角色', 'Role'],
        UnitList: ['输入序列', 'Input Sequences'],
        tradeTime: ['时期时长', 'Duration of a period'],
        prepareTime: ['浏览信息时长', 'Time to read game info'],
        privatePrices: ['心理价值序列', 'Private Prices'],
    })
    const [positions, setPositions] = React.useState(POSITION_EXAMPLE)
    React.useEffect(() => {
        setParams({
            prepareTime: 15,
            tradeTime: 180,
            ...convertPositions()
        })
    }, [])
    if (!params.roles) {
        return null
    }
    return <section className={style.create}>
        <ul className={style.baseFields}>
            {
                Object.entries({
                    prepareTime: {
                        min: 10,
                        max: 30,
                        step: 5
                    },
                    tradeTime: {
                        min: 60,
                        max: 300,
                        step: 30
                    }
                }).map(([key, props]) =>
                    <li className={style.baseField} key={key}>
                        <Label label={lang[key]}/>
                        {
                            submitable ?
                                <span>{params[key]}</span> :
                                <RangeInput {...props} {...{
                                    value: params[key],
                                    onChange: ({target: {value}}) => submitable ? null : setParams({[key]: +value})
                                }}/>
                        }
                    </li>)
            }
        </ul>
        <table className={style.positions}>
            <tbody>
            <tr>
                <th>&nbsp;</th>
                <th>{lang.Role}</th>
                <th>{lang.UnitList}</th>
            </tr>
            {
                params.roles.map((role, roleIndex) =>
                    <tr key={roleIndex}>
                        <th>{roleIndex + 1}</th>
                        <td>{lang[ROLE[role]]}</td>
                        <td>
                            <ul className={style.units}>
                                {
                                    params.units[roleIndex].units.map(({price, count}, i) =>
                                        <li className={style.unitPair} key={i}><em>{price}</em>*{count}</li>)
                                }
                            </ul>
                        </td>
                    </tr>
                )
            }
            </tbody>
        </table>
        <div className={style.btnSwitch}>
            {
                submitable ? <a onClick={() => setSubmitable(false)}>{lang.edit}</a> :
                    <a onClick={() => done()}>{lang.done}</a>
            }
        </div>
        {
            submitable ? null
                :
                <div className={style.positionsEditorWrapper}>
                    <div className={style.head}>
                        <label className={style.title}>{lang.privatePrices}</label>
                        <p className={style.tips}>{`( S(Seller)/B(Buyer) price*count )`}</p>
                    </div>
                    <textarea autoFocus={true}
                              value={positions}
                              className={style.positionsEditor}
                              rows={positions.split('\n').length}
                              onChange={({target: {value}}) => setPositions(value)}
                    />
                    <a className={style.convert} onClick={() => {
                        setParams({
                            ...convertPositions()
                        })
                    }}>{lang.convert}</a>
                </div>
        }
    </section>

    function convertPositions(): ICreateParams {
        const roles: ROLE[] = [],
            units: CreateParams.IUnits[] = []
        positions.split('\n').filter(r => r).forEach(row => {
            const [roleStr, ...unitStrs] = row.split(' ').filter(s => s)
            roles.push(roleStr === 'S' ? ROLE.Seller : ROLE.Buyer)
            units.push({
                units: unitStrs.map(s => {
                    const pair = s.split('*')
                    return {
                        price: +pair[0],
                        count: +pair[1] || 1
                    }
                })
            })
        })
        return {roles, units}
    }

    function done() {
        setSubmitable(true)
        setParams({
            ...convertPositions()
        })
    }
}
