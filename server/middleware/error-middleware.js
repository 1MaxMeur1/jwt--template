const ApiError = require('../exceptions/qpi-error')

module.exports = function(err, req, res, next) {
    console.log(err)
    if (err instanceof ApiError) {
        return res.json(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: 'Something happened on the server side'})
}