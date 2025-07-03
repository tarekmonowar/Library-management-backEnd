export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    if (err.name === "CastError")
        err.message = "Invalid ID";
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
