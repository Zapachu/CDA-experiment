import * as React from 'react'
import * as style from './style.scss'
import {RouteComponentProps} from 'react-router'
import {baseEnum, config} from 'bespoke-common'
import {Lang, Toast} from 'bespoke-client-util'
import {Api} from '../util'
import {connCtx, rootContext, TRootCtx} from '../context'

declare interface ILoginState {
    nationCode: baseEnum.NationCode
    mobileNumber: string
    verifyCode: string
    counter: number
}

@connCtx(rootContext)
export class Login extends React.Component<TRootCtx & RouteComponentProps<{}>, ILoginState> {
    lang = Lang.extractLang({
        title: ['你的 { 课研助手 } ', 'Your { Experiment Assistant }'],
        mobileNumber: ['手机号', 'Mobile Number'],
        getVerifyCode: ['获取验证码', 'get verify code'],
        verifyCode: ['验证码', 'Verify Code'],
        login: ['登录', 'login'],
        invalidMobileNumber: ['手机号格式有误', 'Invalid mobile number'],
        accountNotExist: ['账号不存在', 'Account not exist'],
        failed2getVcode: ['验证码发送失败', 'Failed to send verify code'],
        loginFailed: ['登录失败', 'Login Failed']
    })

    state: ILoginState = {
        nationCode: baseEnum.NationCode.China,
        mobileNumber: '',
        verifyCode: '',
        counter: 0
    }

    async componentDidMount() {
        const {user} = await Api.getUser()
        if (user) {
            this.props.history.push('/dashboard')
        }
    }

    get mobileNumberValid(): boolean {
        const {nationCode, mobileNumber} = this.state
        let result = true
        if (!mobileNumber) {
            result = false
        }
        switch (nationCode) {
            case 86: {
                result = !!mobileNumber.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)
                break
            }
        }
        if (!result) {
            Toast.warn(this.lang.invalidMobileNumber)
        }
        return result
    }

    async getVerifyCode() {
        if (!this.mobileNumberValid) {
            return
        }
        const {nationCode, mobileNumber} = this.state
        const res = await Api.getVerifyCode(nationCode, mobileNumber)
        switch (res.code) {
            case baseEnum.ResponseCode.success: {
                return this.setState({counter: config.vcodeLifetime}, () => this.countDown())
            }
            case baseEnum.ResponseCode.notFound: {
                return Toast.warn(this.lang.accountNotExist)
            }
            default: {
                Toast.warn(res.msg || this.lang.failed2getVcode)
            }
        }
    }

    async login() {
        const {nationCode, mobileNumber, verifyCode} = this.state
        if (!this.mobileNumberValid || !verifyCode.match(/^\d{6}$/)) {
            return
        }
        const {code, returnToUrl} = await Api.login(nationCode, mobileNumber, verifyCode)
        if (code === baseEnum.ResponseCode.success) {
            location.href = returnToUrl || location.href
        } else {
            Toast.warn(this.lang.loginFailed)
        }
    }

    countDown() {
        const {counter} = this.state
        if (!counter) {
            return
        }
        this.setState({
            counter: counter - 1
        })
        setTimeout(() => this.countDown(), 1000)
    }

    render(): React.ReactNode {
        const {lang, state: {nationCode, mobileNumber}} = this
        return <section className={style.Login}>
            <span className={style.title}>{lang.title}</span>
            <section className={style.inputPanel}>
                <div className={style.label}>{lang.mobileNumber}</div>
                <div className={style.mobileNumberWrapper}>
                    <MobileNumberInput {...{
                        nationCode,
                        mobileNumber,
                        changeNationCode: nationCode => this.setState({nationCode}),
                        changeMobileNumber: mobileNumber => this.setState({mobileNumber})
                    }}/>
                </div>
                <div className={style.label}>{lang.verifyCode}</div>
                <div className={style.verifyCodeWrapper}>
                    <input className={style.verifyCode}
                           type='number'
                           value={this.state.verifyCode}
                           onChange={({target: {value: verifyCode}}) => this.setState({verifyCode})}
                    />
                    {
                        this.state.counter ?
                            <button
                                className={`${style.verifyCodeBtn} ${style.disabled}`}>{this.state.counter}s</button> :
                            <button className={style.verifyCodeBtn}
                                    onClick={() => this.getVerifyCode()}
                            >{lang.getVerifyCode}</button>
                    }
                </div>
                <div className={style.loginBtnWrapper}>
                    <button className={style.loginBtn} onClick={() => this.login()}>{lang.login}</button>
                </div>
            </section>
        </section>
    }
}

declare interface IMobileCodeInputProps {
    nationCode: baseEnum.NationCode
    mobileNumber: string
    changeNationCode: (nationCode: baseEnum.NationCode) => void,
    changeMobileNumber: (mobileNumber: string) => void
}

declare interface IMobileCodeInputState {
    showNationSelector: boolean
}

class MobileNumberInput extends React.Component<IMobileCodeInputProps, IMobileCodeInputState> {
    state: IMobileCodeInputState = {
        showNationSelector: false
    }

    render(): React.ReactNode {
        const {nationCode, mobileNumber, changeMobileNumber, changeNationCode} = this.props
        return <section className={style.mobileNumberInput}>
            <div className={style.nationCode}
                 onClick={() => this.setState({showNationSelector: !this.state.showNationSelector})}
            >
                +{nationCode}
            </div>
            <input className={style.mobileNumber}
                   type='tel'
                   value={mobileNumber}
                   onChange={({target: {value}}) => changeMobileNumber(value)}
            />
            {
                this.state.showNationSelector &&
                <ul className={style.nationCodeSelector}>
                    {
                        Object.entries(baseEnum.NationCode).map(([label, code]) => isNaN(Number(code)) ? null :
                            <li key={label} onClick={() => {
                                changeNationCode(code)
                                this.setState({showNationSelector: false})
                            }}>
                                <span>{label}</span>
                                <span>+{code}</span>
                            </li>
                        )
                    }
                </ul>
            }
        </section>
    }
}