import {resolve} from 'path'
import {readdirSync, writeFileSync} from 'fs'

const fileNames = readdirSync(resolve(__dirname, '../resource/img'))

writeFileSync(resolve(__dirname, '../lib/imgGroup.ts'),
    `function loadImg(src: string) {
    return new Promise<HTMLImageElement>(resolve => {
        const img = new Image()
        img.src = src
        img.onload = () => resolve(img)
    })
}

export async function loadImgGroup() {
    return {
        ${fileNames
        .map(fileName => `${fileName.split('.')[0]} : await loadImg(require('../resource/img/${fileName}'))`)
        .join(',\n\t\t')}
    }
}

export type TImgGroup = {
    ${fileNames
        .map(fileName => `${fileName.split('.')[0]}: HTMLImageElement`)
        .join(',\n\t')}
}`
)
