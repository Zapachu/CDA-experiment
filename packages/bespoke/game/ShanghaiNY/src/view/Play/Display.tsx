import * as React from 'react'
import * as style from './style.scss'

interface PropsType {
  data?: {
    p11: number,
    p21: number,
    p22: number,
  }
}

const Display: React.FunctionComponent<PropsType> = ({data}) => {
  return <table className={style.display}>
    <tbody>
      <tr>
        <td></td>
        <td></td>
        <td colSpan={2}>组内最低的选择</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>1</td>
        <td>2</td>
      </tr>
      <tr>
        <td rowSpan={2}>你的选择</td>
        <td>选1</td>
        <td className={style.data}>{data ? data.p11 : 'π11'}</td>
        <td>不可能出现</td>
      </tr>
      <tr>
        <td>选2</td>
        <td className={style.data}>{data ? data.p21 : 'π21'}</td>
        <td className={style.data}>{data ? data.p22 : 'π22'}</td>
      </tr>
    </tbody>
  </table>
}

export default Display;