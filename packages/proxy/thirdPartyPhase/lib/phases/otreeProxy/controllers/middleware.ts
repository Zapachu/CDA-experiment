const hasServer = (req, res, next) => {
    if (!req.session.otreeHost) {
        return res.send('Not Allowed')
    }
    next()
}

export {
    hasServer
}
