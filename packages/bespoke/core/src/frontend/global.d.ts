declare const NAMESPACE: string
declare const WITH_LINKER: boolean
declare const PRODUCT_ENV: boolean
declare module '*.scss' {
    interface IClassNames {
        [className: string]: string
    }

    const classNames: IClassNames
    export = classNames;
}