import * as React from 'react'
import * as style from './style.scss'

const Modal: React.SFC<PropType> = ({ visible, children }) => {
  return (
    <div className={style.modal} style={visible ? {} : { visibility: 'hidden' }}>
      <div className={style.mask} />
      <div className={style.content}>{children}</div>
    </div>
  )
}

interface PropType {
  visible: boolean
}

export default Modal
