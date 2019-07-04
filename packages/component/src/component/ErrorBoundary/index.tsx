import * as React from 'react'
import * as style from './style.scss'

export class ErrorBoundary extends React.Component<{},{
    crashed:boolean
}> {
    state = {crashed:false}

    componentDidCatch() {
        this.setState({crashed:true})
    }

    render(){
        if(this.state.crashed){
            return <section className={style.blankMsg}>
                <div>Oops! Something crashed...</div>
                <a onClick={()=>location.reload()}>Click to Reload</a>
            </section>
        }
        return this.props.children
    }
}
