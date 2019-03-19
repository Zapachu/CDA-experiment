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
  return <section>
    <p>组内最低的选择</p>
    <p>你的选择 1 2</p>
    <p>选1 {data ? data.p11 : 'π11'} 不可能出现</p>
    <p>选2 {data ? data.p21 : 'π21'} {data ? data.p22 : 'π22'}</p>
  </section>
}

export default Display;