import * as React from "react"
import * as style from './style.scss'

declare interface ICodePanelProps {
    number: number,
    onFinish: (code: string) => void,
    goBack: ()=>void
}

declare interface ICodePanelState {
    code: Array<string>,
    active: number,
    focus: number,
    inputValue: string
}

const Keyboard = {
    row0: {
        one: '1',
        two: '2',
        three: '3',
    },
    row1: {
        four: '4',
        five: '5',
        six: '6',
    },
    row2: {
        seven: '7',
        eight: '8',
        nine: '9',
    },
    row3: {
        Back: 'Back',
        zero: '0',
        Del: 'Del'
    }
}

export class CodePanel extends React.Component<ICodePanelProps, ICodePanelState> {
    state:ICodePanelState = {
        code: new Array(this.props.number).fill(''),
        active: 0,
        focus: -1,
        inputValue: null
    }

    get codeStr(){
        return this.state.code.join('')
    }

    componentDidMount(): void {
        window.addEventListener("keydown", e=>this.handleKeyDown(e))
        window.addEventListener('click', ()=>this.handleClick())
    }

    componentWillUnmount(): void {
        window.removeEventListener('keydown', e=>this.handleKeyDown(e))
        window.removeEventListener('click', ()=>this.handleClick())
    }

    handleKeyDown = (e) => {
        const triggerNum = this.state.code.length - 1
        let number = parseInt(e.keyCode)
        if (number === 8 || number === 46) return this.del()
        // number : 48 ~ 57, 96 ~ 105
        number = number - 48
        if (number > 9) number = number - 96
        if (number > 9 || number < 0) return
        let {code, active, focus} = this.state
        if (focus > -1) {
            code[focus] = number.toString()
            this.setState({
                focus: -1,
                code: [...code]
            })
            return
        }
        code[active] = number.toString()
        if (active === triggerNum) {
            this.props.onFinish(this.codeStr)
            this.setState({
                code: new Array(this.props.number).fill(''),
                active: 0
            })
            return
        }
        active++
        this.setState({code: code, active: active})
    }

    handleClick() {
        this.setState({
            focus: -1
        })
    }

    handleItemClick(i, e) {
        let {active, focus, code} = this.state
        if (i >= active || i === focus) {
            return
        }
        this.setState({
            focus: i,
            inputValue: code[i]
        })
        e.stopPropagation()
    }

    render() {
        const {code, focus, active, inputValue} = this.state
        return <section className={style.codePanel}>
            <div className={style.password}>
                {code.map((c, i) => <span key={i} className={i >= active ? style.disabledClick : ''}
                                          onClick={e => this.handleItemClick(i, e)}>
                        {focus === i ?
                            <input key={'input' + i} ref={input => input && input.focus()} className={style.focusInput}
                                   value={inputValue}/> : c}
                    </span>)}
            </div>
            <div className={style.inputPanel} onClick={e => e.stopPropagation()}>
                {
                    Object.entries(Keyboard).map(([row, keys]) => <div key={row}>
                        {
                            Object.values(keys).map((v) =>
                                <span key={v} className={style.inputKey}
                                      onClick={() => this.setCode(v)}>{v}</span>
                            )
                        }
                    </div>)
                }
            </div>
        </section>
    }

    setCode(key: string) {
        const triggerNum = this.state.code.length - 1
        if (key === Keyboard.row3.Back) {
            this.props.goBack()
            return
        }
        if (key === Keyboard.row3.Del) {
            return this.del()
        }
        let {code, active, focus} = this.state
        if (focus > -1) {
            code[focus] = key
            this.setState({
                focus: -1,
                code: [...code]
            })
        } else {
            code[active] = key
            if (active === triggerNum) {
                this.props.onFinish(this.codeStr)
                this.setState({
                    active: 0,
                    code: new Array(this.props.number).fill('')
                })
                return false
            }
            active++
            this.setState({
                code: code,
                active: active
            })
        }
    }

    del() {
        const {code, active, focus} = this.state
        if (focus > -1) {
            this.setState({
                inputValue: null
            })
            return
        }
        if (code[0] !== null) {
            code[active - 1] = null
            this.setState(prevState => ({
                active: prevState.active - 1,
                code: [...code]
            }))
        }
    }
}