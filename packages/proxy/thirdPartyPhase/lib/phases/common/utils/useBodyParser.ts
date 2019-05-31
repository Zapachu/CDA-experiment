'use strict'

const bodyParser = require('body-parser')

const useBodyParser = (app) => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false, limit: '30mb', parameterLimit: 30000 }))
}

export {
    useBodyParser
}
