module.exports = function (config = {}, options = {}) {
    config.module.rules.push({
        test: /\.(sass|scss)$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    modules: true
                }
            },
            'sass-loader?indentedSyntax=false'
        ]
    })
    return config
}