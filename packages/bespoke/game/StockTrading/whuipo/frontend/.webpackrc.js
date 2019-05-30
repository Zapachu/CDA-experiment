module.exports = {
    "proxy": {
        "/api": {
            "target": "http://192.168.56.1:3020",
            "changeOrigin": true
        },
        "/socket": {
            "target": "http://192.168.56.1:3020",
            "changeOrigin": true,
            "ws": true
        }
    },
    // sass: {}
}
