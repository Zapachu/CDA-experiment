import * as React from 'react'
import * as style from './style.scss'
import {ResponseCode} from '@bespoke/share'
import {CodePanel, Lang, Toast} from '@elf/component'
import {Api, TPageProps} from '../util'

export function Join({history}: TPageProps) {
    const lang = Lang.extractLang({
        notFound: ['未找到对应实验', 'Experiment not Found'],
        tips: ['输入6位数字快速加入实验', 'Input a 6-digit number to join an experiment']
    })

    async function joinGame(code: string) {
        const res = await Api.joinGameWithCode(code)
        switch (res.code) {
            case ResponseCode.success: {
                history.push(`/info/${res.gameId}`)
                break
            }
            default: {
                Toast.error(lang.notFound)
            }
        }
    }

    return <section className={style.Join}>
        <div className={style.tips}>{lang.tips}</div>
        <CodePanel number={6}
                   onFinish={code => joinGame(code)}
                   goBack={() => history.goBack()}
        />
    </section>
}