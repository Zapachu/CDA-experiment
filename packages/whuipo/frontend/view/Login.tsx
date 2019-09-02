import React from 'react'
import {Toast} from '@elf/component'
import {Api} from '../util'
import style from './style.less'
import {iLabX} from '@micro-experiment/share'
import {RouteComponentProps} from 'react-router-dom'

export function Login({history}:RouteComponentProps) {
    const [username, setUserName] = React.useState(''),
        [password, setPassword] = React.useState('')

    async function login() {
        if (!username) {
            return Toast.warn('请输入手机号/用户名/邮箱')
        }
        if (!password) {
            return Toast.warn('请输入密码')
        }
        const {code, msg} = await Api.loginIn(username, password)
        if(code === iLabX.ResCode.success){
            Toast.success('登录成功')
            history.push('/')
        }else {
            Toast.error(msg)
        }
    }

    return <section className={style.login}>
        <div className={style.loginBody}>
            <h1>国家虚拟仿真实验教学项目共享平台-登录</h1>
            <input placeholder="手机号/用户名/邮箱" value={username} onChange={({target: {value}}) => setUserName(value)}/>
            <input type='password' placeholder="密码" value={password}
                   onChange={({target: {value}}) => setPassword(value)}/>
            <button onClick={() => login()}>立即登录</button>
            <div className={style.iLabXBtns}>
                <a href="http://www.ilab-x.com/register">注册</a>
                <a href="http://www.ilab-x.com/find/password">忘记密码</a>
            </div>
        </div>
    </section>
}