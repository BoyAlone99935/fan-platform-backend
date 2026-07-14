const ApiError = require("../errors/Api");

const { StatusCodes } = require("http-status-codes");

class NotFoundError extends ApiError {

  constructor(message = "Resource Not Found") {
    super(StatusCodes.NOT_FOUND, message);
  }

}

module.exports = NotFoundError;