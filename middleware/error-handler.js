import logger from "../utils/logger.js";

const isProduction = process.env.NODE_ENV === "production";

// eslint-disable-next-line no-unused-vars -- Express requires all 4 params
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;

  logger.error({
    message: err.message,
    status: statusCode,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  });

  // Hide internals from clients in production
  res.status(statusCode).json({
    status: "error",
    message: isProduction ? "An unexpected error occurred" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export { errorHandler };
