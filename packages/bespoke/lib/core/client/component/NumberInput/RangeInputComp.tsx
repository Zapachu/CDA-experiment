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

class RangeInputComp extends React.Component<propType, {invalid:boolean}> {
    checkIncomingValueDebounced: (object)=>void

    static defaultProps = {
        step: 1,
        min: 0,
        max: 10,
        style: {},
    }

    constructor(props) {
        super(props)
        this.state = {
            invalid: false,
        }
        this.checkIncomingValueDebounced = _debounce(this.checkIncomingValue, 200)
    }

    componentDidUpdate(prevProps) {
        this.checkIncomingValueDebounced(prevProps)
    }

    checkIncomingValue = prevProps => {
        const {value, min, max} = this.props
        const val = Number(value)
        if(isNaN(val)) return this.setState({invalid: true})
        if (value !== prevProps.value) {
            if(val<min) this.setState({invalid: true})
            else if(val>max) this.setState({invalid: true})
            else this.setState({invalid: false})
        }
    }

    render() {
        const { value, min, max, step, onChange, style:propStyle } = this.props
        const {invalid} = this.state
        return (
            <div style={propStyle} className={`${style.RangeInputComp} ${invalid?style.invalid:''}`}>
                <input type='range' 
                        value={value}
                        min={min}
                        max={max}
                        onChange={e => onChange(e.target.value)}
                        step={step}
                />
            </div>
        )
    }
}

export default RangeInputComp
