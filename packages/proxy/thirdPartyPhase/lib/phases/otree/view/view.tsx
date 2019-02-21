import * as React from 'react'
import {BaseCreate, Lang} from '@client-vendor'
import * as style from './style.scss'

import {registerOnFramework} from '../../index'
import {fetchData} from '../../common/utils/fetchData'

class Create extends BaseCreate<any> {
    render(): React.ReactNode {
      const {props: {phases, updatePhase, curPhase}} = this

      const lang = Lang.extractLang({
          name: ['结束后跳转至', 'Link To Next Phase'],
          submit: ['保存', 'Save']
      })

      return <section className={style.create}>
          <div className={style.case}>
              <label>{lang.name}</label>
              <ul className={style.suffixPhases}>
                  {
                      phases.map(({key, label}) =>
                          <li key={key}
                              className={`${key === curPhase.param.nextPhaseKey ? style.active : ''}`}
                              onClick={() => updatePhase([key], {nextPhaseKey: key})}>
                              {label || key}
                          </li>
                      )
                  }
              </ul>
          </div>
      </section>
  }
}

const fetchUrl = '/phases/list'
fetchData(fetchUrl)
  .then(res => {
    if (!res.err) {
        res.list.forEach(name => {
          registerOnFramework('otree', {
              localeNames: [name, name],
              Create,
              type: 'otree',
              otreeName: name
          })
        })
    } else {
        console.log(res.msg)
    }
  })
  .catch(e => console.log(e))
