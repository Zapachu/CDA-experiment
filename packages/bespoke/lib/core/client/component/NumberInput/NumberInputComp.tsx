import * as React from 'react'
import * as style from './style.scss'

const _debounce = (fn, delay=0) => {
    let timer;
    return (...args) => {
        const later = () => {
            timer = null
            fn(...args)
        }
        clearTimeout(timer)
        timer = setTimeout(later, delay)
    }
}

export interface propType {
    value: number,
    onChange: (number)=>void,
    step?: number,
    min?: number,
    max?: number,
    style?: object,
}

export interface stateType {
    minus: boolean,
    plus: boolean,
    invalid: boolean,
}

class NumberInputComp extends React.Component<propType, stateType> {
    debouncedCheckIncomingValue: (number)=>void

    static defaultProps = {
        step: 1,
        style: {},
    }

    constructor(props) {
        super(props)
        this.state = {
            minus: true,
            plus: true,
            invalid: false,
        }
        this.debouncedCheckIncomingValue = _debounce(this.checkIncomingValue, 200)
    }

    componentDidMount() {
        this.checkIncomingValue(null)
    }

    componentDidUpdate(prevProps) {
        this.debouncedCheckIncomingValue(prevProps.value)
    }

    checkIncomingValue = prevValue => {
        const {value, min, max} = this.props
        const val = Number(value)
        if(isNaN(val)) return this.setState({invalid: true})
        if(isNaN(min) && isNaN(max)) return
        if (value !== prevValue) {
            if(!isNaN(min) && val===min) this.setState({minus: false, invalid: false})
            else if(!isNaN(min) && val<min) this.setState({minus: false, invalid: true})
            else if(!isNaN(min) && val===max) this.setState({plus: false, invalid: false})
            else if(!isNaN(max) && val>max) this.setState({plus: false, invalid: true})
            else this.setState({invalid: false, minus: true, plus: true})
        }
    }

    render() {
        const {value, onChange, step, style:propStyle} = this.props
        const {minus, plus, invalid} = this.state
        return (
            <div style={propStyle} className={`${style.NumberInputComp} ${invalid?style.invalid:''}`}>
                <input value={value} onChange={e => onChange(Number(e.target.value))} />
                <span className={`${style.counter} ${minus?'':style.disabled}`} onClick={() => onChange(Number(value)-step)}>-</span>
                <span className={`${style.counter} ${plus?'':style.disabled}`} onClick={() => onChange(Number(value)+step)}>+</span>
            </div>
        )
    }
}

export default NumberInputComp
