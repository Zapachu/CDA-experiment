import * as React from 'react'
import * as style from './style.scss'
import {Dice} from '@dev/client'
import {Role} from '../../config'

interface IMatrixProps {
    roleNames: { [key: number]: string }
    options: string[]
    matrix: number[][][]
    dices?: number[]
    activeRow?: number
    activeCol?: number
    dieRoll?: number
}

interface IMatrixState {
    dieRoll: number
}

export class Matrix extends React.Component<IMatrixProps, IMatrixState> {
    interval: number

    state = {
        dieRoll: 1
    }

    componentDidMount() {
        this.interval = window.setInterval(() => {
            this.setState({
                dieRoll: ~~(Math.random() * 6) + 1
            })
        }, 100)
        setTimeout(() => {
            clearInterval(this.interval)
            this.setState({
                dieRoll: this.props.dieRoll
            })
        }, 2000)
    }

    render() {
        const {roleNames, options, matrix, dices, activeRow, activeCol} = this.props,
            {dieRoll} = this.state
        return <section
            className={`${style.matrix} ${!this.props.dieRoll || dices.includes(dieRoll) ? '' : style.disabled}`}>
            {
                !dices ? null :
                    <div>
                        <div className={style.matrixTitle}>Table for</div>
                        <ul className={style.dices}>
                            {
                                dices.map((number, i) => <li key={i}><Dice {...{number}}/></li>)
                            }
                        </ul>
                    </div>
            }
            <table>
                <tbody>
                <tr>
                    <td className={style.svgWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='100%' viewBox='0,0,100,32'>
                            <text x='8' y='32' className={style.roleName}>{roleNames[Role.A]}</text>
                            <text x='55' y='12' className={style.roleName}>{roleNames[Role.B]}</text>
                            <polygon points="0,0 100,32" stroke='#eee' strokeWidth='1'/>
                        </svg>
                    </td>
                    {
                        options.map((option, cIndex) =>
                            <td key={cIndex} className={cIndex === activeCol ? style.activeCell : ''}>{option}</td>
                        )
                    }
                </tr>
                {
                    matrix.map((row, rIndex) =>
                        <tr key={rIndex} className={rIndex === activeRow ? style.activeRow : ''}>
                            <td>{options[rIndex]}</td>
                            {
                                row.map((cell, cIndex) =>
                                    <td key={cIndex} className={cIndex === activeCol ? style.activeCell : ''}>
                                        <span>{cell[0]}</span>
                                        &nbsp;/&nbsp;
                                        <span>{cell[1]}</span>
                                    </td>)
                            }
                        </tr>
                    )
                }
                </tbody>
            </table>
        </section>
    }
}