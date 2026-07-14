const ApiError = require('../errors/Api')
const {statusCodes} = require('http-status-codes')



class UnAuthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

module.exports = UnAuthorizedError