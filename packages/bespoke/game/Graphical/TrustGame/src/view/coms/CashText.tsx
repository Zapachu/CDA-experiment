import * as React from "react"

const CashText = ({val, transform}: {val: string, transform: string}) => {
    return <g transform={transform}>
        <a>{val}</a>
    </g>
}

export default CashText
