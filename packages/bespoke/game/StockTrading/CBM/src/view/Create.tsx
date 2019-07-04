import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/register'
import {Label, Lang, Switch} from '@elf/component'
import {ICreateParams} from '../config'

type TPlayProps = Core.ICreateProps<ICreateParams>

export function Create({params, setParams}: TPlayProps) {
    {
        const lang = Lang.extractLang({
            allowLeverage: ['允许杠杆', 'Allow Leverage']
        })
        React.useEffect(() => {
            setParams({allowLeverage: false})
        }, [])
        return <section className={style.create}>
            <Label label={lang.allowLeverage}/>
            <Switch onChange={() => setParams({allowLeverage: !params.allowLeverage})}
                    checked={params.allowLeverage}/>
        </section>

    }
}