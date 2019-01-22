import {readdirSync} from 'fs'
import {registerGameLogic} from 'server-vendor'

export function registerGameLogics() {
    readdirSync(__dirname, {withFileTypes: true}).forEach(dirent => {
        if (!dirent.isDirectory()) {
            return
        }
        const namespace = dirent.name
        let Controller, Robot
        try {
            Controller = require(`./${namespace}/Controller`).default
            Robot = require(`./${namespace}/Robot`).default
        } catch (e) {
        }
        registerGameLogic(namespace, {
            Controller,
            Robot
        })
    })

}