import React from 'react';
import {Toast} from '@elf/component';
import {Api} from '../util';
import style from './style.less';
import {iLabX, ResCode} from '@micro-experiment/share';
import {RouteComponentProps} from 'react-router-dom';

export function Login({history}: RouteComponentProps) {
    const [username, setUserName] = React.useState(''),
        [password, setPassword] = React.useState('');

    async function login() {
        if (!username) {
            return Toast.warn('请输入手机号/用户名/邮箱');
        }
        if (!password) {
            return Toast.warn('请输入密码');
        }
        const {code, msg} = await Api.loginIn(username, password);
        if (code === ResCode.success) {
            Toast.success('登录成功');
            history.push('/');
        } else {
            switch (msg) {
                case iLabX.ResCode.errorUserName:
                    Toast.error('未找到该用户');
                    break;
                case iLabX.ResCode.errorPwd:
                    Toast.error('密码有误');
                    break;
                default:
                    Toast.error('未知错误');
            }
        }
    }

    async function asGuest() {
        const {code} = await Api.asGuest();
        if (code === iLabX.ResCode.success) {
            history.push('/');
        } else {
            Toast.error('未知错误');
        }
    }

    return <section className={style.login}>
        <div className={style.loginBody}>
            <h1>金融市场与算法交易-登录</h1>
            <input placeholder="手机号/用户名/邮箱" value={username} onChange={({target: {value}}) => setUserName(value)}/>
            <input type='password' placeholder="密码" value={password}
                   onChange={({target: {value}}) => setPassword(value)}/>
            <button style={{opacity: .8}} onClick={() => login()}>立即登录</button>
            <button onClick={() => asGuest()}>免注册体验</button>
            <div className={style.iLabXBtns}>
                <a href="http://www.ilab-x.com/register">注册</a>
                <a href="http://www.ilab-x.com/find/password">忘记密码</a>
            </div>
        </div>
    </section>;
}