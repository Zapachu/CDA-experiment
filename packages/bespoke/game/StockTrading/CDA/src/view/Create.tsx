import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, BtnGroup, Label, RangeInput} from 'bespoke-client-util'
import {ICreateParams} from '../interface'
import {FetchType, ROLE} from '../config'
import {getEnumKeys} from '../util'

const roleKeys = getEnumKeys(ROLE)

export const Create: Core.CreateSFC<ICreateParams, FetchType> = ({submitable, setSubmitable, params, setParams}) => {
    const lang = Lang.extractLang({
        Add: ['添加', 'Add'],
        Remove: ['移除', 'Remove'],
        [ROLE[ROLE.Seller]]: ['卖家', 'Seller'],
        [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
        Role: ['角色', 'Role'],
        UnitList: ['输入序列', 'Input Sequences'],
        tradeTime: ['时期时长', 'Duration of a period'],
        prepareTime: ['浏览信息时长', 'Time to read game info'],
        invalidInputSequences: ['输入序列有误', 'Invalid input sequences']
    })

    React.useEffect(() => {
        const roles = [...Array(1).fill(ROLE.Seller), ...Array(1).fill(ROLE.Buyer)]
        setParams({
            roles,
            prepareTime: 15,
            tradeTime: 180,
            units: roles.map(role => ({
                    units: (role === ROLE.Buyer ? [200, 200, 200, 200, 200] : [185, 185, 185, 185, 185]).map(price => ({
                        price: +price,
                        count: 10
                    }))
                })
            )
        })
    }, [])

    if (!params.roles) {
        return null
    }
    return <section className={style.create}>
        <div className={style.btnGroup}>
            <a className={style.btnAdd}
               onClick={() => setParams({roles: [...params.roles, params.roles.slice().pop()]})}>{lang.Add}</a>
            <a onClick={() => setParams({roles: params.roles.slice(0, -1)})
            }>{lang.Remove}</a>
        </div>
        <ul className={style.roles}>
            {
                params.roles.map((role, roleIndex) =>
                    <li className={style.role} key={roleIndex}>
                        <span className={style.positionSeq}>{roleIndex + 1}</span>
                        <BtnGroup value={roleKeys.findIndex(key => role === ROLE[key])}
                                  options={roleKeys.map(key => lang[key])}
                                  onChange={i => {
                                      const roles = params.roles.slice()
                                      roles[roleIndex] = ROLE[roleKeys[i]]
                                      setParams({roles})
                                  }}
                        />
                    </li>)
            }
        </ul>
        <ul className={style.baseFields}>
            {
                Object.entries({
                    prepareTime: {
                        min: 10,
                        max: 30,
                        step: 1
                    },
                    tradeTime: {
                        min: 60,
                        max: 300,
                        step: 30
                    }
                }).map(([key, props]) =>
                    <li key={key}>
                        <Label label={lang[key]}/>
                        <RangeInput {...props} {...{
                            value: params[key],
                            onChange: ({target: {value}}) => setParams({[key]: +value})
                        }}/>
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
{/*                            <input {...{
                                className: style.unitList,
                                value: params.unitLists[roleIndex],
                                onChange: (({target: {value: newUnitList}}) => {
                                    const unitLists = params.unitLists.slice()
                                    unitLists[roleIndex] = newUnitList.replace(/[^*\s0-9]/g, '').replace(/\s+/g, ' ')
                                    setParams({unitLists})
                                })
                            }}/>*/}
                        </td>
                    </tr>)
            }
            </tbody>
        </table>
    </section>
}
