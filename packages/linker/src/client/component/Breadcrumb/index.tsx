import * as React from 'react'
import * as style from './style.scss'
import {Link} from 'react-router-dom'
import {History} from 'history'

interface IBreadcrumbProps {
    history: History,
    links: Array<{
        to: string,
        label: string
    }>
}

export const Breadcrumb: React.SFC<IBreadcrumbProps> = ({history, links}) => <section className={style.breadcrumbs}>
    {
        links.map(({label, to}, i) => <React.Fragment key={i}>
            <Link to={to}>{label}</Link>
            {
                i < links.length - 1 ? <span className={style.separator}>/</span> : null
            }
        </React.Fragment>)
    }
</section>