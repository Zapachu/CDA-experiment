import * as React from 'react'
import * as style from './style.scss'

export const HistoryTable: React.SFC<{
    historyList: Array<[
        number, string, string, number, number, ...any[]
        ]>
    tableHeads
    options
}> = ({historyList, tableHeads, options}) =>
    <section className={style.historyTable}>
        <table>
            <tbody>
            <tr>
                <td colSpan={tableHeads.length}>History Table</td>
            </tr>
            <tr>
                {
                    tableHeads.map((head,i) => <th key={i}>{head}</th>)
                }
            </tr>
            {!historyList ? null :
                historyList.reverse().map(([Period, RoleAMove, RoleBMove, RoleAEarning, RoleBEarning, ...Other], i) =>
                    <tr key={i}>
                        <td>{Period}</td>
                        <td>{options[RoleAMove]}</td>
                        <td>{options[RoleBMove]}</td>
                        <td>{RoleAEarning}</td>
                        <td>{RoleBEarning}</td>
                        {
                            Other.map((val, i) => <td key={i}>{val}</td>)
                        }
                    </tr>
                )
            }
            </tbody>
        </table>
    </section>