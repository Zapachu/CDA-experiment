import * as React from 'react'
import * as style from './style.scss'
import {Link} from 'react-router-dom'
import {History} from 'history'
import {Button} from '@antd-component'

interface IBreadcrumbProps {
    history: History,
    links: Array<{
        to: string,
        label: string
    }>
}

export const Breadcrumb: React.FunctionComponent<IBreadcrumbProps> = ({history, links}) =>
    <section className={style.breadcrumbs}>
        {
            links.map(({label, to}, i) => <Button key={i}>
                <Link to={to}>{label}</Link>
            </Button>)
        }
    </section>
