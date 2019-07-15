import {elfSetting} from '@elf/setting'
import {connect as DBConnect, connection as DBConnection} from 'mongoose'

const {mongoUri, mongoUser, mongoPass} = elfSetting
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
