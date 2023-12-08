const { errorCodes } = require("../utils/errorCodes");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : errorCodes.SERVER_ERROR.code;

    switch (statusCode) {
        case errorCodes.VALIDATION_ERROR.code:
            res.status(errorCodes.VALIDATION_ERROR.code).json({
                title: errorCodes.VALIDATION_ERROR.message,
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case errorCodes.NOT_FOUND.code:
            res.status(errorCodes.NOT_FOUND.code).json({
                title: errorCodes.NOT_FOUND.message,
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case errorCodes.UNAUTHORIZED.code:
            res.status(errorCodes.UNAUTHORIZED.code).json({
                title: errorCodes.UNAUTHORIZED.message,
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case errorCodes.FORBIDDEN.code:
            res.status(errorCodes.FORBIDDEN.code).json({
                title: errorCodes.FORBIDDEN.message,
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case errorCodes.SERVER_ERROR.code:
            res.status(errorCodes.SERVER_ERROR.code).json({
                title: errorCodes.SERVER_ERROR.message,
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        default:
            console.log("No Error, All good!");
            break;
    }
};

module.exports = errorHandler;
