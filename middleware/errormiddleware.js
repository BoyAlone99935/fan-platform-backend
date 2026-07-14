const { stack } = require("../app")

const errorHandler = (err , req , res , next) => {

  const statusCode = err.statusCode || 500


  res.status(statusCode).json({
    sucess : false,
    message : err.message || "internal server error",
    stack : process.env.NODE_ENV === "production" ? null : err.stack
  })

}


module.exports = errorHandler