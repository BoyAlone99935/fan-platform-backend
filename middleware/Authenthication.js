const UnauthenticatedError = require('../errors/UnauthenticatedError');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError(
            "Authentication required"
        );
    }

    const token = authHeader.split(' ')[1];

    const payload =
        jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
        userId: payload.userId
    };

    next();
};

module.exports = auth;