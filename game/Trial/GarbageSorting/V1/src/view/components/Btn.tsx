import * as React from 'react'
import * as style from './style.scss'

const IMG_BTN = require('./btn.png')
const IMG_BTN_ACTIVE = require('./btn_active.png')
const IMG_BTN_TRUE = require('./btn_true.png')
const IMG_BTN_FALSE = require('./btn_false.png')
const IMG_BTN_PASS = require('./btn_pass.png')

const Btn: React.SFC<PropType> = ({ status, onClick, className = '' }) => {
  let imgSrc = ''
  const imgStyle = {}
  let imgClass = ''
  let imgOnClick = () => {}
  switch (status) {
    case BTN.default: {
      imgSrc = IMG_BTN
      imgClass = style.btnDefault
      imgOnClick = () => onClick()
      break
    }
    case BTN.active: {
      imgSrc = IMG_BTN_ACTIVE
      imgClass = style.btnActive
      break
    }
    case BTN.true: {
      imgSrc = IMG_BTN_TRUE
      imgClass = style.btnTrue
      break
    }
    case BTN.false: {
      imgSrc = IMG_BTN_FALSE
      imgClass = style.btnFalse
      break
    }
    case BTN.pass: {
      imgSrc = IMG_BTN_PASS
      imgClass = style.btnPass
      imgOnClick = () => onClick()
      break
    }
  }
  return <img className={imgClass + ' ' + className} style={imgStyle} src={imgSrc} onClick={imgOnClick} />
}

export enum BTN {
  default,
  active,
  true,
  false,
  pass
}

interface PropType {
  status: BTN
  onClick?: () => void
  className?: string
}

export default Btn
