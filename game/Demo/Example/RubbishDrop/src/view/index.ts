import { registerOnFramework } from '@bespoke/client'
import { namespace } from '../config'
import { Play } from './Play'

registerOnFramework(namespace, { Play })
;(function(doc, win) {
  if (location.pathname.indexOf('login') > -1) return
  const html = doc.getElementsByTagName('html')[0],
    body = doc.getElementsByTagName('body')[0],
    reEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
    reFontSize = function() {
      const clientW = doc.documentElement.clientWidth || doc.body.clientWidth
      if (!clientW) {
        return
      }
      html.style.fontSize = 100 * (clientW / 375) + 'px'
      body.style.fontSize = 20 + 'px'
    }
  win.addEventListener(reEvt, reFontSize)
  doc.addEventListener('DOMContentLoaded', reFontSize)
})(document, window)
