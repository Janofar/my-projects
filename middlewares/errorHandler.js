module.exports = (err, req, res, next) => {
    console.error("Error occurred: handler", err);

    const status = err.status || 500;
    const message = err.message || "An unexpected error occurred";

    if (err.isJoi) {
        return res.status(400).json({
            message: "Validation Error",
            details: err.details.map((detail) => detail.message),
        });
    }

    if (err.name === "MongoServerError" && err.code === 11000) {
        return res.status(400).json({
            message: "Duplicate field error",
            details: err.keyValue,
        });
    }

    res.status(status).json({
        message,
        details: err.details || null,
    });
};
