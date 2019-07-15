import * as style from "../style.scss"
import * as React from "react"

const InfoBar = ({text, styles = {}}: { text: string, styles?: object }) =>
    <div style={styles}
         className={style.infoBar}>
        {text}
    </div>

export default InfoBar
