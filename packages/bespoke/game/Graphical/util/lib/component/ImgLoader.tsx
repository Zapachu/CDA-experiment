import * as React from 'react'

export function ImgLoader({src, render}: { src: string | Array<string>, render: React.FunctionComponent<{ images: Array<HTMLImageElement> }> }): JSX.Element {
    const srcArr: Array<string> = typeof src === 'string' ? [src] : src
    const [images, setImages] = React.useState(srcArr.map(() => new Image()))
    Promise.all(srcArr.map(src => new Promise<HTMLImageElement>(resolve => {
        const image = new Image()
        image.src = src
        image.onload = () => resolve(image)
    }))).then(images => setImages(images))
    return render({images})
}
