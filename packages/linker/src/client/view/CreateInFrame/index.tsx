import React from 'react'
import {Api, loadScript} from '@client-util'
import {Loading} from '@client-component'
import {baseEnum} from '@common'
import {AddPhase} from '../Phase'

interface ICreateInFrameState {
    loading: boolean
}

export class CreateInFrame extends React.Component<{}, ICreateInFrameState> {
    state: ICreateInFrameState = {loading: true}

    async componentDidMount() {
        const {code, templates} = await Api.getPhaseTemplates()
        if (code === baseEnum.ResponseCode.success) {
            loadScript(templates.reduce((prev, {jsUrl}) => [...prev, ...jsUrl.split(';')], []), () =>
                this.setState({loading:false})
            )
        }
    }

    render(): React.ReactNode {
        const {state: {loading}} = this
        return loading ? <Loading/> : <AddPhase onTagClick={v => console.log(v)}/>
    }
}
