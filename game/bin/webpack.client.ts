import { resolve } from 'path'
import { geneClientBuilder } from '@bespoke/server/script/buildGame'

const project = process.env.PROJECT
let namespace = project.split('/').pop()
try {
  namespace = require(`../${project}/bespoke.json`).namespace
} catch (e) {}
export = geneClientBuilder({
  namespace,
  basePath: resolve(__dirname, `../${project}`)
})
