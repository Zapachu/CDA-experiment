'use strict'

import {elfSetting as settings} from 'elf-setting'
import {connect as DBConnect, connection as DBConnection} from 'mongoose'

const {mongoUri, mongoUser, mongoPass} = settings
const dbOptions = mongoUri ? {user: mongoUser, pass: mongoPass, useNewUrlParser: true} :
    {useNewUrlParser: true}

const ConDB = () => {
    DBConnect(mongoUri, dbOptions)
    DBConnection.on('error', (error) => {
        console.log(error)
    })
}

export {
    ConDB
}
