import * as style from "../style.scss"
import * as dateFormat from "dateformat"
import * as React from "react"

const Stock = () => {
    return <table className={style.infoTable}>
        <thead>
        <tr>
            <td style={{color: '#58c350'}}>证券代码</td>
            <td style={{color: '#58c350'}}>证券简称</td>
            <td style={{color: '#58c350'}}>主承销商</td>
            <td style={{color: '#58c350'}}>初步询价起始日期</td>
            <td style={{color: '#58c350'}}>初步询价截止日期</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>600050</td>
            <td>中国联通</td>
            <td>中国国际金融有限公司</td>
            <td>{dateFormat(Date.now(), 'yyyy/mm/dd')}</td>
            <td>{dateFormat(Date.now(), 'yyyy/mm/dd')}</td>
        </tr>
        </tbody>
    </table>
}

export default Stock
