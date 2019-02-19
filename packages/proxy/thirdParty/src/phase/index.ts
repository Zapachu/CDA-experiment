import {IPhaseTemplate} from '@core/client'

export function registerOnFramework(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    if(window['elfCore']){
        window['elfCore'].registerPhaseCreate(namespace, phaseTemplate)
    }
    if(window['clientCore']){
        window['clientCore'].registerPhasePlay(namespace, phaseTemplate)
    }
}