const UnauthenticatedError = require('../errors/UnauthenticatedError')
const jwt = require('jsonwebtoken')
const auth = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        throw new UnauthenticatedError(
            "Authentication required"
        );
    }

    const payload =
        jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
        userId: payload.userId
    };

    next();
};

module.exports = auth