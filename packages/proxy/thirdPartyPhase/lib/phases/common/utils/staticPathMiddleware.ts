import * as express from "express"
import * as path from "path"

export const StaticPathMiddleware = (app, namespace) => {
    app.use(`/${namespace}/static`,
        express.static(path.join(__dirname, '../../../../dist'),
            {maxAge: '10d'}
        )
    )
}
