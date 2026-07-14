const ApiError = require('../errors/Api')
const {statusCodes, StatusCodes} = require('http-status-codes')

class BadRequestError extends ApiError {
    constructor(message = "Bad request") {
       super(StatusCodes.BAD_REQUEST , message )
    }
}


module.exports = BadRequestError